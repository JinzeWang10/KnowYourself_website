"""
将public/zootopia目录下的图片转换为WebP格式
"""
from PIL import Image
import os

def convert_to_webp(source_dir='public/zootopia', quality=85):
    """
    将目录下的所有图片转换为WebP格式

    Args:
        source_dir: 源图片目录
        quality: WebP压缩质量 (0-100)
    """
    # 支持的图片格式
    supported_formats = ('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')

    # 遍历目录下的所有文件
    for filename in os.listdir(source_dir):
        if filename.endswith(supported_formats):
            file_path = os.path.join(source_dir, filename)

            # 打开图片
            try:
                img = Image.open(file_path)

                # 转换为RGB模式（WebP不支持某些模式）
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')

                # 生成新的文件名
                name_without_ext = os.path.splitext(filename)[0]
                webp_filename = f"{name_without_ext}.webp"
                webp_path = os.path.join(source_dir, webp_filename)

                # 保存为WebP格式
                img.save(webp_path, 'WebP', quality=quality, method=6)

                # 获取文件大小信息
                original_size = os.path.getsize(file_path) / 1024  # KB
                webp_size = os.path.getsize(webp_path) / 1024  # KB
                reduction = (1 - webp_size / original_size) * 100

                print(f"[OK] {filename} -> {webp_filename}")
                print(f"  原始大小: {original_size:.1f} KB")
                print(f"  压缩后: {webp_size:.1f} KB")
                print(f"  减少: {reduction:.1f}%\n")

            except Exception as e:
                print(f"[ERROR] 处理 {filename} 时出错: {e}\n")

if __name__ == '__main__':
    print("开始转换图片为WebP格式...\n")
    convert_to_webp()
    print("转换完成！")
