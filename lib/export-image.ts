// lib/export-image.ts
import html2canvas from "html2canvas";

/** 等待所有图片加载 */
async function waitForImages(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

/** 下载 Blob 对象为文件 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();

  // 清理 URL 对象
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * 导出 DOM 元素为图片
 *
 * 核心策略：
 * 1. 临时将元素移到 body 顶层，避免父级半透明背景干扰
 * 2. 强制设置 opacity: 1 和禁用动画，避免动画导致的半透明
 * 3. 清理 blur/backdrop-filter 等会导致 html2canvas 渲染问题的样式
 * 4. 渲染后立即恢复所有样式和位置
 * 5. 移动端优先使用 Share API，桌面端使用下载
 */
export async function exportAsImage(element: HTMLElement, filename: string) {
  return new Promise<boolean>(async (resolve) => {
    let restoreFn: (() => void) | null = null;
    let originalParent: HTMLElement | null = null;
    let nextSibling: Node | null = null;

    try {
      // 1. 临时将元素移到 body 顶层，避免父级背景干扰
      originalParent = element.parentElement;
      nextSibling = element.nextSibling;

      const rect = element.getBoundingClientRect();

      // 创建占位符
      const placeholder = document.createElement('div');
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.visibility = 'hidden';
      element.parentElement?.insertBefore(placeholder, element);

      // 保存原始样式
      const oldPosition = element.style.position;
      const oldLeft = element.style.left;
      const oldTop = element.style.top;
      const oldZIndex = element.style.zIndex;
      const oldOpacity = element.style.opacity;
      const oldAnimation = element.style.animation;

      // 移动到 body 顶层并强制完全不透明
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '99999';
      element.style.opacity = '1';
      element.style.animation = 'none';
      document.body.appendChild(element);

      // 等待重新渲染和图表加载（特别是 ResponsiveContainer）
      await new Promise(resolve => setTimeout(resolve, 500));

      // 强制触发所有 SVG 的重绘
      const svgs = element.querySelectorAll('svg');
      svgs.forEach(svg => {
        // 触发重排，确保 SVG 正确渲染
        svg.style.display = 'none';
        void svg.offsetHeight; // 触发重排
        svg.style.display = '';
      });

      // 2. 清理会导致 html2canvas 渲染问题的样式

      // 备份并清理
      const backups: Array<{
        el: HTMLElement;
        filter: string;
        backdropFilter: string;
        display: string;
        opacity: string;
      }> = [];

      const allElements = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))];

      allElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const hasBlur = styles.filter !== 'none' && styles.filter.includes('blur');
        const hasGradient = styles.backgroundImage !== 'none' && styles.backgroundImage.includes('gradient');
        const isGlowLayer = hasBlur && hasGradient;
        const hasOpacity = parseFloat(styles.opacity) < 1;
        const shouldHideForExport = el.classList.contains('export-hide');

        if (hasBlur || styles.backdropFilter !== 'none' || isGlowLayer || hasOpacity || shouldHideForExport) {
          backups.push({
            el,
            filter: el.style.filter || '',
            backdropFilter: el.style.backdropFilter || '',
            display: el.style.display || '',
            opacity: el.style.opacity || '',
          });

          if (hasBlur) el.style.filter = 'none';
          if (styles.backdropFilter !== 'none') el.style.backdropFilter = 'none';
          if (isGlowLayer || shouldHideForExport) el.style.display = 'none';
          if (hasOpacity) el.style.opacity = '1';
        }
      });

      // 创建恢复函数
      restoreFn = () => {
        backups.forEach(({ el, filter, backdropFilter, display, opacity }) => {
          el.style.filter = filter;
          el.style.backdropFilter = backdropFilter;
          el.style.display = display;
          el.style.opacity = opacity;
        });
      };

      // 3. 等待图片加载
      await waitForImages(element);

      // 4. 渲染元素
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2,
        foreignObjectRendering: false,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        x: 0,
        y: 0,
      });

      // 5. 恢复样式
      restoreFn();
      restoreFn = null;

      // 6. 恢复元素位置
      element.style.position = oldPosition;
      element.style.left = oldLeft;
      element.style.top = oldTop;
      element.style.zIndex = oldZIndex;
      element.style.opacity = oldOpacity;
      element.style.animation = oldAnimation;

      if (originalParent) {
        document.body.removeChild(element);
        if (nextSibling) {
          originalParent.insertBefore(element, nextSibling);
        } else {
          originalParent.appendChild(element);
        }
      }

      // 移除占位符
      const placeholderToRemove = originalParent?.querySelector('div[style*="visibility: hidden"]');
      placeholderToRemove?.remove();

      // 7. 下载图片 - 兼容移动端
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }

        // 移动端优先使用 Share API
        if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          const file = new File([blob], filename + ".png", { type: "image/png" });
          navigator.share({
            files: [file],
            title: filename,
          }).then(() => {
            resolve(true);
          }).catch((err) => {
            // 分享失败，降级到下载
            console.log('Share failed, fallback to download:', err);
            downloadBlob(blob, filename + ".png");
            resolve(true);
          });
        } else {
          // 桌面端或不支持 Share API 的设备，直接下载
          downloadBlob(blob, filename + ".png");
          resolve(true);
        }
      }, "image/png");
    } catch (err) {
      console.error("Export failed:", err);

      // 确保恢复样式
      if (restoreFn) restoreFn();

      // 确保恢复元素位置
      if (originalParent && element.parentElement === document.body) {
        document.body.removeChild(element);
        if (nextSibling) {
          originalParent.insertBefore(element, nextSibling);
        } else {
          originalParent.appendChild(element);
        }
        const placeholderToRemove = originalParent?.querySelector('div[style*="visibility: hidden"]');
        placeholderToRemove?.remove();
      }

      resolve(false);
    }
  });
}

/** 带 UI 的封装 */
export async function exportWithFeedback(
  element: HTMLElement,
  filename: string,
  opts?: {
    onStart?: () => void;
    onComplete?: (success: boolean) => void;
    onError?: (e: any) => void;
  }
) {
  try {
    opts?.onStart?.();
    const success = await exportAsImage(element, filename);
    opts?.onComplete?.(success);
  } catch (err) {
    opts?.onError?.(err);
  }
}
