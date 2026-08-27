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

  // 1. Replace desktop Solutions dropdown
  // Match <a href="...features..." class="nav-link">\s*Solutions\s*<i class="fas fa-chevron-down"></i>\s*</a>\s*<div class="dropdown-menu dropdown-solutions-menu">[\s\S]*?</div>\s*</li>
  // or <ul class="dropdown-menu"> if already converted
  const desktopOldRegex = /<a href="[^"]*features[^"]*" class="nav-link">\s*Solutions\s*<i class="fas fa-chevron-down"><\/i>\s*<\/a>\s*(?:<div class="dropdown-menu dropdown-solutions-menu">[\s\S]*?<\/div>|<ul class="dropdown-menu">[\s\S]*?<\/ul>)/;

  const desktopNew = `<a href="${prefix}#features" class="nav-link">
              Solutions <i class="fas fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a href="${prefix}#features">Deployments</a></li>
              <li><a href="${prefix}#services">Services</a></li>
            </ul>`;

  content = content.replace(desktopOldRegex, desktopNew);

  // 2. Replace offcanvas Solutions submenu
  const offcanvasOldRegex = /<div class="offcanvas-menu-title">\s*<a href="[^"]*features[^"]*" class="offcanvas-nav-link">\s*<span><i class="fas fa-cubes-stacked"><\/i> Solutions<\/span>\s*<\/a>\s*<button type="button" class="offcanvas-submenu-toggle"[^>]*>\s*<i class="fas fa-chevron-down"><\/i>\s*<\/button>\s*<\/div>\s*<ul class="offcanvas-submenu">[\s\S]*?<\/ul>/;

  const offcanvasNew = `<div class="offcanvas-menu-title">
                <a href="${prefix}#features" class="offcanvas-nav-link">
                  <span><i class="fas fa-cubes-stacked"></i> Solutions</span>
                </a>
                <button type="button" class="offcanvas-submenu-toggle" aria-label="Toggle Solutions Submenu">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <ul class="offcanvas-submenu">
                <li><a href="${prefix}#features"><i class="fas fa-server"></i> Deployments</a></li>
                <li><a href="${prefix}#services"><i class="fas fa-gears"></i> Services</a></li>
              </ul>`;

  content = content.replace(offcanvasOldRegex, offcanvasNew);

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated Solutions in ' + file);
});

const depDir = 'deployments';
if (fs.existsSync(depDir)) {
  fs.readdirSync(depDir).forEach(f => {
    if (f.endsWith('.html')) {
      const full = path.join(depDir, f);
      let content = fs.readFileSync(full, 'utf8');

      const desktopOldRegex = /<a href="[^"]*features[^"]*" class="nav-link">\s*Solutions\s*<i class="fas fa-chevron-down"><\/i>\s*<\/a>\s*(?:<div class="dropdown-menu dropdown-solutions-menu">[\s\S]*?<\/div>|<ul class="dropdown-menu">[\s\S]*?<\/ul>)/;
      const desktopNew = `<a href="../index.html#features" class="nav-link">
              Solutions <i class="fas fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a href="../index.html#features">Deployments</a></li>
              <li><a href="../index.html#services">Services</a></li>
            </ul>`;

      content = content.replace(desktopOldRegex, desktopNew);

      const offcanvasOldRegex = /<div class="offcanvas-menu-title">\s*<a href="[^"]*features[^"]*" class="offcanvas-nav-link">\s*<span><i class="fas fa-cubes-stacked"><\/i> Solutions<\/span>\s*<\/a>\s*<button type="button" class="offcanvas-submenu-toggle"[^>]*>\s*<i class="fas fa-chevron-down"><\/i>\s*<\/button>\s*<\/div>\s*<ul class="offcanvas-submenu">[\s\S]*?<\/ul>/;
      const offcanvasNew = `<div class="offcanvas-menu-title">
                <a href="../index.html#features" class="offcanvas-nav-link">
                  <span><i class="fas fa-cubes-stacked"></i> Solutions</span>
                </a>
                <button type="button" class="offcanvas-submenu-toggle" aria-label="Toggle Solutions Submenu">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
              <ul class="offcanvas-submenu">
                <li><a href="../index.html#features"><i class="fas fa-server"></i> Deployments</a></li>
                <li><a href="../index.html#services"><i class="fas fa-gears"></i> Services</a></li>
              </ul>`;

      content = content.replace(offcanvasOldRegex, offcanvasNew);

      fs.writeFileSync(full, content, 'utf8');
      console.log('Updated Solutions in ' + full);
    }
  });
}
