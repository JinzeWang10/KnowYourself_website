"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserInfoFormProps {
  scaleId: string;
  scaleTitle: string;
}

export default function UserInfoForm({
  scaleId,
  scaleTitle,
}: UserInfoFormProps) {
  const router = useRouter();
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState<string>('');
  const [ageError, setAgeError] = useState<string>('');

  useEffect(() => {
    // 检查是否已经填写过用户信息
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      // 如果已经填写过，直接跳转到测试页面
      router.push(`/scales/${scaleId}/quiz`);
    }
  }, [scaleId, router]);

  const validateAge = (value: string): boolean => {
    const ageNum = parseInt(value);
    if (isNaN(ageNum)) {
      setAgeError('请输入有效的年龄');
      return false;
    }
    if (ageNum < 12 || ageNum > 100) {
      setAgeError('年龄必须在12-100之间');
      return false;
    }
    setAgeError('');
    return true;
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAge(value);
    if (value) {
      validateAge(value);
    } else {
      setAgeError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!gender) {
      alert('请选择性别');
      return;
    }

    if (!age) {
      setAgeError('请输入年龄');
      return;
    }

    if (!validateAge(age)) {
      return;
    }

    // 保存用户信息到 localStorage
    const userInfo = {
      gender,
      age: parseInt(age),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // 跳转到测试页面
    router.push(`/scales/${scaleId}/quiz`);
  };

  const canProceed = gender && age && !ageError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <span className="text-xl font-bold text-primary">心理量表</span>
          </Link>
          <Link href={`/scales/${scaleId}/consent`} className="text-gray-600 hover:text-primary transition text-sm">
            返回 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">基本信息</h1>
              <p className="text-gray-600">{scaleTitle}</p>
              <p className="text-sm text-gray-500 mt-2">
                为了提供更准确的评估结果，请填写以下信息
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 性别选择 */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  您的性别 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      gender === 'male'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">👨</div>
                    <div className="text-lg font-medium text-gray-900">男性</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      gender === 'female'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">👩</div>
                    <div className="text-lg font-medium text-gray-900">女性</div>
                  </button>
                </div>
              </div>

              {/* 年龄输入 */}
              <div>
                <label htmlFor="age" className="block text-lg font-semibold text-gray-900 mb-4">
                  您的年龄 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={handleAgeChange}
                  placeholder="请输入您的年龄"
                  min="12"
                  max="100"
                  className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                    ageError
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-primary'
                  }`}
                />
                {ageError && (
                  <p className="mt-2 text-sm text-red-600">{ageError}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  年龄范围：12-100岁
                </p>
              </div>

              {/* 隐私说明 */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-lg">🔒</span>
                  <span>
                    您的个人信息将仅保存在本地设备，用于提供更准确的评估结果。
                    我们不会收集或上传任何个人信息到服务器。
                  </span>
                </p>
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4 justify-center pt-4">
                <Link
                  href={`/scales/${scaleId}/consent`}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  返回
                </Link>
                <button
                  type="submit"
                  disabled={!canProceed}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    canProceed
                      ? 'bg-primary hover:bg-primary-dark text-white shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canProceed ? '开始测评' : '请完善信息'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
