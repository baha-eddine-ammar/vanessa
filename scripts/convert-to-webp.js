/**
 * Optional WebP Conversion Script
 * Converts the 238 JPG frames in public/vane1toinf/ to WebP format for even lighter transfer,
 * preserving original JPGs intact as reliable fallback.
 * 
 * Usage:
 * 1. npm install -D sharp
 * 2. node scripts/convert-to-webp.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, '../public/vane1toinf');
const outputDir = path.resolve(__dirname, '../public/vane1toinf_webp');

async function convertFrames() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.error('Error: "sharp" is not installed.');
    console.log('To run this optional conversion script, please run: npm install -D sharp');
    process.exit(1);
  }

  if (!fs.existsSync(inputDir)) {
    console.error(`Input folder not found: ${inputDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.jpg'));
  console.log(`Found ${files.length} JPG frames to convert to WebP...`);

  let converted = 0;
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputFilename = file.replace(/\.jpg$/, '.webp');
    const outputPath = path.join(outputDir, outputFilename);

    await sharp(inputPath)
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    converted++;
    if (converted % 25 === 0 || converted === files.length) {
      console.log(`Converted ${converted}/${files.length} frames...`);
    }
  }

  console.log('Successfully completed WebP conversion!');
  console.log(`WebP frames saved in: ${outputDir}`);
  console.log('Original JPG frames in public/vane1toinf remain completely untouched.');
}

convertFrames();
