import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

interface ImageSizes {
  width: number;
  height: number;
}

interface OptimizationOptions {
  quality?: number;
  progressive?: boolean;
  sizes?: ImageSizes[];
  formats?: ('webp' | 'avif' | 'png')[];
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  quality: 80,
  progressive: true,
  sizes: [
    { width: 640, height: 640 },   // sm
    { width: 1280, height: 1280 }, // md
    { width: 1920, height: 1920 }, // lg
  ],
  formats: ['webp', 'avif', 'png'],
};

export async function optimizeImage(
  inputPath: string,
  outputDir: string,
  options: OptimizationOptions = DEFAULT_OPTIONS
) {
  const { name } = path.parse(inputPath);
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions');
  }

  const optimizationPromises: Promise<void>[] = [];

  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });

  // Generate different sizes and formats
  for (const size of options.sizes || []) {
    for (const format of options.formats || []) {
      const resizedImage = image.clone()
        .resize(size.width, size.height, {
          fit: 'inside',
          withoutEnlargement: true,
        });

      const outputPath = path.join(
        outputDir,
        `${name}-${size.width}x${size.height}.${format}`
      );

      let formatOptions = {};
      switch (format) {
        case 'webp':
          formatOptions = {
            quality: options.quality,
            effort: 6,
          };
          break;
        case 'avif':
          formatOptions = {
            quality: options.quality,
            effort: 6,
          };
          break;
        case 'png':
          formatOptions = {
            progressive: options.progressive,
            compressionLevel: 9,
          };
          break;
      }

      optimizationPromises.push(
        resizedImage[format](formatOptions)
          .toFile(outputPath)
          .then(() => console.log(`Generated ${outputPath}`))
          .catch(console.error)
      );
    }
  }

  await Promise.all(optimizationPromises);
}
