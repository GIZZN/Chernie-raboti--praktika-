import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = [
  {
    url: 'https://fonts.gstatic.com/s/notosans/v38/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5aPdu2ui.woff2',
    name: 'noto-sans-cyrillic-ext.woff2'
  },
  {
    url: 'https://fonts.gstatic.com/s/notosans/v38/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5ardu2ui.woff2',
    name: 'noto-sans-cyrillic.woff2'
  }
];

async function downloadFonts() {
  try {
    const fontsDir = path.join(__dirname, 'src', 'assets', 'fonts');
    await fs.mkdir(fontsDir, { recursive: true });

    for (const font of fonts) {
      console.log(`Downloading ${font.name}...`);
      const response = await fetch(font.url);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${font.name}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const filePath = path.join(fontsDir, font.name);
      
      await fs.writeFile(filePath, Buffer.from(buffer));
      
      const stats = await fs.stat(filePath);
      console.log(`Downloaded ${font.name} (${stats.size} bytes)`);
    }
    
    console.log('All fonts downloaded successfully!');
  } catch (error) {
    console.error('Error downloading fonts:', error);
    process.exit(1);
  }
}

downloadFonts();