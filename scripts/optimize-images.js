const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  inputDir: './images',
  outputDir: './images/optimized',
  sizes: [640, 1024, 1920],
  quality: 85,
  formats: ['webp']
};

async function optimizeImage(inputPath, filename) {
  const name = path.parse(filename).name;
  const results = [];

  for (const size of CONFIG.sizes) {
    const outputPath = path.join(
      CONFIG.outputDir,
      `${name}-${size}.webp`
    );

    const info = await sharp(inputPath)
      .resize(size, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    results.push({
      size,
      outputPath,
      fileSize: info.size,
      width: info.width,
      height: info.height
    });

    console.log(`✓ ${name}-${size}.webp (${(info.size / 1024).toFixed(1)} KB)`);
  }

  return results;
}

async function main() {
  // Cria diretório de output
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Lista imagens JPEG
  const files = await fs.readdir(CONFIG.inputDir);
  const images = files.filter(f => /\.(jpe?g)$/i.test(f));

  console.log(`Otimizando ${images.length} imagens...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const filename of images) {
    const inputPath = path.join(CONFIG.inputDir, filename);
    const stats = await fs.stat(inputPath);
    totalOriginal += stats.size;

    console.log(`\n${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
    const results = await optimizeImage(inputPath, filename);

    results.forEach(r => {
      totalOptimized += r.fileSize;
    });
  }

  const savings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  console.log(`\n✓ Concluído!`);
  console.log(`Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Otimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Economia: ${savings}%`);
}

main().catch(console.error);
