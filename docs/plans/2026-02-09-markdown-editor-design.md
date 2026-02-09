# MarkFlow - 轻量级 Markdown 编辑器设计方案

**日期**：2026-02-09
**版本**：v1.0

## 项目概述

MarkFlow 是一个轻量级的 Markdown 笔记管理工具，运行在浏览器中，专注于提供简洁高效的编辑和预览体验。

### 核心定位
- **轻量级**：最小化功能集，专注核心体验
- **本地优先**：数据存储在浏览器本地，无需服务器
- **即开即用**：纯 Web 应用，无需安装

## 功能需求

### 核心功能
1. **Markdown 编辑**
   - 分屏模式（左侧编辑，右侧预览）
   - 实时渲染
   - 自动保存到 localStorage

2. **Markdown 支持**
   - GitHub Flavored Markdown (GFM)
   - 基础语法：标题、列表、粗体、斜体、链接、图片、代码块
   - GFM 扩展：表格、任务列表、删除线

3. **导入导出**
   - 导入：支持 .md 文件上传
   - 导出：支持导出为 .md 和 .html 格式

4. **数据持久化**
   - 使用 localStorage 存储内容
   - 自动保存（防抖策略）

### 非功能需求
- 响应式设计（支持桌面和平板）
- 快速加载（< 2s）
- 简洁的用户界面

## 技术架构

### 技术栈

**前端框架**：
- Vue 3（Composition API）
- TypeScript
- Vite（构建工具）

**核心依赖**：
- `marked`：Markdown 解析器（轻量、快速、支持 GFM）
- `DOMPurify`：HTML 清理库（防止 XSS 攻击）

**样式方案**：
- Tailwind CSS（推荐）或原生 CSS

**状态管理**：
- 不使用 Vuex/Pinia
- 使用 Vue 3 的 `ref/reactive` 管理状态

### 应用架构

```
┌─────────────────────────────────────┐
│          工具栏模块                  │
│  [导入] [导出MD] [导出HTML] [清空]   │
└─────────────────────────────────────┘
┌──────────────────┬──────────────────┐
│                  │                  │
│   编辑器模块      │    预览模块       │
│   (textarea)     │   (HTML 渲染)    │
│                  │                  │
│                  │                  │
└──────────────────┴──────────────────┘
         ↓                    ↑
    localStorage          marked 解析
```

### 模块设计

#### 1. 编辑器模块
- 使用原生 `<textarea>` 或轻量级编辑器组件
- 监听 `input` 事件，触发预览更新
- 实现基础快捷键（Ctrl+S 保存等）

#### 2. 预览模块
- 接收 Markdown 文本
- 使用 `marked` 解析为 HTML
- 使用 `DOMPurify` 清理 HTML
- 渲染到预览区域

#### 3. 工具栏模块
- 导入按钮：触发文件选择器
- 导出按钮：生成文件并下载
- 清空按钮：清除编辑器内容

## 核心功能实现

### 1. Markdown 解析

```typescript
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked
marked.setOptions({
  gfm: true,           // GitHub Flavored Markdown
  breaks: true,        // 支持换行
  headerIds: true,     // 自动生成标题 ID
});

// 解析函数
function parseMarkdown(markdown: string): string {
  const rawHTML = marked.parse(markdown);
  const cleanHTML = DOMPurify.sanitize(rawHTML);
  return cleanHTML;
}
```

### 2. 数据持久化

```typescript
// 存储服务接口
interface StorageService {
  save(content: string): void;
  load(): string;
  clear(): void;
}

// localStorage 实现
const STORAGE_KEY = 'markflow_content';

const storageService: StorageService = {
  save(content: string) {
    localStorage.setItem(STORAGE_KEY, content);
  },

  load(): string {
    return localStorage.getItem(STORAGE_KEY) || '';
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// 自动保存（防抖）
import { debounce } from 'lodash-es'; // 或自己实现

const autoSave = debounce((content: string) => {
  storageService.save(content);
}, 800); // 800ms 延迟
```

### 3. 文件导入

