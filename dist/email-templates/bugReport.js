import { EMAIL_CSS } from './styles.js';
export function generateBugReportTemplate(data, systemInfo) {
    const stepsHtml = data.steps ?
        `<div class="steps-list"><ol>${data.steps.split('|').map((step) => `<li>${step.trim()}</li>`).join('')}</ol></div>` :
        '<p style="color: #6c757d; font-style: italic;">Not provided</p>';
    return {
        subject: `[Package Installer CLI] 🐛 Bug Report: ${data.title}`,
        htmlBody: `
      ${EMAIL_CSS}
      <body>
        <div class="email-container">
          <div class="header">
            <span class="emoji">🐛</span>
            <h1>Bug Report</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Package Installer CLI</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Bug Title</h3>
              <p><strong>${data.title}</strong></p>
            </div>
            
            <div class="section">
              <h3>Description</h3>
              <p>${data.description}</p>
            </div>
            
            <div class="section">
              <h3>Steps to Reproduce</h3>
              ${stepsHtml}
            </div>
            
            <div class="section">
              <h3>Expected Behavior</h3>
              <p>${data.expected || '<span style="color: #6c757d; font-style: italic;">Not provided</span>'}</p>
            </div>
            
            <div class="section">
              <h3>Actual Behavior</h3>
              <p>${data.actual || '<span style="color: #6c757d; font-style: italic;">Not provided</span>'}</p>
            </div>
            
            ${data.additional ? `
            <div class="section">
              <h3>Additional Information</h3>
              <p>${data.additional}</p>
            </div>
            ` : ''}
            
            <div class="system-info">
              <strong>System Information:</strong><br>
              - OS: ${systemInfo.platform} (${systemInfo.arch})<br>
              - Node.js: ${systemInfo.nodeVersion}<br>
              - CLI Version: ${systemInfo.cliVersion}<br>
              - Working Directory: ${systemInfo.workingDirectory}
            </div>
            
            ${data.name || data.email ? `
            <div class="contact-info">
              <strong>Contact Information:</strong><br>
              ${data.name ? `Name: ${data.name}<br>` : ''}
              ${data.email ? `Email: ${data.email}` : ''}
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <div class="timestamp">Reported at: ${systemInfo.timestamp}</div>
            <p style="margin: 10px 0 0 0;">Thank you for helping improve Package Installer CLI! 🚀</p>
          </div>
        </div>
      </body>
    `,
        plainBody: `Hi Shariq,

I encountered a bug while using Package Installer CLI.

Bug Title: ${data.title}

Description:
${data.description}

Steps to Reproduce:
${data.steps ? data.steps.split('|').map((step, index) => `${index + 1}. ${step.trim()}`).join('\n') : 'Not provided'}

Expected Behavior:
${data.expected || 'Not provided'}

Actual Behavior:
${data.actual || 'Not provided'}

Additional Information:
${data.additional || 'None'}

System Information:
- OS: ${systemInfo.platform} (${systemInfo.arch})
- Node.js: ${systemInfo.nodeVersion}
- CLI Version: ${systemInfo.cliVersion}
- Working Directory: ${systemInfo.workingDirectory}

Reported at: ${systemInfo.timestamp}

Best regards,
${data.name || 'Anonymous User'}
${data.email ? `Contact: ${data.email}` : ''}`
    };
}
