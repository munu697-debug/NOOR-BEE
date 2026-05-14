import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'images', 'herosection');

async function convert() {
  console.log('Starting conversion of PNG to WebP...');
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const imgPath = path.join(dir, file);
      const newPath = imgPath.replace('.png', '.webp');
      
      try {
        await sharp(imgPath)
          .webp({ quality: 75 })
          .toFile(newPath);
          
        fs.unlinkSync(imgPath); // Delete original to save space
        console.log(`Converted and deleted: ${file}`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }
  }
  console.log('All images successfully converted to WebP!');
}

convert().catch(console.error);
