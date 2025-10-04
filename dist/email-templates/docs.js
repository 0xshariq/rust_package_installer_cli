import { EMAIL_CSS } from './styles.js';
export function generateDocsTemplate(data, systemInfo) {
    return {
        subject: `[Package Installer CLI] 📚 Documentation Issue: ${data.title}`,
        htmlBody: `
      ${EMAIL_CSS}
      <body>
        <div class="email-container">
          <div class="header docs">
            <span class="emoji">📚</span>
            <h1>Documentation Issue</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Package Installer CLI</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Issue Title</h3>
              <p><strong>${data.title}</strong></p>
            </div>
            
            <div class="section">
              <h3>Description</h3>
              <p>${data.description}</p>
            </div>
            
            ${data.docSection ? `
            <div class="section">
              <h3>Documentation Section</h3>
              <p>${data.docSection}</p>
            </div>
            ` : ''}
            
            ${data.issue ? `
            <div class="section">
              <h3>Issue Type</h3>
              <p>${data.issue}</p>
            </div>
            ` : ''}
            
            ${data.suggestion ? `
            <div class="section">
              <h3>Suggested Improvement</h3>
              <p>${data.suggestion}</p>
            </div>
            ` : ''}
            
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
            <p style="margin: 10px 0 0 0;">Thank you for helping improve our documentation! 📖</p>
          </div>
        </div>
      </body>
    `,
        plainBody: `Hi Shariq,

I found an issue with Package Installer CLI documentation.

Issue Title: ${data.title}

Description:
${data.description}

Documentation Section:
${data.docSection || 'Not specified'}

Issue Type:
${data.issue || 'Not specified'}

Suggested Improvement:
${data.suggestion || 'Not provided'}

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
