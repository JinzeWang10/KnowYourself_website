import html2canvas from 'html2canvas';

/**
 * 导出DOM元素为图片
 * @param element - 要导出的DOM元素
 * @param filename - 导出的文件名（不含扩展名）
 * @param options - html2canvas配置选项
 * @returns Promise<boolean> - 是否成功导出
 */
export async function exportComponentAsImage(
  element: HTMLElement,
  filename: string = 'share-card',
  options?: {
    quality?: number; // 图片质量 0-1
    scale?: number; // 缩放比例，默认为设备像素比
    backgroundColor?: string; // 背景色
  }
): Promise<boolean> {
  try {
    // 获取元素的实际尺寸
    const rect = element.getBoundingClientRect();

    // 配置 html2canvas 选项
    const canvas = await html2canvas(element, {
      scale: options?.scale || 3, // 使用3倍缩放提高清晰度
      useCORS: true, // 允许跨域图片
      allowTaint: true, // 允许跨域图片污染canvas
      backgroundColor: options?.backgroundColor || '#f8f9fa',
      logging: false, // 关闭日志
      imageTimeout: 15000, // 图片加载超时时间
      // 提高渲染质量
      removeContainer: true,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
      windowWidth: Math.ceil(rect.width),
      windowHeight: Math.ceil(rect.height),
      // 确保SVG正确渲染
      foreignObjectRendering: true,
    });

    // 转换为 Blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Failed to create blob from canvas');
            resolve(false);
            return;
          }

          // 创建下载链接
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.png`;

          // 触发下载
          document.body.appendChild(link);
          link.click();

          // 清理
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          resolve(true);
        },
        'image/png',
        options?.quality || 0.95
      );
    });
  } catch (error) {
    console.error('Error exporting component as image:', error);
    return false;
  }
}

/**
 * 带有加载提示的导出函数
 * @param element - 要导出的DOM元素
 * @param filename - 导出的文件名
 * @param onStart - 开始导出时的回调
 * @param onComplete - 完成导出时的回调
 * @param onError - 导出失败时的回调
 */
export async function exportWithFeedback(
  element: HTMLElement,
  filename: string,
  callbacks?: {
    onStart?: () => void;
    onComplete?: (success: boolean) => void;
    onError?: (error: Error) => void;
  }
): Promise<void> {
  try {
    callbacks?.onStart?.();

    const success = await exportComponentAsImage(element, filename);

    callbacks?.onComplete?.(success);
  } catch (error) {
    callbacks?.onError?.(error as Error);
  }
}
