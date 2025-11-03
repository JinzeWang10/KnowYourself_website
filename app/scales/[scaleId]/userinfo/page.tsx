"use client";

import { useParams } from 'next/navigation';
import { getScaleById } from '@/lib/scales';
import UserInfoForm from '@/components/UserInfoForm';
import Link from 'next/link';

export default function UserInfoPage() {
  const params = useParams();
  const scaleId = params.scaleId as string;

  const scale = getScaleById(scaleId);

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

  return (
    <UserInfoForm
      scaleId={scale.id}
      scaleTitle={scale.title}
    />
  );
}
