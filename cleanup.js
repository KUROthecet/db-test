
const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'index.tsx',
  'metadata.json',
  'index.html',
  'types.ts',
  'mockData.ts',
  'context.tsx',
  'src' // Remove the duplicate src folder
];

filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`✅ Deleted: ${file}`);
    } catch (e) {
      console.error(`❌ Failed to delete ${file}:`, e);
    }
  } else {
    console.log(`⚠️  Not found (already deleted): ${file}`);
  }
});

console.log('\n✨ Project structure cleaned up! You can now use "npm run frontend" or "npm run backend".');
