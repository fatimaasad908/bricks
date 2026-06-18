import fs from 'fs';
import path from 'path';

function findFile(dir, pattern) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        return;
      }
      if (stat && stat.isDirectory()) {
        // Skip node_modules and .git
        if (file !== 'node_modules' && file !== '.git' && file !== 'AppData') {
          results = results.concat(findFile(fullPath, pattern));
        }
      } else if (file.includes(pattern)) {
        results.push(fullPath);
      }
    });
  } catch (err) {
    // Ignore permission errors
  }
  return results;
}

const searchPaths = [
  'C:\\Users\\HP\\OneDrive\\Desktop',
  'C:\\Users\\HP\\Downloads',
  'C:\\Users\\HP\\Documents',
  'C:\\'
];

console.log('Searching for brick_yard files...');
searchPaths.forEach(sp => {
  console.log(`Scanning: ${sp}...`);
  const found = findFile(sp, 'brick_yard');
  if (found.length > 0) {
    console.log(`Found under ${sp}:`, found);
  }
});
