const fs = require('fs');
const path = require('path');

// 1. Delete resources.html
if (fs.existsSync('resources.html')) {
  fs.unlinkSync('resources.html');
  console.log('Deleted resources.html');
}

// 2. Update vite.config.js
if (fs.existsSync('vite.config.js')) {
  let v = fs.readFileSync('vite.config.js', 'utf8');
  v = v.replace(/\s*resources:\s*resolve\(__dirname,\s*['"]resources\.html['"]\),?/g, '');
  fs.writeFileSync('vite.config.js', v, 'utf8');
  console.log('Updated vite.config.js');
}

// 3. Update vite.config.mjs if exists
if (fs.existsSync('vite.config.mjs')) {
  let v = fs.readFileSync('vite.config.mjs', 'utf8');
  v = v.replace(/\s*resources:\s*resolve\(__dirname,\s*['"]resources\.html['"]\),?/g, '');
  fs.writeFileSync('vite.config.mjs', v, 'utf8');
  console.log('Updated vite.config.mjs');
}

// 4. Remove links from root HTML files
const rootFiles = ['index.html', 'about.html', 'contact.html', 'faq.html', 'legal.html', 'privacy.html', 'terms.html'];
rootFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    // Remove footer link
    c = c.replace(/\s*<a href="resources\.html"[^>]*>[\s\S]*?<\/a>/g, '');
    // Remove offcanvas link
    c = c.replace(/\s*<li class="offcanvas-menu-item">\s*<a href="resources\.html"[^>]*>[\s\S]*?<\/a>\s*<\/li>/g, '');
    fs.writeFileSync(f, c, 'utf8');
    console.log('Cleaned ' + f);
  }
});

// 5. Remove links from deployments/*.html
const depDir = 'deployments';
if (fs.existsSync(depDir)) {
  fs.readdirSync(depDir).forEach(f => {
    if (f.endsWith('.html')) {
      const full = path.join(depDir, f);
      let c = fs.readFileSync(full, 'utf8');
      c = c.replace(/\s*<a href="\.\.\/resources\.html"[^>]*>[\s\S]*?<\/a>/g, '');
      c = c.replace(/\s*<li class="nav-item"><a href="\.\.\/resources\.html"[^>]*>[\s\S]*?<\/a><\/li>/g, '');
      fs.writeFileSync(full, c, 'utf8');
      console.log('Cleaned ' + full);
    }
  });
}
