const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const INPUT_DIR = path.join(__dirname, '..', 'public', 'zhz');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'zhz-optimized');
const TARGET_SIZE = 400; // 目标尺寸 400x400 (2倍显示尺寸，适配Retina屏)
const WEBP_QUALITY = 80; // WebP质量
const JPG_QUALITY = 85; // JPG降级质量

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(filename) {
  const inputPath = path.join(INPUT_DIR, filename);
  const outputName = filename.replace(/\.JPG$/i, '');

  try {
    // 读取原图并获取元数据
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`\n处理: ${filename}`);
    console.log(`  原始尺寸: ${metadata.width}x${metadata.height}`);
    console.log(`  原始大小: ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} MB`);

    // 1. 生成WebP版本（主要格式）
    const webpPath = path.join(OUTPUT_DIR, `${outputName}.webp`);
    await image
      .clone()
      .resize(TARGET_SIZE, TARGET_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: WEBP_QUALITY,
        effort: 6 // 压缩努力程度 (0-6，6最高)
      })
      .toFile(webpPath);

    const webpSize = fs.statSync(webpPath).size;
    console.log(`  ✓ WebP: ${(webpSize / 1024).toFixed(2)} KB (压缩率: ${((1 - webpSize / fs.statSync(inputPath).size) * 100).toFixed(1)}%)`);

    // 2. 生成JPG版本（降级方案）
    const jpgPath = path.join(OUTPUT_DIR, `${outputName}.jpg`);
    await image
      .clone()
      .resize(TARGET_SIZE, TARGET_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: JPG_QUALITY,
        mozjpeg: true // 使用mozjpeg优化
      })
      .toFile(jpgPath);

    const jpgSize = fs.statSync(jpgPath).size;
    console.log(`  ✓ JPG: ${(jpgSize / 1024).toFixed(2)} KB (压缩率: ${((1 - jpgSize / fs.statSync(inputPath).size) * 100).toFixed(1)}%)`);

    return {
      filename,
      originalSize: fs.statSync(inputPath).size,
      webpSize,
      jpgSize
    };
  } catch (error) {
    console.error(`  ✗ 处理失败: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🖼️  开始优化ZHZ角色图片...\n');
  console.log(`输入目录: ${INPUT_DIR}`);
  console.log(`输出目录: ${OUTPUT_DIR}`);
  console.log(`目标尺寸: ${TARGET_SIZE}x${TARGET_SIZE}px`);
  console.log(`WebP质量: ${WEBP_QUALITY}%`);
  console.log(`JPG质量: ${JPG_QUALITY}%`);

  // 获取所有JPG文件
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.match(/\.JPG$/i));

  if (files.length === 0) {
    console.log('\n⚠️  未找到需要处理的图片');
    return;
  }

  console.log(`\n找到 ${files.length} 张图片需要处理`);

  // 批量处理
  const results = [];
  for (const file of files) {
    const result = await optimizeImage(file);
    if (result) {
      results.push(result);
    }
  }

  // 统计结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 优化统计');
  console.log('='.repeat(60));

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webpSize, 0);
  const totalJpg = results.reduce((sum, r) => sum + r.jpgSize, 0);

  console.log(`\n原始总大小: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP总大小: ${(totalWebp / 1024 / 1024).toFixed(2)} MB (节省 ${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`JPG总大小:  ${(totalJpg / 1024 / 1024).toFixed(2)} MB (节省 ${((1 - totalJpg / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`\n平均每张:`);
  console.log(`  WebP: ${(totalWebp / results.length / 1024).toFixed(2)} KB`);
  console.log(`  JPG:  ${(totalJpg / results.length / 1024).toFixed(2)} KB`);

  console.log('\n✅ 优化完成！');
  console.log(`\n💡 下一步:`);
  console.log(`   1. 将 ${OUTPUT_DIR} 目录重命名为 ${INPUT_DIR}`);
  console.log(`   2. 更新代码中的图片引用（.JPG -> .webp）`);
  console.log(`   3. 测试页面加载性能`);
}

main().catch(console.error);
