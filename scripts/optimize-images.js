const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/*
 * Image optimization pipeline for Grupo ImperAR.
 *
 * Two independent outputs are produced:
 *
 * 1. Responsive WebP variants (legacy behavior, kept intact) — generated for
 *    the card/content images in ./images and written to ./images/optimized as
 *    `<name>-<size>.webp`. Useful for future `srcset` responsive art direction.
 *
 * 2. Sibling WebP variants (NEW) — a single optimized `.webp` written next to
 *    each source image (same folder, same basename). These are the files the
 *    HTML `<picture><source type="image/webp">` elements reference. Width is
 *    capped per directory to keep payloads small:
 *      - hero-section/  -> max 1920px wide (hero backgrounds)
 *      - images/        -> max  800px wide (cards / content / modal media)
 *      - logos/         -> max  512px wide (brand marks; SVG is skipped)
 */

// --- Legacy responsive variant config (unchanged behavior) -------------------
const CONFIG = {
  inputDir: './images',
  outputDir: './images/optimized',
  sizes: [640, 1024, 1920],
  quality: 85,
  formats: ['webp']
};

// --- Sibling WebP config (new) ----------------------------------------------
const WEBP_QUALITY = 82;
const WEBP_TARGETS = [
  { dir: './hero-section', maxWidth: 1920, match: /\.(png|jpe?g)$/i }, // hero images
  { dir: './images', maxWidth: 800, match: /\.(png|jpe?g)$/i },        // cards / content
  { dir: './logos', maxWidth: 512, match: /\.png$/i }                  // logos (svg skipped)
];

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

async function generateResponsiveVariants() {
  // Cria diretório de output
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Lista imagens JPEG
  const files = await fs.readdir(CONFIG.inputDir);
  const images = files.filter(f => /\.(jpe?g)$/i.test(f));

  console.log(`\n== Variantes responsivas (${images.length} imagens) ==\n`);

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

  if (totalOriginal > 0) {
    const savings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    console.log(`\nOriginal: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Otimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Economia (variantes 640/1024/1920): ${savings}%`);
  }
}

async function generateSiblingWebP() {
  console.log(`\n== WebP lado a lado (fallback <picture>) ==`);

  const dimensions = {}; // path -> { width, height }

  for (const target of WEBP_TARGETS) {
    let files;
    try {
      files = await fs.readdir(target.dir);
    } catch (err) {
      console.log(`\n(pular) diretório não encontrado: ${target.dir}`);
      continue;
    }

    const images = files.filter(f => target.match.test(f));
    console.log(`\n${target.dir} — ${images.length} imagem(ns), max ${target.maxWidth}px`);

    for (const filename of images) {
      const inputPath = path.join(target.dir, filename);
      const name = path.parse(filename).name;
      const outputPath = path.join(target.dir, `${name}.webp`);

      const info = await sharp(inputPath)
        .resize(target.maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      dimensions[inputPath.replace(/\\/g, '/')] = {
        width: info.width,
        height: info.height
      };

      console.log(
        `✓ ${path.join(target.dir, `${name}.webp`)} ` +
        `(${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`
      );
    }
  }

  // Emite um resumo das dimensões finais para facilitar preencher width/height
  // nos <img> do HTML (previne CLS — Req 2.4).
  console.log(`\n== Dimensões (para atributos width/height) ==`);
  Object.entries(dimensions).forEach(([p, d]) => {
    console.log(`${p} -> width="${d.width}" height="${d.height}"`);
  });
}

async function main() {
  await generateResponsiveVariants();
  await generateSiblingWebP();
  console.log(`\n✓ Concluído!`);
}

main().catch(console.error);
