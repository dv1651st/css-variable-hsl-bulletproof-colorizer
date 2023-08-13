const fs = require('fs');
const fileTypes = require('./fileTypes.json');

// Read the existing package.json
const packageJson = require('./package.json');
const commands = ['colorHSL', 'removeHSLColoring']
// Generate the when clauses based on the supported file types
packageJson.contributes.menus['editor/context'] = commands.flatMap(command =>
    fileTypes.supportedFileTypes.map(fileType => {
    const whenCondition = command === 'colorHSL' ? `editorLangId == ${fileType} && !isHslColoringApplied` :`editorLangId == ${fileType} && isHslColoringApplied`
    return {
      'command': `extension.${command}`,
      'when': whenCondition,
      'group': 'navigation'
    }
    })
  );
packageJson.activationEvents = fileTypes.supportedFileTypes.map(x => `onLanguage: ${x}`)
  
// Write the updated package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2), 'utf-8');
console.log('Commands visibility updated:', packageJson.contributes.menus['editor/context']);