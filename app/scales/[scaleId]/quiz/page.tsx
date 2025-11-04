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
    const totalScore = calculateScore(scale, answersToSubmit);
    const dimensionScores = calculateDimensionScores(scale, answersToSubmit);
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
        answer,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <div>
                <div className="text-xs text-primary font-semibold">心理量表</div>
                <div className="text-xs text-gray-600">{scale.title}</div>
              </div>
            </Link>
            <Link
              href={`/scales/${scaleId}`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              退出测评
            </Link>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">
                第 {currentIndex + 1} / {scale.questions.length} 题
              </p>
              <p className="text-sm text-gray-600">
                {Math.round(progress)}% 完成
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {/* Question Number & Text */}
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">
                问题 {currentIndex + 1}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-base ${
                          isSelected
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-700'
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
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              ← 上一题
            </button>

            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} / {scale.questions.length} 已回答
            </div>

            <button
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark transition"
            >
              {currentIndex === scale.questions.length - 1
                ? isSubmitting
                  ? '提交中...'
                  : '提交 →'
                : '下一题 →'}
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {!isAnswered
              ? '请选择一个选项，将自动进入下一题'
              : '已选择，可点击"上一题"返回修改'}
          </p>
        </div>
      </main>
    </div>
  );
}
