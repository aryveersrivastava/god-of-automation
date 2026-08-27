const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../');
const files = [
  'book.html',
  'faq.html',
  'resources.html',
  'legal.html',
  'terms.html',
  'privacy.html'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace Deploy Systems in header with Book a Call
  content = content.replace(
    /<a href="(?:index\.html)?#contact" class="neuros-button btn-pill-gradient">\s*<span>Deploy Systems<\/span>\s*<i class="fas fa-arrow-right"><\/i>\s*<\/a>/g,
    `<a href="book.html" class="neuros-button btn-pill-solid"><span>Book a Call</span><i class="fas fa-calendar-check"></i></a>`
  );

  // 2. Replace has_gradient_color_text with accent-text em
  content = content.replace(/<span class="has_gradient_color_text">(.*?)<\/span>/g, '<em class="accent-text">$1</em>');
  content = content.replace(/<h6 class="has_gradient_color_text">(.*?)<\/h6>/g, '<h6 style="color: var(--accent-cyan-light); font-size: 14px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px;">$1</h6>');

  // 3. Clean personal developer details in offcanvas drawer & descriptions
  content = content.replace(
    /God of Automation is an elite AI Infrastructure Studio engineered by Aryveer Srivastav\.\s*We build scalable B2B automation pipelines and algorithmic B2C career optimization systems that permanently eliminate manual workload\./g,
    'God of Automation is an enterprise AI infrastructure agency. We build fault-tolerant multi-agent architectures, low-latency transaction systems, and sovereign data intelligence for ambitious organizations.'
  );

  content = content.replace(
    /Elite AI Infrastructure Studio engineered by Aryveer Srivastav\.\s*We build scalable B2B automation pipelines and algorithmic B2C career optimization systems\./g,
    'God of Automation is an enterprise AI infrastructure agency. Building low-latency multi-agent automation pipelines and deterministic operational runtimes.'
  );

  content = content.replace(
    /Schedule a direct technical teardown with Founder Aryveer Srivastav\.\s*We will map your operational bottlenecks and design a custom AI infrastructure blueprint\./g,
    'Schedule a technical architecture review with the God of Automation engineering leadership. We will map your operational bottlenecks and design a sovereign AI infrastructure blueprint.'
  );

  content = content.replace(
    /Direct Founder Access:\s*<\/strong>\s*45-minute technical deep dive with Lead AI Architect Aryveer Srivastav\./g,
    'Direct Engineering Access:</strong> 45-minute technical deep dive with Senior AI Infrastructure Architects.'
  );

  content = content.replace(
    /Speak directly with Founder &amp; Lead AI Architect Aryveer Srivastav to map your workflows and audit your technical bottlenecks\./g,
    'Speak directly with the God of Automation systems engineering team to map your workflows and audit your technical bottlenecks.'
  );

  content = content.replace(
    /Aryveer Srivastav &bull; Founder &amp; Lead AI Architect &bull; Lucknow, Uttar Pradesh, India/g,
    'God of Automation &bull; Data Governance &amp; Compliance Office &bull; Enterprise Operations'
  );

  content = content.replace(
    /Contact Aryveer Srivastav at godofautomationofficial@gmail\.com/g,
    'Contact the Legal & Governance Team at godofautomationofficial@gmail.com'
  );

  content = content.replace(
    /<h4 style="font-size: 18px; font-weight: 800; color: var\(--color-dark\); margin-bottom: 8px;">Aryveer Srivastav<\/h4>/g,
    '<h4 style="font-size: 18px; font-weight: 800; color: var(--color-dark); margin-bottom: 8px;">Data Protection Officer</h4>'
  );

  content = content.replace(
    /These Terms of Service \("Terms"\) govern your access to and use of the services, digital products, and bespoke engineering infrastructure provided by <strong>God of Automation<\/strong> \("Agency", "we", "us"\), operated by <strong>Aryveer Srivastav<\/strong>, located in <strong>Lucknow, Uttar Pradesh, India<\/strong>\./g,
    'These Terms of Service ("Terms") govern your access to and use of the services, digital products, and bespoke engineering infrastructure provided by <strong>God of Automation</strong> ("Agency", "we", "us").'
  );

  content = content.replace(
    /Aryveer will review your stack within 24 hours\./g,
    'The God of Automation Engineering Team will review your stack within 24 hours.'
  );

  content = content.replace(/<li><a href="index\.html#about">About Aryveer<\/a><\/li>/g, '<li><a href="index.html#about">About Agency</a></li>');

  content = content.replace(
    /<a href="https:\/\/github\.com\/aryveersrivastav" target="_blank" rel="noopener" class="bento-action-link">/g,
    '<a href="https://github.com/godofautomation" target="_blank" rel="noopener" class="bento-action-link">'
  );

  // 4. Clean footer copyright
  content = content.replace(
    /<div>.*?©.*?God of Automation.*?Engineered by Aryveer Srivastav.*?<\/div>/gs,
    '<div>© 2026 God of Automation. All rights reserved. Sovereign Enterprise AI Systems.</div>'
  );

  // 5. Update offcanvas drawer footer button
  content = content.replace(
    /<a href="(?:index\.html)?#contact" class="neuros-button btn-pill-gradient" style="width: 100%; justify-content: center;">\s*<span>Deploy Systems<\/span>\s*<i class="fas fa-arrow-right"><\/i>\s*<\/a>/g,
    `<a href="book.html" class="neuros-button btn-pill-solid" style="width: 100%; justify-content: center;"><span>Book Architecture Call</span><i class="fas fa-calendar-check"></i></a>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${file}`);
});
