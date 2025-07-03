const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      fileList = await getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function fixEncoding() {
  try {
    const files = await getAllFiles('./src');
    console.log('Found ' + files.length + ' TypeScript files');
    
    for (const file of files) {
      try {
        console.log('Fixing encoding for ' + file);
        const content = await readFile(file, 'utf8');
        await writeFile(file, content, 'ascii');
      } catch (err) {
        console.error('Error processing ' + file + ':', err);
      }
    }
    
    console.log('Encoding fixed for all TypeScript files');
  } catch (err) {
    console.error('Error:', err);
  }
}

fixEncoding();
