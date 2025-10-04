import inquirer from 'inquirer';
/**
 * Collect documentation issue information from user
 */
export async function collectDocsData() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Documentation issue title:',
            validate: (input) => input.length > 0 || 'Title is required'
        },
        {
            type: 'input',
            name: 'section',
            message: 'Documentation section (e.g., README, commands.md):',
        },
        {
            type: 'input',
            name: 'description',
            message: 'Issue description:',
            validate: (input) => input.length > 10 || 'Please provide a detailed description (min 10 characters)'
        },
        {
            type: 'input',
            name: 'problems',
            message: 'Current content problems (optional):'
        },
        {
            type: 'input',
            name: 'suggestions',
            message: 'Suggested improvements (optional):'
        },
        {
            type: 'input',
            name: 'additional',
            message: 'Additional context (optional):'
        }
    ]);
    return answers;
}
