import html2canvas from 'html2canvas';

/**
 * 等待元素中的所有图片和SVG加载完成
 * @param element - 要检查的DOM元素
 * @returns Promise<void>
 */
async function waitForContentToLoad(element: HTMLElement): Promise<void> {
  console.log('开始等待内容加载...');

  // 1. 等待所有图片加载
  const images = element.querySelectorAll('img');
  console.log(`找到 ${images.length} 个图片`);

  const imagePromises = Array.from(images).map((img, index) => {
    if (img.complete && img.naturalHeight !== 0) {
      console.log(`图片 ${index + 1} 已加载`);
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      img.onload = () => {
        console.log(`图片 ${index + 1} 加载完成`);
        resolve();
      };
      img.onerror = () => {
        console.warn(`图片 ${index + 1} 加载失败`);
        resolve();
      };
      // 设置超时
      setTimeout(() => {
        console.warn(`图片 ${index + 1} 加载超时`);
        resolve();
      }, 10000);
    });
  });

  await Promise.all(imagePromises);

  // 2. 检查是否有SVG/Canvas元素（Recharts雷达图）
  const svgElements = element.querySelectorAll('svg');
  const canvasElements = element.querySelectorAll('canvas');
  console.log(`找到 ${svgElements.length} 个SVG元素, ${canvasElements.length} 个Canvas元素`);

  // 3. 等待更长时间确保动态内容（如Recharts）完全渲染
  console.log('等待动态内容渲染...');
  await new Promise(resolve => setTimeout(resolve, 2000)); // 增加到2秒

  console.log('内容加载完成');
}

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
    console.log('========== 开始导出图片 ==========');

    // 1. 等待所有内容加载完成
    await waitForContentToLoad(element);

    // 2. 获取元素的实际尺寸
    const rect = element.getBoundingClientRect();
    console.log('元素尺寸:', rect.width, 'x', rect.height);

    // 3. 配置 html2canvas 选项
    console.log('开始生成Canvas...');
    const canvas = await html2canvas(element, {
      scale: options?.scale || 2, // 使用2倍缩放
      useCORS: true, // 允许跨域图片
      allowTaint: true, // 允许污染（本地图片需要）
      backgroundColor: options?.backgroundColor || '#ffffff',
      logging: true, // 开启日志便于调试
      imageTimeout: 15000, // 图片加载超时时间
      // 提高渲染质量
      removeContainer: false, // 不移除容器
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
      windowWidth: Math.ceil(rect.width),
      windowHeight: Math.ceil(rect.height),
      // SVG渲染 - 关键修改
      foreignObjectRendering: false, // 改为false，使用标准SVG渲染
      // 忽略某些元素
      ignoreElements: (el) => {
        // 忽略标记为no-export的元素
        if (el.classList && el.classList.contains('no-export')) {
          return true;
        }
        return false;
      },
    });

    console.log('Canvas生成完成:', canvas.width, 'x', canvas.height);

    // 4. 检查canvas是否为空
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const isBlank = imageData.data.every((value, index) => {
        // 检查alpha通道，如果是透明的则跳过
        if ((index + 1) % 4 === 0) return true;
        // 检查RGB值是否都是255（白色）
        return value === 255;
      });

      if (isBlank) {
        console.error('警告：生成的Canvas似乎是空白的！');
      } else {
        console.log('Canvas内容检查通过');
      }
    }

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
