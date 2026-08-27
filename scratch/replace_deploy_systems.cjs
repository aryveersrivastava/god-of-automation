const fs = require('fs');
const path = require('path');

const files = [
  'faq.html',
  'legal.html',
  'privacy.html',
  'resources.html',
  'terms.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<a href="[^"]*" class="neuros-button btn-pill-gradient">\s*<span>Deploy Systems<\/span>\s*<i class="fas fa-arrow-right"><\/i>\s*<\/a>/g,
    `<a href="book.html" class="neuros-button btn-pill-solid"><span>Book a Call</span><i class="fas fa-calendar-check"></i></a>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replaced Deploy Systems in: ' + file);
});
