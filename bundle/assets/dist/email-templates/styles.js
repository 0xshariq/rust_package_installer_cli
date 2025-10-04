/**
 * Common CSS styles for all email templates
 */
export const EMAIL_CSS = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .email-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header .emoji {
      font-size: 48px;
      display: block;
      margin-bottom: 10px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 25px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .section h3 {
      margin: 0 0 15px 0;
      color: #667eea;
      font-size: 18px;
      font-weight: 600;
    }
    .section p {
      margin: 0;
      white-space: pre-wrap;
    }
    .priority-high {
      border-left-color: #e74c3c;
    }
    .priority-high h3 {
      color: #e74c3c;
    }
    .priority-critical {
      border-left-color: #c0392b;
      background: #fdf2f2;
    }
    .priority-critical h3 {
      color: #c0392b;
    }
    .system-info {
      background: #e8f4f8;
      border: 1px solid #bee5eb;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 13px;
      color: #495057;
    }
    .steps-list {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
    }
    .steps-list ol {
      margin: 0;
      padding-left: 20px;
    }
    .steps-list li {
      margin: 8px 0;
      padding: 5px 0;
    }
    .features-list {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
    }
    .features-list ul {
      margin: 0;
      padding-left: 20px;
    }
    .features-list li {
      margin: 8px 0;
      padding: 5px 0;
    }
    .footer {
      background: #495057;
      color: white;
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
    }
    .priority-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 10px;
    }
    .priority-low {
      background: #d1ecf1;
      color: #0c5460;
    }
    .priority-medium {
      background: #fff3cd;
      color: #856404;
    }
    .priority-high-badge {
      background: #f8d7da;
      color: #721c24;
    }
    .priority-critical-badge {
      background: #f5c6cb;
      color: #491217;
    }
    .contact-info {
      background: #e8f5e8;
      border: 1px solid #c3e6cb;
      border-radius: 6px;
      padding: 15px;
      margin: 15px 0;
    }
    .timestamp {
      color: #6c757d;
      font-size: 13px;
      font-style: italic;
    }
    .test-success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
      font-weight: 600;
    }
    .header.test {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }
  </style>
`;
