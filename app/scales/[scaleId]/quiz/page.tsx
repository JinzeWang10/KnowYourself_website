"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getScaleById, calculateScore, calculateDimensionScores, getScoreLevel, normalizeScore } from '@/lib/scales';
import { calculateANI } from '@/lib/calculateANI';
import { submitAssessmentRecord } from '@/lib/api-client';
import type { QuizResult, UserInfo } from '@/types/quiz';
import type { AssessmentRecord } from '@/types/analytics';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const scaleId = params.scaleId as string;

  const scale = getScaleById(scaleId);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAnswer = (value: number | string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
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
    setIsSubmitting(true);

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

    // ANI量表使用自定义计算
    if (scaleId === 'ani') {
      const aniResult = calculateANI(answersToSubmit);

      // 创建结果对象
      const result: QuizResult = {
        id: `result-${Date.now()}`,
        quizId: scale.id,
        quizTitle: scale.title,
        score: aniResult.totalScore,
        level: aniResult.level,
        completedAt: new Date(),
        answers: Object.entries(answersToSubmit).map(([questionId, answer]) => ({
          questionId,
          // Coerce stored answers to number for scoring. If it's already a number, keep it.
          answer: typeof answer === 'number' ? answer : Number(answer),
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
        const normalizedScore = normalizeScore(scale, aniResult.totalScore);
        const record: AssessmentRecord = {
          id: result.id,
          scaleId: scale.id,
          scaleTitle: scale.title,
          gender: userInfo.gender,
          age: userInfo.age,
          totalScore: aniResult.totalScore,
          normalizedScore,
          level: aniResult.level,
          dimensionScores: result.dimensionScores,
          completedAt: new Date().toISOString(),
        };

        // 异步提交，不阻塞用户
        submitAssessmentRecord(record).catch(err => {
          console.error('提交测评记录失败:', err);
        });
      }

      // 保存到历史记录
      const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
      history.push(result);
      localStorage.setItem('quiz-history', JSON.stringify(history));

      // 清除进度
      localStorage.removeItem(`quiz-progress-${scaleId}`);

      // 跳转到结果页
      router.push(`/scales/${scaleId}/result/${result.id}`);
      return;
    }

    // 其他量表使用常规计算
    // 将 answersToSubmit 转换为 numericAnswers（Record<string, number>）以匹配计算函数接口
    const numericAnswers: Record<string, number> = Object.fromEntries(
      Object.entries(answersToSubmit).map(([k, v]) => [k, typeof v === 'number' ? v : Number(v)])
    ) as Record<string, number>;

    const totalScore = calculateScore(scale, numericAnswers);
    const dimensionScores = calculateDimensionScores(scale, numericAnswers);
    const scoreLevel = getScoreLevel(scale, totalScore);

    // 创建结果对象
    const result: QuizResult = {
      id: `result-${Date.now()}`,
      quizId: scale.id,
      quizTitle: scale.title,
      score: totalScore,
      level: scoreLevel.level,
      completedAt: new Date(),
      answers: Object.entries(answersToSubmit).map(([questionId, answer]) => ({
        questionId,
        // Ensure answer is a number type in the result
        answer: typeof answer === 'number' ? answer : Number(answer),
      })),
      dimensionScores: dimensionScores,
      report: {
        summary: scoreLevel.description,
        details: [],
        recommendations: scoreLevel.suggestions || [],
      },
    };

    // 提交到后台（如果有用户信息）
    if (userInfo) {
      const normalizedScore = normalizeScore(scale, totalScore);
      const record: AssessmentRecord = {
        id: result.id,
        scaleId: scale.id,
        scaleTitle: scale.title,
        gender: userInfo.gender,
        age: userInfo.age,
        totalScore,
        normalizedScore,
        level: scoreLevel.level,
        dimensionScores,
        completedAt: new Date().toISOString(),
      };

      // 异步提交，不阻塞用户
      submitAssessmentRecord(record).catch(err => {
        console.error('提交测评记录失败:', err);
      });
    }

    // 保存到历史记录
    const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    history.push(result);
    localStorage.setItem('quiz-history', JSON.stringify(history));

    // 清除进度
    localStorage.removeItem(`quiz-progress-${scaleId}`);

    // 跳转到结果页
    router.push(`/scales/${scaleId}/result/${result.id}`);
  };

  const handleSubmit = async () => {
    handleSubmitWithAnswers(answers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-purple-50/30">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-200/50 sticky top-0 z-10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
              <div>
                <div className="text-xs font-semibold gradient-text">KnowYourself</div>
                <div className="text-xs text-neutral-600 font-light">{scale.title}</div>
              </div>
            </Link>
            <Link
              href={`/scales/${scaleId}`}
              className="text-sm text-neutral-600 hover:text-primary transition-colors font-medium"
            >
              退出测评
            </Link>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out shadow-glow"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <p className="text-sm text-neutral-600 font-medium">
                第 {currentIndex + 1} / {scale.questions.length} 题
              </p>
              <p className="text-sm text-primary font-semibold">
                {Math.round(progress)}% 完成
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-lg p-10 mb-8 border border-neutral-100 animate-slide-up">
            {/* Question Number & Text */}
            <div className="mb-10">
              <div className="text-sm text-neutral-500 mb-3 font-medium">
                问题 {currentIndex + 1}
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-primary bg-gradient-to-r from-primary-50 to-purple-50 shadow-soft-lg scale-[1.02]'
                        : 'border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 hover:shadow-soft'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary shadow-glow'
                            : 'border-neutral-300 group-hover:border-primary/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-base leading-relaxed transition-colors ${
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
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-8 py-3.5 rounded-xl border-2 border-neutral-300 text-neutral-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-soft hover:shadow-soft-lg"
            >
              ← 上一题
            </button>

            <div className="text-sm text-neutral-600 font-medium bg-neutral-50 px-5 py-2 rounded-full border border-neutral-200">
              {Object.keys(answers).length} / {scale.questions.length} 已回答
            </div>

            <button
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-lg transition-all shadow-soft btn-glow"
            >
              {currentIndex === scale.questions.length - 1
                ? isSubmitting
                  ? '提交中...'
                  : '提交 →'
                : '下一题 →'}
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-neutral-500 mt-6 font-light">
            {!isAnswered
              ? '✨ 请选择一个选项，将自动进入下一题'
              : '✓ 已选择，可点击"上一题"返回修改'}
          </p>
        </div>
      </main>
    </div>
  );
}
