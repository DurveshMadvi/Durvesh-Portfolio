import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file);

// Remove BOM
while (content[0] === 0xEF || content[0] === 0xBB || content[0] === 0xBF) {
  content = content.slice(1);
}

fs.writeFileSync(file, content);
console.log('✅ BOM removed from App.jsx');
