import { EMAIL_CSS } from './styles.js';
export function generateQuestionTemplate(data, systemInfo) {
    return {
        subject: `[Package Installer CLI] ❓ Question: ${data.title}`,
        htmlBody: `
      ${EMAIL_CSS}
      <body>
        <div class="email-container">
          <div class="header question">
            <span class="emoji">❓</span>
            <h1>Question</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Package Installer CLI</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Question Title</h3>
              <p><strong>${data.title}</strong></p>
            </div>
            
            <div class="section">
              <h3>Question Details</h3>
              <p>${data.description}</p>
            </div>
            
            ${data.context ? `
            <div class="section">
              <h3>Context</h3>
              <p>${data.context}</p>
            </div>
            ` : ''}
            
            ${data.tried ? `
            <div class="section">
              <h3>What I've Tried</h3>
              <p>${data.tried}</p>
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
            <div class="timestamp">Asked at: ${systemInfo.timestamp}</div>
            <p style="margin: 10px 0 0 0;">We'll get back to you soon! 💬</p>
          </div>
        </div>
      </body>
    `,
        plainBody: `Hi Shariq,

I have a question about Package Installer CLI.

Question Title: ${data.title}

Question Details:
${data.description}

Context:
${data.context || 'Not provided'}

What I've Tried:
${data.tried || 'Not provided'}

Additional Information:
${data.additional || 'None'}

System Information:
- OS: ${systemInfo.platform} (${systemInfo.arch})
- Node.js: ${systemInfo.nodeVersion}
- CLI Version: ${systemInfo.cliVersion}
- Working Directory: ${systemInfo.workingDirectory}

Asked at: ${systemInfo.timestamp}

Best regards,
${data.name || 'Anonymous User'}
${data.email ? `Contact: ${data.email}` : ''}`
    };
}
