const fs = require('fs');
const { spawn } = require('child_process');

const defaultEditor = 'vi';
const editContentInEditor = (content) => {
  const editor = process.env.EDITOR || defaultEditor;

  const uuid = new Date().getTime();
  const tempFileName = `/tmp/${uuid}`;
  fs.writeFileSync(tempFileName, content);

  const shell = spawn(editor, [tempFileName], { stdio: 'inherit' });

  return new Promise((resolve, reject) => {
    shell.on('close', (code) => {
      const tmpContent = fs.readFileSync(tempFileName, 'utf-8');
      resolve(tmpContent);
      fs.unlinkSync(tempFileName);
    });
  });
};

async function onEditContentInEditor(filePath, callback) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const editor = process.env.EDITOR || defaultEditor;

  const uuid = new Date().getTime();
  const tempFileName = `/tmp/${uuid}`;
  fs.writeFileSync(tempFileName, content);

  const shell = spawn(editor, [tempFileName], { stdio: 'inherit' });

  shell.on('close', async (code) => {
    const tmpContent = fs.readFileSync(tempFileName, 'utf-8');
    const result = await callback(tmpContent);
    fs.unlinkSync(tempFileName);
    fs.writeFileSync(filePath, result);
  });
}


exports.editContentInEditor = editContentInEditor;
exports.onEditContentInEditor = onEditContentInEditor;
