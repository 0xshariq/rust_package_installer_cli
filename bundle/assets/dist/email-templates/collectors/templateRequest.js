import inquirer from 'inquirer';
/**
 * Collect template request information from user
 */
export async function collectTemplateRequestData() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Template name:',
            validate: (input) => input.length > 0 || 'Template name is required'
        },
        {
            type: 'input',
            name: 'framework',
            message: 'Framework/Technology (e.g., Next.js, React, Vue, etc.):',
            validate: (input) => input.length > 0 || 'Framework is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Template description:',
            validate: (input) => input.length > 10 || 'Please provide a detailed description (min 10 characters)'
        },
        {
            type: 'input',
            name: 'features',
            message: 'Key features/libraries needed (separate with |):',
            default: 'Authentication | Database | Styling'
        },
        {
            type: 'input',
            name: 'similar',
            message: 'Similar existing templates (optional):'
        },
        {
            type: 'list',
            name: 'priority',
            message: 'Priority level:',
            choices: [
                { name: 'Low - Nice to have', value: 'Low' },
                { name: 'Medium - Would be helpful', value: 'Medium' },
                { name: 'High - Really needed', value: 'High' }
            ]
        },
        {
            type: 'input',
            name: 'additional',
            message: 'Additional requirements or context (optional):'
        }
    ]);
    return answers;
}
