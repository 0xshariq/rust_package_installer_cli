import inquirer from 'inquirer';
/**
 * Collect bug report information from user
 */
export async function collectBugReportData() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Bug title (brief description):',
            validate: (input) => input.length > 0 || 'Title is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Detailed description of the bug:',
            validate: (input) => input.length > 10 || 'Please provide a detailed description (min 10 characters)'
        },
        {
            type: 'input',
            name: 'steps',
            message: 'Steps to reproduce (optional, use | to separate steps):'
        },
        {
            type: 'input',
            name: 'expected',
            message: 'What did you expect to happen? (optional):'
        },
        {
            type: 'input',
            name: 'actual',
            message: 'What actually happened? (optional):'
        },
        {
            type: 'input',
            name: 'additional',
            message: 'Any additional information? (optional):'
        }
    ]);
    return answers;
}
