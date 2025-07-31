const fs = require('fs');
const path = require('path');
const { upperFirst } = require('lodash');

function updateIndexFile(indexPath, moduleName) {
  let indexContent = fs.readFileSync(indexPath, 'utf-8');

  indexContent = indexContent.trim();

  const newExport = `export * from './${moduleName}';`;

  let lines = indexContent.split('\n');
  lines.push(newExport);

  const updatedContent = lines.join('\n') + '\n';

  fs.writeFileSync(indexPath, updatedContent);
}

function replacePlaceholders(content, moduleName) {
  const moduleTitleCase = upperFirst(moduleName);
  const moduleUpperCase = moduleName.toUpperCase();

  return content
    .replace(/template/g, moduleName)
    .replace(/Template/g, moduleTitleCase)
    .replace(/TEMPLATE/g, moduleUpperCase);
}

function generateModule(moduleName, templateDirPath, newModuleDirPath) {
  const templateDir = path.join(__dirname, templateDirPath);
  const newModuleDir = path.join(__dirname, `${newModuleDirPath}${moduleName}`);

  fs.mkdirSync(newModuleDir);

  fs.readdirSync(templateDir).forEach((file) => {
    const filePath = path.join(templateDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const modifiedContent = replacePlaceholders(fileContent, moduleName);
      const newFileName = replacePlaceholders(file, moduleName);
      fs.writeFileSync(path.join(newModuleDir, newFileName), modifiedContent);
    } else if (fileStat.isDirectory()) {
      const newDirectoryName = replacePlaceholders(file, moduleName);
      const newDirectoryPath = path.join(newModuleDir, newDirectoryName);
      fs.mkdirSync(newDirectoryPath);
      const filesInDirectory = fs.readdirSync(filePath);
      filesInDirectory.forEach((subFile) => {
        const subFilePath = path.join(filePath, subFile);
        const subFileStat = fs.statSync(subFilePath);
        if (subFileStat.isFile()) {
          const subFileContent = fs.readFileSync(subFilePath, 'utf-8');
          const modifiedSubFileContent = replacePlaceholders(
            subFileContent,
            moduleName
          );
          const newSubFileName = replacePlaceholders(subFile, moduleName);
          fs.writeFileSync(
            path.join(newDirectoryPath, newSubFileName),
            modifiedSubFileContent
          );
        }
      });
    }
  });
  const indexPath = path.join(__dirname, `${newModuleDirPath}index.ts`);
  if (fs.existsSync(indexPath)) {
    updateIndexFile(indexPath, moduleName);
    console.log(`Updated index.ts file with "${moduleName}" export.`);
  } else {
    console.warn(
      `index.ts file not found in ${newModuleDirPath}. Skipping index update.`
    );
  }
}

// Usage: node generateModule.ts component moduleName
const componentName = process.argv[2];
if (!componentName) {
  console.error('Please provide a component.');
  process.exit(1);
}

const moduleName = process.argv[3];
if (!moduleName) {
  console.error('Please provide a component name.');
  process.exit(1);
}

try {
  if (componentName === 'all') {
    generateModule(moduleName, 'src/apis/template', 'src/apis/');
    generateModule(moduleName, 'src/components/template', 'src/components/');
    generateModule(moduleName, 'src/app/(user)/template', 'src/app/(user)/');
    generateModule(moduleName, 'src/app/admin/template', 'src/app/admin/');
    generateModule(moduleName, 'src/interfaces/template', 'src/interfaces/');
  } else if (componentName === 'api') {
    generateModule(moduleName, 'src/apis/template', 'src/apis/');
  } else if (componentName === 'component') {
    generateModule(moduleName, 'src/components/template', 'src/components/');
  } else if (componentName === 'page') {
    generateModule(moduleName, 'src/app/(user)/template', 'src/app/(user)/');
  } else if (componentName === 'admin') {
    generateModule(moduleName, 'src/app/admin/template', 'src/app/admin/');
  } else if (componentName === 'interface') {
    generateModule(moduleName, 'src/interfaces/template', 'src/interfaces/');
  }
  console.log(`Module "${moduleName}" created successfully.`);
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
}
