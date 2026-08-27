const fs = require('fs');
const path = require('path');

const rootPages = [
  'index.html',
  'about.html',
  'contact.html',
  'faq.html',
  'legal.html',
  'privacy.html',
  'terms.html',
  'resources.html'
];

rootPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  const isIndex = (file === 'index.html');
  const prefix = isIndex ? '' : 'index.html';

  const desktopOldRegex = /<a href="[^"]*about[^"]*" class="nav-link">\s*Pages\s*<i class="fas fa-chevron-down"><\/i>\s*<\/a>\s*<ul class="dropdown-menu">[\s\S]*?<\/ul>/;
  
  const desktopNew = `<a href="${prefix}#about" class="nav-link">
              Pages <i class="fas fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a href="${prefix}#about">GOAT Standard</a></li>
              <li><a href="${prefix}#process">The Process</a></li>
              <li><a href="${prefix}#testimonials">Deployment Reviews</a></li>
            </ul>`;

  content = content.replace(desktopOldRegex, desktopNew);

  const offcanvasOldRegex = /<div class="offcanvas-menu-title">\s*<a href="[^"]*about[^"]*" class="offcanvas-nav-link">\s*<span><i class="fas fa-layer-group"><\/i> Pages<\/span>\s*<\/a>\s*<button type="button" class="offcanvas-submenu-toggle"[^>]*>\s*<i class="fas fa-chevron-down"><\/i>\s*<\/button>\s*<\/div>\s*<ul class="offcanvas-submenu">[\s\S]*?<\/ul>/;

  const offcanvasNew = `<div class="offcanvas-menu-title">
                <a href="${prefix}#about" class="offcanvas-nav-link">
                  <span><i class="fas fa-layer-group"></i> Pages</span>
                </a>
                <button type="button" class="offcanvas-submenu-toggle" aria-label="Toggle Pages Submenu">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <ul class="offcanvas-submenu">
                <li><a href="${prefix}#about"><i class="fas fa-crown"></i> GOAT Standard</a></li>
                <li><a href="${prefix}#process"><i class="fas fa-arrows-spin"></i> The Process</a></li>
                <li><a href="${prefix}#testimonials"><i class="fas fa-star"></i> Deployment Reviews</a></li>
              </ul>`;

  content = content.replace(offcanvasOldRegex, offcanvasNew);

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated ' + file);
});

const depDir = 'deployments';
if (fs.existsSync(depDir)) {
  fs.readdirSync(depDir).forEach(f => {
    if (f.endsWith('.html')) {
      const full = path.join(depDir, f);
      let content = fs.readFileSync(full, 'utf8');

      const desktopOldRegex = /<a href="[^"]*about[^"]*" class="nav-link">\s*Pages\s*<i class="fas fa-chevron-down"><\/i>\s*<\/a>\s*<ul class="dropdown-menu">[\s\S]*?<\/ul>/;
      const desktopNew = `<a href="../index.html#about" class="nav-link">
              Pages <i class="fas fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a href="../index.html#about">GOAT Standard</a></li>
              <li><a href="../index.html#process">The Process</a></li>
              <li><a href="../index.html#testimonials">Deployment Reviews</a></li>
            </ul>`;

      content = content.replace(desktopOldRegex, desktopNew);

      const offcanvasOldRegex = /<div class="offcanvas-menu-title">\s*<a href="[^"]*about[^"]*" class="offcanvas-nav-link">\s*<span><i class="fas fa-layer-group"><\/i> Pages<\/span>\s*<\/a>\s*<button type="button" class="offcanvas-submenu-toggle"[^>]*>\s*<i class="fas fa-chevron-down"><\/i>\s*<\/button>\s*<\/div>\s*<ul class="offcanvas-submenu">[\s\S]*?<\/ul>/;
      const offcanvasNew = `<div class="offcanvas-menu-title">
                <a href="../index.html#about" class="offcanvas-nav-link">
                  <span><i class="fas fa-layer-group"></i> Pages</span>
                </a>
                <button type="button" class="offcanvas-submenu-toggle" aria-label="Toggle Pages Submenu">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <ul class="offcanvas-submenu">
                <li><a href="../index.html#about"><i class="fas fa-crown"></i> GOAT Standard</a></li>
                <li><a href="../index.html#process"><i class="fas fa-arrows-spin"></i> The Process</a></li>
                <li><a href="../index.html#testimonials"><i class="fas fa-star"></i> Deployment Reviews</a></li>
              </ul>`;

      content = content.replace(offcanvasOldRegex, offcanvasNew);

      fs.writeFileSync(full, content, 'utf8');
      console.log('Updated ' + full);
    }
  });
}
