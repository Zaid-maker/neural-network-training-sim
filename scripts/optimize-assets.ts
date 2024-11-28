import { optimizeImage } from '../app/utils/imageOptimizer';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize, Config } from 'svgo';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// SVG optimization configuration
const svgoConfig: Config = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
        },
      },
    },
    'removeDimensions',
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name'],
      },
    },
  ],
};

async function optimizeSvg(inputPath: string, outputPath: string) {
  try {
    const svg = await fs.readFile(inputPath, 'utf8');
    const result = optimize(svg, svgoConfig);
    await fs.writeFile(outputPath, result.data);
    console.log(`Optimized SVG: ${outputPath}`);
  } catch (error) {
    console.error(`Failed to optimize SVG ${inputPath}:`, error);
    throw error; // Re-throw to handle in the calling function
  }
}

async function generateFavicons() {
  const sizes = [16, 32, 48, 64, 128, 256];
  const iconPath = path.join(PUBLIC_DIR, 'icon.svg');
  const faviconDir = path.join(PUBLIC_DIR, 'favicon');

  await fs.mkdir(faviconDir, { recursive: true });

  for (const size of sizes) {
    await sharp(iconPath)
      .resize(size, size)
      .png()
      .toFile(path.join(faviconDir, `favicon-${size}x${size}.png`));
  }

  // Generate ICO file containing multiple sizes
  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
  await sharp(iconPath)
    .resize(32, 32)
    .toFile(icoPath);

  console.log('Generated favicons');
}

async function optimizeAssets() {
  try {
    // Create optimized directory
    await fs.mkdir(OPTIMIZED_DIR, { recursive: true });

    // Get all image files
    const files = await fs.readdir(PUBLIC_DIR);
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|svg)$/i.test(file));

    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(PUBLIC_DIR, file);
      const ext = path.extname(file).toLowerCase();

      if (ext === '.svg') {
        const outputPath = path.join(OPTIMIZED_DIR, file);
        await optimizeSvg(inputPath, outputPath);
      } else {
        await optimizeImage(
          inputPath,
          OPTIMIZED_DIR,
          {
            quality: 80,
            progressive: true,
            sizes: [
              { width: 640, height: 640 },
              { width: 1280, height: 1280 },
              { width: 1920, height: 1920 }
            ],
            formats: ['webp', 'avif', 'png']
          }
        );
      }
    }

    // Generate favicons
    await generateFavicons();

    console.log('Asset optimization complete!');
  } catch (error) {
    console.error('Error optimizing assets:', error);
    process.exit(1);
  }
}

optimizeAssets();
