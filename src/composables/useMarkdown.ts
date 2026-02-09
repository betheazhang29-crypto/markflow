import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked 支持 GitHub Flavored Markdown
marked.setOptions({
  gfm: true,           // GitHub Flavored Markdown
  breaks: true,        // 支持换行
});

/**
 * 解析 Markdown 为 HTML
 * @param markdown Markdown 文本
 * @returns 清理后的 HTML 字符串
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown) return '';

  try {
    // 使用 marked 解析 Markdown
    const rawHTML = marked.parse(markdown) as string;

    // 使用 DOMPurify 清理 HTML，防止 XSS 攻击
    const cleanHTML = DOMPurify.sanitize(rawHTML);

    return cleanHTML;
  } catch (error) {
    console.error('Markdown 解析失败:', error);
    return '<p>解析失败，请检查 Markdown 语法</p>';
  }
}

/**
 * Markdown 解析 Composable
 */
export function useMarkdown() {
  return {
    parseMarkdown,
  };
}
