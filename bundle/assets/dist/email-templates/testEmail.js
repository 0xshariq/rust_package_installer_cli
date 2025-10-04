import { EMAIL_CSS } from './styles.js';
export function generateTestEmailTemplate(systemInfo) {
    return {
        subject: `[Package Installer CLI] 🧪 Test Email - ${systemInfo.timestamp}`,
        htmlBody: `
      ${EMAIL_CSS}
      <body>
        <div class="email-container">
          <div class="header test">
            <span class="emoji">🧪</span>
            <h1>Email Test</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Package Installer CLI</p>
          </div>
          
          <div class="content">
            <div class="test-success">
              ✅ Email functionality is working correctly!
            </div>
            
            <p>This is a test email from Package Installer CLI to verify that the email system is properly configured and working.</p>
            
            <div class="system-info">
              <strong>System Information:</strong><br>
              - OS: ${systemInfo.platform} (${systemInfo.arch})<br>
              - Node.js: ${systemInfo.nodeVersion}<br>
              - CLI Version: ${systemInfo.cliVersion}<br>
              - Working Directory: ${systemInfo.workingDirectory}
            </div>
            
            <p>If you receive this email with proper formatting, both HTML and plain text email delivery are functioning correctly.</p>
          </div>
          
          <div class="footer">
            <div class="timestamp">Test completed at: ${systemInfo.timestamp}</div>
            <p style="margin: 10px 0 0 0;">Package Installer CLI Email System 📧</p>
          </div>
        </div>
      </body>
    `,
        plainBody: `This is a test email from Package Installer CLI.

✅ EMAIL TEST SUCCESSFUL ✅

If you receive this email, the email functionality is working correctly!

System Information:
- OS: ${systemInfo.platform} (${systemInfo.arch})
- Node.js: ${systemInfo.nodeVersion}
- CLI Version: ${systemInfo.cliVersion}
- Working Directory: ${systemInfo.workingDirectory}

Test completed at: ${systemInfo.timestamp}

Package Installer CLI Email System`
    };
}
