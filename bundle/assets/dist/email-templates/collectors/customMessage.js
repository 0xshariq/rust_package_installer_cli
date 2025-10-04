import inquirer from 'inquirer';
import chalk from 'chalk';
/**
 * Collect custom message information from user with formatting instructions
 */
export async function collectCustomMessageData() {
    console.log(chalk.hex('#00d2d3')('\n📝 Custom Message Guidelines:'));
    console.log(chalk.hex('#95afc0')('• Use clear, concise subject line'));
    console.log(chalk.hex('#95afc0')('• Write body in plain text or HTML format'));
    console.log(chalk.hex('#95afc0')('• Use \\n for line breaks in plain text'));
    console.log(chalk.hex('#95afc0')('• HTML tags will be automatically formatted'));
    console.log(chalk.hex('#95afc0')('• Example HTML: <p>Hello</p><br><strong>Important:</strong> Details'));
    console.log(chalk.hex('#ffa502')('• Your message will be professionally formatted with CSS styling\n'));
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Email subject:',
            validate: (input) => input.length > 0 || 'Subject is required'
        },
        {
            type: 'editor',
            name: 'description',
            message: 'Email body (opens in your default editor):',
            validate: (input) => input.length > 10 || 'Please provide a detailed message (min 10 characters)'
        },
        {
            type: 'list',
            name: 'format',
            message: 'Body format:',
            choices: [
                { name: 'Plain Text (will be formatted automatically)', value: 'plain' },
                { name: 'HTML (advanced formatting)', value: 'html' }
            ]
        },
        {
            type: 'list',
            name: 'priority',
            message: 'Message priority:',
            choices: [
                { name: 'Normal', value: 'normal' },
                { name: 'High', value: 'high' },
                { name: 'Urgent', value: 'urgent' }
            ]
        }
    ]);
    return answers;
}
