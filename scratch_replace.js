const fs = require('fs');
let content = fs.readFileSync('src/data/articles.ts', 'utf8');
content = content.replace(/author: '[^']+'/g, "author: 'theMixhq'");
fs.writeFileSync('src/data/articles.ts', content);
console.log('Replaced successfully');
