"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getScaleById, calculateScore, calculateDimensionScores, getScoreLevel, normalizeScore } from '@/lib/scales';
import { calculateANI } from '@/lib/calculateANI';
import { calculateZHZResults } from '@/lib/scales/zhz';
import { calculatePsychologicalAge } from '@/lib/scales/pat';
import { submitAssessmentRecord } from '@/lib/api-client';
import { getOrCreateUserId } from '@/lib/user-id';
import type { QuizResult, UserInfo } from '@/types/quiz';
import type { AssessmentRecord, AssessmentSubmission } from '@/types/analytics';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const scaleId = params.scaleId as string;

  const scale = getScaleById(scaleId);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  // 从 localStorage 恢复答案
  useEffect(() => {
    if (scale) {
      const saved = localStorage.getItem(`quiz-progress-${scaleId}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setAnswers(data.answers || {});
          setCurrentIndex(data.currentIndex || 0);
        } catch (e) {
          // Failed to restore progress
        }
      } else {
        // 没有保存的进度，确保从头开始
        setAnswers({});
        setCurrentIndex(0);
      }
    }
  }, [scaleId, scale]);

  // 保存答题进度（防抖优化）
  useEffect(() => {
    if (scale && Object.keys(answers).length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(
          `quiz-progress-${scaleId}`,
          JSON.stringify({ answers, currentIndex })
        );
      }, 500); // 500ms后保存

      return () => clearTimeout(timeoutId);
    }
  }, [answers, currentIndex, scaleId, scale]);

  if (!scale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">量表不存在</h1>
          <Link href="/" className="text-primary hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = scale.questions[currentIndex];
  const progress = ((currentIndex + 1) / scale.questions.length) * 100;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  // 检测是否为Likert量表（需要question.type明确标记为'likert'）
  const isLikertScale = currentQuestion.type === 'likert';

  const handleAnswer = (value: number | string, optionIndex: number) => {
    // 存储选项索引而非分数，避免相同分数的选项都被选中
    const newAnswers = { ...answers, [currentQuestion.id]: optionIndex };
    setAnswers(newAnswers);

    // 自动跳转到下一题（延迟300ms让用户看到选中效果）
    setTimeout(() => {
      if (currentIndex < scale.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // 最后一题，自动提交
        handleSubmitWithAnswers(newAnswers);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentIndex < scale.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitWithAnswers = async (answersToSubmit: Record<string, number | string>) => {
    // 防止重复提交
    if (hasSubmitted || isSubmitting) {
      console.log('已提交或正在提交中，忽略重复请求');
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    // 将选项索引转换为实际分数值
    const convertedAnswers: Record<string, number> = {};
    for (const [questionId, optionIndex] of Object.entries(answersToSubmit)) {
      const question = scale.questions.find(q => q.id === questionId);
      if (question && question.options) {
        const index = typeof optionIndex === 'number' ? optionIndex : Number(optionIndex);
        const actualValue = question.options[index]?.value;
        convertedAnswers[questionId] = typeof actualValue === 'number' ? actualValue : Number(actualValue);
      }
    }

    // 获取用户信息
    const userInfoStr = localStorage.getItem('userInfo');
    let userInfo: UserInfo | null = null;
    if (userInfoStr) {
      try {
        userInfo = JSON.parse(userInfoStr);
      } catch (e) {
        console.error('解析用户信息失败');
      }
    }

    // ZHZ量表使用自定义计算
    if (scaleId === 'zhz') {
      const zhzResult = calculateZHZResults(convertedAnswers);

      // 获取最相似的角色名称
      const topCharacterName = zhzResult.metadata?.topCharacters?.[0]?.name || '未知角色';

      // 创建结果对象
      const result: QuizResult = {
        id: `result-${Date.now()}`,
        quizId: scale.id,
        quizTitle: scale.title,
        score: zhzResult.totalScore,
        level: topCharacterName,
        completedAt: new Date(),
        answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
        dimensionScores: zhzResult.dimensionScores.reduce((acc, item) => {
          acc[item.dimension] = item.score;
          return acc;
        }, {} as Record<string, number>),
        report: {
          summary: zhzResult.interpretation,
          details: [],
          recommendations: zhzResult.recommendations,
        },
        metadata: zhzResult.metadata,
      };

      // 提交到后台（如果有用户信息）
      if (userInfo) {
        const userId = getOrCreateUserId();
        const submission: AssessmentSubmission = {
          userId,
          gender: userInfo.gender,
          age: userInfo.age,
          region: undefined,
          record: {
            id: result.id,
            userId,
            scaleId: scale.id,
            scaleTitle: scale.title,
            totalScore: zhzResult.totalScore,
            normalizedScore: zhzResult.totalScore,
            level: topCharacterName,
            dimensionScores: result.dimensionScores,
            completedAt: new Date().toISOString(),
            answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
              questionId,
              answer,
            })),
          },
        };

        submitAssessmentRecord(submission).catch(err => {
          console.error('提交测评记录失败:', err);
        });
      }

      // 保存到历史记录
      const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
      const existingIndex = history.findIndex((r: QuizResult) => r.id === result.id);
      if (existingIndex === -1) {
        history.push(result);
        localStorage.setItem('quiz-history', JSON.stringify(history));
      }

      // 清除进度（路由跳转后会自动卸载组件，不需要立即清除状态）
      localStorage.removeItem(`quiz-progress-${scaleId}`);

      // 跳转到结果页
      router.push(`/scales/${scaleId}/result/${result.id}`);
      return;
    }

    // ANI量表使用自定义计算
    if (scaleId === 'ani') {
      const aniResult = calculateANI(convertedAnswers);

      // 创建结果对象
      const result: QuizResult = {
        id: `result-${Date.now()}`,
        quizId: scale.id,
        quizTitle: scale.title,
        score: aniResult.totalScore,
        level: aniResult.level,
        completedAt: new Date(),
        answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
        dimensionScores: {
          hbi_consequences: aniResult.dimensionScores.hbi_consequences.normalized,
          ppus_functional: aniResult.dimensionScores.ppus_functional.normalized,
          ppcs_relapse_withdrawal: aniResult.dimensionScores.ppcs_relapse_withdrawal.normalized,
          rmsgs_guilt: aniResult.dimensionScores.rmsgs_guilt.normalized,
        },
        report: {
          summary: aniResult.levelDescription,
          details: [],
          recommendations: aniResult.suggestions,
        },
      };

      // 提交到后台（如果有用户信息）
      if (userInfo) {
        const userId = getOrCreateUserId();
        const normalizedScore = normalizeScore(scale, aniResult.totalScore);
        const submission: AssessmentSubmission = {
          userId,
          gender: userInfo.gender,
          age: userInfo.age,
          region: undefined,
          record: {
            id: result.id,
            userId,
            scaleId: scale.id,
            scaleTitle: scale.title,
            totalScore: aniResult.totalScore,
            normalizedScore,
            level: aniResult.level,
            dimensionScores: result.dimensionScores,
            completedAt: new Date().toISOString(),
            answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
              questionId,
              answer,
            })),
          },
        };

        // 异步提交，不阻塞用户
        submitAssessmentRecord(submission).catch(err => {
          console.error('提交测评记录失败:', err);
        });
      }

      // 保存到历史记录（检查是否已存在相同ID的记录）
      const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
      const existingIndex = history.findIndex((r: QuizResult) => r.id === result.id);
      if (existingIndex === -1) {
        // 只有不存在时才添加
        history.push(result);
        localStorage.setItem('quiz-history', JSON.stringify(history));
      } else {
        console.log('记录已存在，跳过添加');
      }

      // 清除进度（路由跳转后会自动卸载组件，不需要立即清除状态）
      localStorage.removeItem(`quiz-progress-${scaleId}`);

      // 跳转到结果页
      router.push(`/scales/${scaleId}/result/${result.id}`);
      return;
    }

    // EQ 量表使用自定义计算（处理正反向题的特殊计分）
    if (scaleId === 'eq' && scale.calculateResults) {
      const eqResult = scale.calculateResults(convertedAnswers);

      // 创建结果对象
      const result: QuizResult = {
        id: `result-${Date.now()}`,
        quizId: scale.id,
        quizTitle: scale.title,
        score: eqResult.totalScore,
        level: eqResult.dimensionScores?.[0]?.dimension || '未知',
        completedAt: new Date(),
        answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
        dimensionScores: eqResult.dimensionScores?.reduce((acc, item: any) => {
          // 使用 dimensionId（英文ID）作为键，如果没有则降级使用中文名称
          const key = item.dimensionId || item.dimension;
          acc[key] = item.score;
          return acc;
        }, {} as Record<string, number>) || {},
        report: {
          summary: eqResult.interpretation,
          details: [],
          recommendations: eqResult.recommendations || [],
        },
      };

      // 提交到后台（如果有用户信息）
      if (userInfo) {
        const userId = getOrCreateUserId();
        const scoreLevel = getScoreLevel(scale, eqResult.totalScore);
        const submission: AssessmentSubmission = {
          userId,
          gender: userInfo.gender,
          age: userInfo.age,
          region: undefined,
          record: {
            id: result.id,
            userId,
            scaleId: scale.id,
            scaleTitle: scale.title,
            totalScore: eqResult.totalScore,
            normalizedScore: eqResult.totalScore, // EQ已经是0-100范围
            level: scoreLevel?.level || '未知',
            dimensionScores: result.dimensionScores,
            completedAt: new Date().toISOString(),
            answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
              questionId,
              answer,
            })),
          },
        };

        submitAssessmentRecord(submission).catch(err => {
          console.error('提交测评记录失败:', err);
        });
      }

      // 保存到历史记录
      const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
      const existingIndex = history.findIndex((r: QuizResult) => r.id === result.id);
      if (existingIndex === -1) {
        history.push(result);
        localStorage.setItem('quiz-history', JSON.stringify(history));
      }

      // 清除进度（路由跳转后会自动卸载组件，不需要立即清除状态）
      localStorage.removeItem(`quiz-progress-${scaleId}`);

      // 跳转到结果页
      router.push(`/scales/${scaleId}/result/${result.id}`);
      return;
    }

    // 其他量表使用常规计算
    const totalScore = calculateScore(scale, convertedAnswers);
    const dimensionScores = calculateDimensionScores(scale, convertedAnswers);
    const scoreLevel = getScoreLevel(scale, totalScore);

    // PAT量表：计算心理年龄
    let metadata: any = undefined;
    if (scaleId === 'pat' && userInfo) {
      const psychologicalAge = calculatePsychologicalAge(totalScore, userInfo.age);
      metadata = {
        actualAge: userInfo.age,
        psychologicalAge,
        ageDifference: psychologicalAge - userInfo.age,
      };
    }

    // 创建结果对象
    const result: QuizResult = {
      id: `result-${Date.now()}`,
      quizId: scale.id,
      quizTitle: scale.title,
      score: totalScore,
      level: scoreLevel?.level || '未知',
      completedAt: new Date(),
      answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
      dimensionScores: dimensionScores,
      report: {
        summary: scoreLevel?.description || '测评完成',
        details: [],
        recommendations: scoreLevel?.suggestions || [],
      },
      metadata,
    };

    // 提交到后台（如果有用户信息）
    if (userInfo && scoreLevel) {
      const userId = getOrCreateUserId();
      const normalizedScore = normalizeScore(scale, totalScore);
      const submission: AssessmentSubmission = {
        userId,
        gender: userInfo.gender,
        age: userInfo.age,
        region: undefined,
        record: {
          id: result.id,
          userId,
          scaleId: scale.id,
          scaleTitle: scale.title,
          totalScore,
          normalizedScore,
          level: scoreLevel.level,
          dimensionScores,
          completedAt: new Date().toISOString(),
          answers: Object.entries(convertedAnswers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        },
      };

      // 异步提交，不阻塞用户
      submitAssessmentRecord(submission).catch(err => {
        console.error('提交测评记录失败:', err);
      });
    }

    // 保存到历史记录（检查是否已存在相同ID的记录）
    const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    const existingIndex = history.findIndex((r: QuizResult) => r.id === result.id);
    if (existingIndex === -1) {
      // 只有不存在时才添加
      history.push(result);
      localStorage.setItem('quiz-history', JSON.stringify(history));
    } else {
      console.log('记录已存在，跳过添加');
    }

    // 清除进度（路由跳转后会自动卸载组件，不需要立即清除状态）
    localStorage.removeItem(`quiz-progress-${scaleId}`);

    // 跳转到结果页
    router.push(`/scales/${scaleId}/result/${result.id}`);
  };

  const handleSubmit = async () => {
    // 检查是否所有必答题都已回答
    const unansweredIndex = scale.questions.findIndex((q) => {
      // 检查题目是否标记为必答（默认所有题目都是必答）
      const isRequired = q.required !== false;
      return isRequired && answers[q.id] === undefined;
    });

    if (unansweredIndex !== -1) {
      // 有未答题，跳转到第一个未答题
      setCurrentIndex(unansweredIndex);
      // 显示警告提示
      setShowUnansweredWarning(true);
      // 3秒后自动隐藏
      setTimeout(() => setShowUnansweredWarning(false), 3000);
      return;
    }

    // 所有题目都已回答，提交
    handleSubmitWithAnswers(answers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-purple-50/30">
      {/* 未答题警告提示 */}
      {showUnansweredWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-in-down">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-glow-lg flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold">请先完成未答题目</p>
              <p className="text-sm opacity-90">已自动跳转到未回答的题目</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass-effect border-b border-neutral-200/50 sticky top-0 z-10 backdrop-blur-xl">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
              <div>
                <div className="text-xs font-semibold gradient-text">KnowYourself</div>
                <div className="text-[10px] sm:text-xs text-neutral-600 font-light line-clamp-1">{scale.title}</div>
              </div>
            </Link>
            <Link
              href={`/scales/${scaleId}`}
              className="text-xs sm:text-sm text-neutral-600 hover:text-primary transition-colors font-medium"
            >
              退出
            </Link>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-1.5 sm:h-2.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out shadow-glow"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 sm:mt-2.5">
              <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                第 {currentIndex + 1} / {scale.questions.length} 题
              </p>
              <p className="text-xs sm:text-sm text-primary font-semibold">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-lg p-4 sm:p-10 mb-4 sm:mb-8 border border-neutral-100 animate-slide-up">
            {/* Question Number & Text */}
            <div className="mb-4 sm:mb-10">
              <div className="text-xs sm:text-sm text-neutral-500 mb-1.5 sm:mb-3 font-medium">
                问题 {currentIndex + 1}
              </div>
              <h2 className="text-base sm:text-2xl font-semibold text-neutral-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            {isLikertScale ? (
              // 横向Likert量表样式
              <div className="space-y-3 sm:space-y-6">
                {/* 标签行 */}
                <div className="flex items-center justify-between px-1 sm:px-2">
                  <span className="text-xs sm:text-sm font-medium text-red-600">
                    {currentQuestion.options![0].label}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-green-600">
                    {currentQuestion.options![currentQuestion.options!.length - 1].label}
                  </span>
                </div>

                {/* 按钮条 */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 py-4 sm:py-6 bg-gradient-to-r from-red-50/50 via-yellow-50/30 to-green-50/50 rounded-xl sm:rounded-2xl border-2 border-neutral-200">
                  {currentQuestion.options?.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === idx;
                    const totalOptions = currentQuestion.options!.length;
                    // 计算颜色：从红色过渡到绿色
                    const colorProgress = idx / (totalOptions - 1);

                    return (
                      <button
                        key={`${currentQuestion.id}-${idx}`}
                        onClick={() => handleAnswer(option.value, idx)}
                        className={`group relative flex-1 aspect-square rounded-full border-3 transition-all duration-300 ${
                          isSelected
                            ? 'scale-125 shadow-lg'
                            : 'hover:scale-110 hover:shadow-md'
                        }`}
                        style={{
                          backgroundColor: isSelected
                            ? `hsl(${colorProgress * 120}, 70%, 50%)`
                            : 'white',
                          borderColor: `hsl(${colorProgress * 120}, 60%, ${isSelected ? '40%' : '70%'})`,
                          borderWidth: isSelected ? '3px' : '2px',
                        }}
                        title={option.label}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 选项标签（可选，显示所有选项文字） */}
                <div className="flex items-start justify-between gap-1 sm:gap-2 px-1 sm:px-2">
                  {currentQuestion.options?.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === idx;
                    return (
                      <div
                        key={`${currentQuestion.id}-label-${idx}`}
                        className={`flex-1 text-center text-[10px] sm:text-xs transition-all ${
                          isSelected
                            ? 'font-bold text-neutral-900'
                            : 'text-neutral-500'
                        }`}
                      >
                        {option.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // 传统垂直选项样式
              <div className="space-y-2 sm:space-y-4">
                {currentQuestion.options?.map((option, optionIndex) => {
                  const isSelected = answers[currentQuestion.id] === optionIndex;
                  return (
                    <button
                      key={`${currentQuestion.id}-option-${optionIndex}`}
                      onClick={() => handleAnswer(option.value, optionIndex)}
                      className={`group w-full text-left p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-gradient-to-r from-primary-50 to-purple-50 shadow-soft-lg scale-[1.02]'
                          : 'border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            isSelected
                              ? 'border-primary bg-primary shadow-glow'
                              : 'border-neutral-300 group-hover:border-primary/50'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full" />
                          )}
                        </div>
                        <span
                          className={`text-sm sm:text-base leading-relaxed transition-colors ${
                            isSelected
                              ? 'text-neutral-900 font-semibold'
                              : 'text-neutral-700 group-hover:text-neutral-900'
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-xl border-2 border-neutral-300 text-neutral-700 text-sm sm:text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-soft hover:shadow-soft-lg whitespace-nowrap"
            >
              ← <span className="hidden xs:inline">上一题</span><span className="xs:hidden">上题</span>
            </button>

            <div className="text-[10px] sm:text-sm text-neutral-600 font-medium bg-neutral-50 px-2 sm:px-5 py-1.5 sm:py-2 rounded-full border border-neutral-200 whitespace-nowrap">
              {Object.keys(answers).length} / {scale.questions.length} <span className="hidden xs:inline">已回答</span>
            </div>

            <button
              onClick={currentIndex === scale.questions.length - 1 ? handleSubmit : handleNext}
              disabled={!isAnswered || isSubmitting}
              className="px-3 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm sm:text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-lg transition-all shadow-soft btn-glow whitespace-nowrap"
            >
              {currentIndex === scale.questions.length - 1
                ? isSubmitting
                  ? '提交中...'
                  : <><span className="hidden xs:inline">提交</span><span className="xs:hidden">交</span> →</>
                : <><span className="hidden xs:inline">下一题</span><span className="xs:hidden">下题</span> →</>}
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-xs sm:text-sm text-neutral-500 mt-3 sm:mt-6 font-light">
            {!isAnswered
              ? '✨ 请选择一个选项，将自动进入下一题'
              : '✓ 已选择，可点击"上一题"返回修改'}
          </p>
        </div>
      </main>
    </div>
  );
}
