import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        faq: resolve(__dirname, 'faq.html'),
        legal: resolve(__dirname, 'legal.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        book: resolve(__dirname, 'book.html'),
        resources: resolve(__dirname, 'resources.html'),
        'hospital-os': resolve(__dirname, 'deployments/hospital-os.html'),
        'distributed-transaction': resolve(__dirname, 'deployments/distributed-transaction.html'),
        'lead-routing': resolve(__dirname, 'deployments/lead-routing.html'),
        'predictive-analytics': resolve(__dirname, 'deployments/predictive-analytics.html'),
        'custom-infrastructure': resolve(__dirname, 'deployments/custom-infrastructure.html'),
        'orchestrated-outreach': resolve(__dirname, 'deployments/orchestrated-outreach.html'),
        'ats-bypass-guide': resolve(__dirname, 'deployments/ats-bypass-guide.html'),
        'elite-resume-rebuild': resolve(__dirname, 'deployments/elite-resume-rebuild.html'),
      }
    }
  }
});
