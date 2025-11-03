import type { Metadata } from 'next';
import Link from 'next/link';
import { getScaleById } from '@/lib/scales';
import { notFound } from 'next/navigation';
import ScaleIntroClient from './ScaleIntroClient';

export async function generateMetadata({
  params
}: {
  params: Promise<{ scaleId: string }>
}): Promise<Metadata> {
  const { scaleId } = await params;
  const scale = getScaleById(scaleId);

  if (!scale) {
    return {
      title: '量表不存在 - 心理量表',
    };
  }

  const title = `${scale.title} - 专业心理测评 | 心理量表`;
  const description = `${scale.description}。包含${scale.questionCount}道题目，预计${scale.duration}分钟完成。科学、专业、保密的在线心理测评。`;

  return {
    title,
    description,
    keywords: `${scale.title},${scale.titleEn || ''},心理测评,性健康评估,成瘾测试,${scale.category}`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'zh_CN',
      siteName: '心理量表',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/scales/${scaleId}`,
    },
  };
}

export default async function ScaleIntroPage({
  params
}: {
  params: Promise<{ scaleId: string }>
}) {
  const { scaleId } = await params;
  const scale = getScaleById(scaleId);

  if (!scale) {
    notFound();
  }

  return <ScaleIntroClient scale={scale} scaleId={scaleId} />;
}
