// Main exports for email templates
export * from './types.js';
export * from './styles.js';
// Template generators
export { generateBugReportTemplate } from './bugReport.js';
export { generateFeatureRequestTemplate } from './featureRequest.js';
export { generateTemplateRequestTemplate } from './templateRequest.js';
export { generateQuestionTemplate } from './question.js';
export { generateImprovementTemplate } from './improvement.js';
export { generateDocsTemplate } from './docs.js';
export { generateCustomMessageTemplate } from './customMessage.js';
export { generateTestEmailTemplate } from './testEmail.js';
export { generateEmailTemplate } from './generator.js';
// Data collectors
export * from './collectors/index.js';
