import { EMAIL_CSS } from './styles.js';
export function generateFeatureRequestTemplate(data, systemInfo) {
    return {
        subject: `[Package Installer CLI] ✨ Feature Request: ${data.title}`,
        htmlBody: `
      ${EMAIL_CSS}
      <body>
        <div class="email-container">
          <div class="header feature">
            <span class="emoji">✨</span>
            <h1>Feature Request</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Package Installer CLI</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Feature Title</h3>
              <p><strong>${data.title}</strong></p>
            </div>
            
            <div class="section">
              <h3>Description</h3>
              <p>${data.description}</p>
            </div>
            
            ${data.useCase ? `
            <div class="section">
              <h3>Use Case</h3>
              <p>${data.useCase}</p>
            </div>
            ` : ''}
            
            ${data.benefits ? `
            <div class="section">
              <h3>Benefits</h3>
              <p>${data.benefits}</p>
            </div>
            ` : ''}
            
            ${data.implementation ? `
            <div class="section">
              <h3>Implementation Ideas</h3>
              <p>${data.implementation}</p>
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
            <div class="timestamp">Submitted at: ${systemInfo.timestamp}</div>
            <p style="margin: 10px 0 0 0;">Thank you for helping improve Package Installer CLI! 🚀</p>
          </div>
        </div>
      </body>
    `,
        plainBody: `Hi Shariq,

I have a feature request for Package Installer CLI.

Feature Title: ${data.title}

Description:
${data.description}

Use Case:
${data.useCase || 'Not provided'}

Benefits:
${data.benefits || 'Not provided'}

Implementation Ideas:
${data.implementation || 'Not provided'}

Additional Information:
${data.additional || 'None'}

System Information:
- OS: ${systemInfo.platform} (${systemInfo.arch})
- Node.js: ${systemInfo.nodeVersion}
- CLI Version: ${systemInfo.cliVersion}
- Working Directory: ${systemInfo.workingDirectory}

Submitted at: ${systemInfo.timestamp}

Best regards,
${data.name || 'Anonymous User'}
${data.email ? `Contact: ${data.email}` : ''}`
    };
}
