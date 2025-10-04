import inquirer from 'inquirer';
/**
 * Collect improvement suggestion information from user
 */
export async function collectImprovementData() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Improvement title:',
            validate: (input) => input.length > 0 || 'Title is required'
        },
        {
            type: 'input',
            name: 'current',
            message: 'Current behavior (what happens now):',
            validate: (input) => input.length > 0 || 'Current behavior description is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Suggested improvement:',
            validate: (input) => input.length > 10 || 'Please provide a detailed suggestion (min 10 characters)'
        },
        {
            type: 'input',
            name: 'benefits',
            message: 'Benefits of this improvement (optional):'
        },
        {
            type: 'input',
            name: 'implementation',
            message: 'Implementation ideas (optional):'
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
            message: 'Additional context (optional):'
        }
    ]);
    return answers;
}
