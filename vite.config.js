import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        faq: resolve(import.meta.dirname, 'faq.html'),
        legal: resolve(import.meta.dirname, 'legal.html'),
        terms: resolve(import.meta.dirname, 'terms.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        book: resolve(import.meta.dirname, 'book.html'),
        resources: resolve(import.meta.dirname, 'resources.html'),
        'hospital-os': resolve(import.meta.dirname, 'deployments/hospital-os.html'),
        'distributed-transaction': resolve(import.meta.dirname, 'deployments/distributed-transaction.html'),
        'lead-routing': resolve(import.meta.dirname, 'deployments/lead-routing.html'),
        'predictive-analytics': resolve(import.meta.dirname, 'deployments/predictive-analytics.html'),
        'custom-infrastructure': resolve(import.meta.dirname, 'deployments/custom-infrastructure.html'),
        'orchestrated-outreach': resolve(import.meta.dirname, 'deployments/orchestrated-outreach.html'),
        'ats-bypass-guide': resolve(import.meta.dirname, 'deployments/ats-bypass-guide.html'),
        'elite-resume-rebuild': resolve(import.meta.dirname, 'deployments/elite-resume-rebuild.html'),
      }
    }
  }
});
