import sharp from 'sharp';
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filePath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(filePath), '..');
const sourcePath = path.join(rootDir, 'assets', 'favicon-source.png');
const outputDir = path.join(rootDir, 'public');

const targets = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 48, name: 'favicon-48.png' },
  { size: 180, name: 'favicon-180.png' }
];

async function run() {
  await access(sourcePath);
  await mkdir(outputDir, { recursive: true });

  for (const { size, name } of targets) {
    const outputPath = path.join(outputDir, name);

    await sharp(sourcePath)
      .resize(size, size, { fit: 'cover', position: 'center' })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`Generated ${path.relative(rootDir, outputPath)} (${size}x${size})`);
  }
}

run().catch((error) => {
  console.error('Failed to generate favicon assets.');
  console.error(error);
  process.exit(1);
});
