const fs = require('fs');
const path = require('path');

const files = [
  'index.html', 'about.html', 'contact.html', 'faq.html', 'legal.html', 'privacy.html', 'terms.html', 'resources.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(/<div class="header-actions">[\s\S]*?<\/header>/);
    if (m) {
      console.log('=== ' + f + ' ===\n' + m[0] + '\n');
    }
  }
});

const depDir = 'deployments';
if (fs.existsSync(depDir)) {
  fs.readdirSync(depDir).forEach(f => {
    if (f.endsWith('.html')) {
      const full = path.join(depDir, f);
      const c = fs.readFileSync(full, 'utf8');
      const m = c.match(/<div class="header-actions">[\s\S]*?<\/header>/);
      if (m) {
        console.log('=== ' + full + ' ===\n' + m[0] + '\n');
      }
    }
  });
}
