import inquirer from 'inquirer';
/**
 * Collect feature request information from user
 */
export async function collectFeatureRequestData() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Feature title:',
            validate: (input) => input.length > 0 || 'Title is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Detailed description of the feature:',
            validate: (input) => input.length > 10 || 'Please provide a detailed description (min 10 characters)'
        },
        {
            type: 'input',
            name: 'useCase',
            message: 'Use case - why do you need this feature? (optional):'
        },
        {
            type: 'input',
            name: 'solution',
            message: 'Proposed solution or implementation ideas (optional):'
        },
        {
            type: 'list',
            name: 'priority',
            message: 'Priority level:',
            choices: [
                { name: 'Low - Nice to have', value: 'Low' },
                { name: 'Medium - Would be helpful', value: 'Medium' },
                { name: 'High - Really needed', value: 'High' },
                { name: 'Critical - Blocking my work', value: 'Critical' }
            ]
        },
        {
            type: 'input',
            name: 'additional',
            message: 'Additional context or information (optional):'
        }
    ]);
    return answers;
}