```typescript
function importMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
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
}

// 使用示例
async function handleFileImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && file.name.endsWith('.md')) {
    try {
      const content = await importMarkdownFile(file);
      // 更新编辑器内容
      editorContent.value = content;
    } catch (error) {
      console.error('导入失败', error);
    }
  }
}
```

### 4. 文件导出

```typescript
// 导出 Markdown
function exportAsMarkdown(content: string, filename: string = 'document.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadFile(blob, filename);
}

// 导出 HTML
function exportAsHTML(htmlContent: string, filename: string = 'document.html') {
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
      color: #333;
    }
    /* GitHub 风格样式 */
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    /* 更多样式... */
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  downloadFile(blob, filename);
}

// 通用下载函数
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

## 组件结构

```
src/
├── App.vue                 # 主应用组件
├── components/
│   ├── Editor.vue         # 编辑器组件
│   ├── Preview.vue        # 预览组件
│   └── Toolbar.vue        # 工具栏组件
├── composables/
│   ├── useMarkdown.ts     # Markdown 解析逻辑
│   ├── useStorage.ts      # 存储逻辑
│   └── useFileIO.ts       # 文件导入导出逻辑
├── utils/
│   ├── markdown.ts        # Markdown 工具函数
│   └── storage.ts         # 存储工具函数
└── styles/
    └── markdown.css       # Markdown 预览样式
```

## 数据流

```
用户输入
   ↓
编辑器组件 (Editor.vue)
   ↓
更新 reactive state
   ↓
触发两个操作：
   ├─→ 自动保存到 localStorage (防抖)
   └─→ 传递给预览组件
          ↓
       marked 解析
          ↓
       DOMPurify 清理
          ↓
       渲染 HTML (Preview.vue)
```

## 开发计划

### 阶段 1：基础框架（1-2 天）
- [ ] 搭建项目结构
- [ ] 安装依赖（marked, DOMPurify, Tailwind CSS）
- [ ] 创建基础组件（Editor, Preview, Toolbar）
- [ ] 实现分屏布局

### 阶段 2：核心功能（2-3 天）
- [ ] 实现 Markdown 解析和渲染
- [ ] 实现 localStorage 存储
- [ ] 实现自动保存（防抖）
- [ ] 添加 GitHub 风格样式

### 阶段 3：导入导出（1-2 天）
- [ ] 实现 Markdown 文件导入
- [ ] 实现 Markdown 文件导出
- [ ] 实现 HTML 文件导出
- [ ] 添加文件名输入功能

### 阶段 4：优化和测试（1-2 天）
- [ ] 响应式设计优化
- [ ] 错误处理
- [ ] 用户体验优化
- [ ] 浏览器兼容性测试

## 技术风险和注意事项

### 1. localStorage 限制
- **风险**：localStorage 通常有 5-10MB 限制
- **缓解**：对于单文件编辑器，这个限制足够；如果超出，提示用户导出文件

### 2. XSS 安全
- **风险**：Markdown 中可能包含恶意脚本
- **缓解**：使用 DOMPurify 清理所有 HTML 输出

### 3. 浏览器兼容性
- **风险**：File API 和 localStorage 在旧浏览器中可能不支持
- **缓解**：添加特性检测，提示用户升级浏览器

### 4. 性能
- **风险**：大文件实时渲染可能卡顿
- **缓解**：使用防抖延迟渲染；如果文件过大，提示用户

## 未来扩展方向

以下功能可在 v1.0 稳定后考虑：

1. **编辑器增强**
   - 语法高亮
   - 行号显示
   - 快捷键工具栏（加粗、斜体等）

2. **预览增强**
   - 代码块语法高亮
   - 数学公式支持（KaTeX）
   - Mermaid 图表支持

3. **多文件管理**
   - 文件列表
   - 文件切换
   - IndexedDB 存储

4. **其他功能**
   - 主题切换（亮色/暗色）
   - 导出 PDF
   - 全屏模式
   - 字数统计

## 总结

MarkFlow 采用简洁的技术栈和清晰的架构设计，专注于提供轻量级的 Markdown 编辑体验。通过最小化功能集和合理的技术选型，可以快速实现一个可用的 MVP 版本，并为未来扩展留有空间。
