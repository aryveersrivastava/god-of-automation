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

const standardHeaderBtn = `<a href="https://calendly.com/godofautomationofficial/30min" target="_blank" rel="noopener" class="neuros-button btn-pill-gradient"><span>Book a Call</span><i class="fas fa-calendar-check"></i></a>`;
const standardOffcanvasBtn = `<a href="https://calendly.com/godofautomationofficial/30min" target="_blank" rel="noopener" class="neuros-button btn-pill-gradient" style="width: 100%; justify-content: center; margin-top: 24px;"><span>Book a Call</span><i class="fas fa-calendar-check"></i></a>`;

rootPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace header button
  // Matches any <a href="..." class="neuros-button ..."><span>Book a Call</span>...</a> inside header-actions
  content = content.replace(
    /<div class="header-actions">([\s\S]*?)<\/div>\s*<\/div>\s*<\/header>/,
    (match, inner) => {
      // replace the <a> tag inside inner
      const updatedInner = inner.replace(/<a [^>]*class="[^"]*neuros-button[^"]*"[^>]*>[\s\S]*?<\/a>/, standardHeaderBtn);
      return `<div class="header-actions">${updatedInner}</div>\n    </div>\n  </header>`;
    }
  );

  // Replace offcanvas book a call button if present
  content = content.replace(
    /<a [^>]*class="[^"]*neuros-button[^"]*"[^>]*style="[^"]*width:\s*100%[^"]*"[^>]*>[\s\S]*?<\/a>/,
    standardOffcanvasBtn
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated ' + file);
});

const depDir = 'deployments';
if (fs.existsSync(depDir)) {
  fs.readdirSync(depDir).forEach(f => {
    if (f.endsWith('.html')) {
      const full = path.join(depDir, f);
      let content = fs.readFileSync(full, 'utf8');

      content = content.replace(
        /<div class="header-actions">([\s\S]*?)<\/div>\s*<\/div>\s*<\/header>/,
        (match, inner) => {
          const updatedInner = inner.replace(/<a [^>]*class="[^"]*neuros-button[^"]*"[^>]*>[\s\S]*?<\/a>/, standardHeaderBtn);
          return `<div class="header-actions">${updatedInner}</div>\n    </div>\n  </header>`;
        }
      );

      content = content.replace(
        /<a [^>]*class="[^"]*neuros-button[^"]*"[^>]*style="[^"]*width:\s*100%[^"]*"[^>]*>[\s\S]*?<\/a>/,
        standardOffcanvasBtn
      );

      fs.writeFileSync(full, content, 'utf8');
      console.log('Updated ' + full);
    }
  });
}
