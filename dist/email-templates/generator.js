import { generateBugReportTemplate } from './bugReport.js';
import { generateFeatureRequestTemplate } from './featureRequest.js';
import { generateTemplateRequestTemplate } from './templateRequest.js';
import { generateQuestionTemplate } from './question.js';
import { generateImprovementTemplate } from './improvement.js';
import { generateDocsTemplate } from './docs.js';
/**
 * Generate HTML email template using modular template functions
 */
export function generateEmailTemplate(category, data, systemInfo) {
    // Convert data to TemplateData interface
    const templateData = {
        title: data.title,
        description: data.description,
        // Bug report specific
        steps: data.steps,
        expected: data.expected,
        actual: data.actual,
        // Feature request specific
        useCase: data.useCase,
        solution: data.solution,
        benefits: data.benefits,
        implementation: data.implementation,
        // Template request specific
        framework: data.framework,
        features: data.features,
        similar: data.similar,
        // Question specific
        tried: data.tried,
        context: data.context,
        // Improvement specific
        currentBehavior: data.current,
        proposedBehavior: data.description,
        // Documentation specific
        docSection: data.section,
        issue: data.problems,
        suggestion: data.suggestions,
        // Common fields
        priority: data.priority,
        additional: data.additional,
        name: data.name,
        email: data.email
    };
    // Use appropriate template function based on category
    switch (category) {
        case 'bug':
            return generateBugReportTemplate(templateData, systemInfo);
        case 'feature':
            return generateFeatureRequestTemplate(templateData, systemInfo);
        case 'template':
            return generateTemplateRequestTemplate(templateData, systemInfo);
        case 'question':
            return generateQuestionTemplate(templateData, systemInfo);
        case 'improvement':
            return generateImprovementTemplate(templateData, systemInfo);
        case 'docs':
            return generateDocsTemplate(templateData, systemInfo);
        default:
            // Fallback to question template for unknown categories
            return generateQuestionTemplate(templateData, systemInfo);
    }
}
