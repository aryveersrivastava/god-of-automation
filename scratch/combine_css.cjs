const fs = require('fs');

const baseCss = fs.readFileSync('scratch/original_style.css', 'utf8');

const addonCss = `
/* ==========================================================================
   ENHANCED EXTENSIONS & NEW SECTIONS FOR RED, WHITE & COLOURFUL THEME
   ========================================================================== */

/* --- Star Rating Row --- */
.star-rating-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #F59E0B;
  font-size: 15px;
  margin-bottom: 14px;
}
.star-rating-row i {
  filter: drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4));
}

/* --- Infinite Seamless Ticker (No Gaps, High-Contrast Obsidian + Red) --- */
.ticker-section {
  background: #090E17 !important;
  padding: 18px 0 !important;
  overflow: hidden !important;
  position: relative !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.ticker-wrap {
  display: flex !important;
  overflow: hidden !important;
  user-select: none !important;
  width: 100% !important;
}
.ticker-track {
  display: flex !important;
  align-items: center !important;
  white-space: nowrap !important;
  animation: seamlessTicker 28s linear infinite !important;
  gap: 32px !important;
  flex-shrink: 0 !important;
  padding-right: 32px !important;
}
.ticker-item {
  font-family: var(--font-heading, "Manrope", sans-serif) !important;
  font-size: 14.5px !important;
  font-weight: 700 !important;
  color: #FFFFFF !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  letter-spacing: 0.2px !important;
}
.ticker-item i {
  font-size: 14px !important;
  color: var(--primary-coral, #EF4444) !important;
}
.ticker-dot {
  width: 5px !important;
  height: 5px !important;
  border-radius: 50% !important;
  background: var(--primary-coral, #EF4444) !important;
  display: inline-block !important;
  opacity: 0.8 !important;
}
@keyframes seamlessTicker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* --- Pain Points vs Sovereign Solutions Matrix --- */
.pain-solutions-section {
  padding: 100px 0;
  position: relative;
}
.pain-solutions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}
.pain-solution-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid var(--color-border, #E2E8F0);
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
}
.pain-solution-card:hover {
  transform: translateY(-4px);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 16px 36px -4px rgba(239, 68, 68, 0.1);
}
.pain-box {
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.16);
  border-radius: 14px;
  padding: 18px 20px;
}
.pain-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #DC2626;
  margin-bottom: 8px;
}
.pain-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}
.solution-box {
  background: rgba(37, 99, 235, 0.04);
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 14px;
  padding: 18px 20px;
}
.solution-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #2563EB;
  margin-bottom: 8px;
}
.solution-title {
  font-size: 16px;
  font-weight: 800;
  color: #090E17;
  margin-bottom: 6px;
}
.solution-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: #334155;
  margin: 0;
}

/* --- "How We Work" Workflow Section with SVG Animated Trail --- */
.workflow-trail-section {
  padding: 100px 0;
  position: relative;
  background: #F8FAFC;
  overflow: hidden;
}
.workflow-steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
  margin-top: 50px;
}
.workflow-trail-svg {
  position: absolute;
  top: 32px;
  left: 5%;
  width: 90%;
  height: 60px;
  pointer-events: none;
  z-index: 1;
}
.workflow-trail-path {
  stroke-dasharray: 10, 8;
  stroke-width: 3px;
  stroke-linecap: round;
  fill: none;
  animation: trailDashFlow 20s linear infinite;
}
.workflow-step-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 32px 24px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  position: relative;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.workflow-step-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -6px rgba(124, 58, 237, 0.12);
  border-color: rgba(124, 58, 237, 0.3);
}
.step-number-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 18px;
  border: 1px solid transparent;
}
.step-icon-wrap {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  transition: transform 0.3s ease;
}
.workflow-step-card:hover .step-icon-wrap {
  transform: scale(1.1) rotate(4deg);
}
.step-title {
  font-size: 17px;
  font-weight: 800;
  color: #090E17;
  margin-bottom: 10px;
}
.step-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: #64748B;
  margin: 0;
}

/* --- Hospital OS 3x2 Symmetrical Grid & Components --- */
.pipeline-flowchart-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 40px 32px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 24px -2px rgba(15, 23, 42, 0.05);
}
.pipeline-flowchart-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-coral, #EF4444);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 36px;
}
.pipeline-nodes-track {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 20px !important;
}
.pipeline-node-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 18px;
  padding: 24px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}
.pipeline-node-box:hover {
  transform: translateY(-4px);
  background: #FFFFFF;
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.08);
}
.node-step-index {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}
.node-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 14px;
  border: 1px solid transparent;
}
.node-label-title {
  font-size: 15px;
  font-weight: 800;
  color: #090E17;
  margin-bottom: 8px;
}
.node-label-desc {
  font-size: 12.5px;
  line-height: 1.5;
  color: #64748B;
  margin: 0;
}

/* --- Deep Feature Matrix --- */
.matrix-section {
  padding: 100px 0;
  background: #F8FAFC;
}
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.matrix-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 30px 26px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.03);
  transition: all 0.3s ease;
}
.matrix-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.3);
}
.matrix-card-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  margin-bottom: 16px;
  border: 1px solid transparent;
}
.matrix-card h4 {
  font-size: 17px;
  font-weight: 800;
  color: #090E17;
  margin-bottom: 10px;
}
.matrix-card p {
  font-size: 13.5px;
  line-height: 1.6;
  color: #64748B;
  margin: 0;
}

/* --- Operational Comparison & Metric Bars --- */
.comparison-section {
  padding: 100px 0;
}
.comparison-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 32px;
  align-items: center;
}
.comparison-table-wrap {
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.comparison-table th {
  background: #F8FAFC;
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 800;
  color: #090E17;
  border-bottom: 1px solid #E2E8F0;
}
.comparison-table td {
  padding: 14px 20px;
  font-size: 13.5px;
  color: #334155;
  border-bottom: 1px solid #F1F5F9;
}
.badge-traditional {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(239, 68, 68, 0.08);
  color: #DC2626;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
}
.badge-autonomous {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
}

.metric-bars-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 32px 28px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
}
.metric-bars-card h4 {
  font-size: 18px;
  font-weight: 800;
  color: #090E17;
  margin-bottom: 24px;
}
.metric-bar-group {
  margin-bottom: 20px;
}
.metric-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}
.metric-bar-track {
  height: 9px;
  background: #F1F5F9;
  border-radius: 9999px;
  overflow: hidden;
}
.metric-bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #EF4444 0%, #7C3AED 50%, #2563EB 100%);
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.impact-callout-box {
  margin-top: 40px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(37, 99, 235, 0.06) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.impact-left h3 {
  font-size: 20px;
  font-weight: 800;
  color: #090E17;
  margin-bottom: 6px;
}
.impact-left p {
  font-size: 14.5px;
  color: #475569;
  margin: 0;
}

@media (max-width: 991px) {
  .pain-solutions-grid,
  .workflow-steps-grid,
  .pipeline-nodes-track,
  .matrix-grid,
  .comparison-grid {
    grid-template-columns: 1fr !important;
  }
  .workflow-trail-svg {
    display: none;
  }
  .impact-callout-box {
    flex-direction: column;
    text-align: center;
  }
}
`;

fs.writeFileSync('css/style.css', baseCss + '\n' + addonCss, 'utf8');
console.log('Successfully wrote combined css/style.css!');
