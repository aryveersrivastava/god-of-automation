const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../deployments');
const files = [
  'distributed-transaction.html',
  'lead-routing.html',
  'predictive-analytics.html',
  'custom-infrastructure.html',
  'orchestrated-outreach.html',
  'ats-bypass-guide.html',
  'elite-resume-rebuild.html'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace Deploy Systems in header with Book a Call
  content = content.replace(
    /<a href="\.\.\/index\.html#contact" class="neuros-button btn-pill-gradient">\s*<span>Deploy Systems<\/span>\s*<i class="fas fa-arrow-right"><\/i>\s*<\/a>/g,
    `<a href="../book.html" class="neuros-button btn-pill-solid"><span>Book a Call</span><i class="fas fa-calendar-check"></i></a>`
  );

  // 2. Replace has_gradient_color_text with accent-text em
  content = content.replace(/<span class="has_gradient_color_text">(.*?)<\/span>/g, '<em class="accent-text">$1</em>');
  content = content.replace(/<h6 class="has_gradient_color_text">(.*?)<\/h6>/g, '<h6 style="color: var(--accent-cyan-light); font-size: 14px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px;">$1</h6>');

  // 3. Clean personal developer details in offcanvas drawer
  content = content.replace(
    /Elite AI Infrastructure Studio engineered by Aryveer Srivastav\.\s*Building low-latency automation pipelines and LLM workflows\./g,
    'Enterprise AI systems agency. Building low-latency multi-agent automation pipelines and deterministic operational runtimes.'
  );

  content = content.replace(
    /<a href="https:\/\/www\.linkedin\.com\/in\/aryveer-srivastav".*?<\/a>\s*<a href="https:\/\/github\.com\/aryveersrivastav".*?<\/a>/gs,
    ''
  );

  // 4. Clean footer copyright
  content = content.replace(
    /<div>© <a href="\.\.\/index\.html#hero"><u>God of Automation<\/u><\/a> 2026\. Engineered by Aryveer Srivastav\. All rights reserved\.<\/div>/g,
    '<div>© 2026 God of Automation. All rights reserved. Sovereign Enterprise AI Systems.</div>'
  );

  // 5. Update offcanvas drawer footer button
  content = content.replace(
    /<a href="\.\.\/index\.html#contact" class="neuros-button btn-pill-gradient" style="width: 100%; justify-content: center;">\s*<span>Deploy Systems<\/span>\s*<i class="fas fa-arrow-right"><\/i>\s*<\/a>/g,
    `<a href="../book.html" class="neuros-button btn-pill-solid" style="width: 100%; justify-content: center;"><span>Book Architecture Call</span><i class="fas fa-calendar-check"></i></a>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${file}`);
});
