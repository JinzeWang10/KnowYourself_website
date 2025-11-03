"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { QuizResult } from '@/types/quiz';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // 从 localStorage 加载历史记录
    const saved = localStorage.getItem('quiz-history');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // 按时间倒序排列
        const sorted = data.sort(
          (a: QuizResult, b: QuizResult) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
        setHistory(sorted);
      } catch (e) {
        // Failed to load history
      }
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm('确定要清除所有历史记录吗？此操作不可恢复。')) {
      localStorage.removeItem('quiz-history');
      setHistory([]);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      localStorage.setItem('quiz-history', JSON.stringify(updated));
    }
  };

  // 获取唯一的量表ID列表用于筛选
  const quizIds = Array.from(new Set(history.map((item) => item.quizId)));

  // 筛选历史记录
  const filteredHistory =
    filter === 'all'
      ? history
      : history.filter((item) => item.quizId === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-primary hover:text-primary-dark font-semibold">
            ← 返回首页
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              测评历史
            </h1>
            <p className="text-gray-600">
              查看你的所有测评记录和结果
            </p>
          </div>

          {/* Filters & Actions */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Filter */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">
                    筛选:
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">全部量表</option>
                    {quizIds.map((id) => {
                      const item = history.find((h) => h.quizId === id);
                      return (
                        <option key={id} value={id}>
                          {item?.quizTitle}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Clear Button */}
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  清除所有记录
                </button>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-6 text-sm text-gray-600">
                  <div>
                    总测评次数: <span className="font-semibold text-gray-900">{history.length}</span>
                  </div>
                  <div>
                    当前显示: <span className="font-semibold text-gray-900">{filteredHistory.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                暂无测评记录
              </h2>
              <p className="text-gray-600 mb-6">
                完成测评后，结果会自动保存在这里
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                开始测评
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Quiz Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.quizTitle}
                      </h3>

                      {/* Score & Level */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-primary">
                            {item.score}
                          </span>
                          <span className="text-sm text-gray-600">分</span>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full">
                          <span className="text-sm font-semibold text-gray-700">
                            {item.level}
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-sm text-gray-500">
                        完成时间: {new Date(item.completedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() =>
                          router.push(`/scales/${item.quizId}/result/${item.id}`)
                        }
                        className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-4 py-2 text-gray-600 text-sm hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
