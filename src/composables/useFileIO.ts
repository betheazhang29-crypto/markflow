/**
 * 文件导入导出 Composable
 */
export function useFileIO() {
  /**
   * 导入 Markdown 文件
   */
  const importMarkdown = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.md')) {
        reject(new Error('请选择 .md 格式的文件'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsText(file, 'UTF-8');
    });
  };

  /**
   * 导出为 Markdown 文件
   */
  const exportMarkdown = (content: string, filename: string = 'document.md'): void => {
    try {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      downloadFile(blob, filename);
    } catch (error) {
      console.error('导出 Markdown 失败:', error);
      alert('导出失败，请重试');
    }
  };

  /**
   * 导出为 HTML 文件
   */
  const exportHTML = (htmlContent: string, filename: string = 'document.html'): void => {
    try {
      const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #24292e;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    p { margin-bottom: 16px; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      background: #f6f8fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
    }
    pre {
      background: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
    }
    pre code {
      background: transparent;
      padding: 0;
    }
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    th, td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
      text-align: left;
    }
    th {
      background: #f6f8fa;
      font-weight: 600;
    }
    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

      const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
      downloadFile(blob, filename);
    } catch (error) {
      console.error('导出 HTML 失败:', error);
      alert('导出失败，请重试');
    }
  };

  /**
   * 通用文件下载函数
   */
  const downloadFile = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    importMarkdown,
    exportMarkdown,
    exportHTML,
  };
}

