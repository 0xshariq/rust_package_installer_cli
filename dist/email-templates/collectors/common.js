import inquirer from 'inquirer';
/**
 * Collect user contact information (optional)
 */
export async function collectContactInfo() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Your name (optional):',
        },
        {
            type: 'input',
            name: 'email',
            message: 'Your email (optional, for follow-up):',
            validate: (input) => {
                if (!input)
                    return true; // Optional field
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(input) || 'Please enter a valid email address';
            }
        }
    ]);
    return answers;
}
/**
 * Collect quick feedback (minimal prompts for fast feedback)
 */
export async function collectQuickFeedback(category) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: `Brief ${category} summary:`,
            validate: (input) => input.length > 0 || 'Summary is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Detailed description:',
            validate: (input) => input.length > 10 || 'Please provide more details (min 10 characters)'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Your email (optional, for follow-up):',
            validate: (input) => {
                if (!input)
                    return true;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(input) || 'Please enter a valid email address';
            }
        }
    ]);
    return answers;
}
