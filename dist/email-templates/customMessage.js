import { EMAIL_CSS } from './styles.js';
/**
 * Format text content based on format type
 */
function formatContent(content, format) {
    if (format === 'html') {
        // If user provided HTML, wrap it in a content div for consistent styling
        return `<div class="custom-content">${content}</div>`;
    }
    else {
        // Convert plain text to HTML with line breaks and basic formatting
        return `<div class="custom-content">${content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')}</div>`;
    }
}
export function generateCustomMessageTemplate(data, systemInfo) {
    const priorityClass = data.priority === 'high' ? 'priority-high' :
        data.priority === 'urgent' ? 'priority-critical' : '';
    const priorityBadge = data.priority === 'high' ? 'priority-high-badge' :
        data.priority === 'urgent' ? 'priority-critical-badge' :
            'priority-low';
    const priorityText = data.priority === 'urgent' ? 'Urgent' :
        data.priority === 'high' ? 'High Priority' :
            'Normal Priority';
    const formattedContent = formatContent(data.description, data.format || 'plain');
    return {
        subject: `[Package Installer CLI] ✉️ ${data.title}`,
        htmlBody: `
      ${EMAIL_CSS}
      <style>
        .custom-content {
          background: white;
          padding: 20px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          margin: 15px 0;
          line-height: 1.6;
        }
        .custom-content p {
          margin: 10px 0;
        }
        .custom-content code {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 0.9em;
        }
        .header.custom {
          background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
        }
      </style>
      <body>
        <div class="email-container">
          <div class="header custom">
            <span class="emoji">✉️</span>
            <h1>Custom Message</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Package Installer CLI</p>
          </div>
          
          <div class="content">
            <div class="section ${priorityClass}">
              <h3>Subject 
                <span class="priority-badge ${priorityBadge}">${priorityText}</span>
              </h3>
              <p><strong>${data.title}</strong></p>
            </div>
            
            <div class="section">
              <h3>Message</h3>
              ${formattedContent}
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
            <div class="timestamp">Sent at: ${systemInfo.timestamp}</div>
            <p style="margin: 10px 0 0 0;">Package Installer CLI - Custom Message 💬</p>
          </div>
        </div>
      </body>
    `,
        plainBody: `Hi Shariq,

Custom message from Package Installer CLI user.

Subject: ${data.title}

Priority: ${priorityText}

Message:
${data.description}

${data.additional ? `Additional Information:\n${data.additional}\n` : ''}
System Information:
- OS: ${systemInfo.platform} (${systemInfo.arch})
- Node.js: ${systemInfo.nodeVersion}
- CLI Version: ${systemInfo.cliVersion}
- Working Directory: ${systemInfo.workingDirectory}

Sent at: ${systemInfo.timestamp}

Best regards,
${data.name || 'Anonymous User'}
${data.email ? `Contact: ${data.email}` : ''}`
    };
}
