<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Toolbar from './components/Toolbar.vue';
import Editor from './components/Editor.vue';
import Preview from './components/Preview.vue';
import { useStorage } from './composables/useStorage';
import { useFileIO } from './composables/useFileIO';
import { useMarkdown } from './composables/useMarkdown';

// 初始化存储和文件操作
const { save, load, clear } = useStorage();
const { exportMarkdown, exportHTML } = useFileIO();
const { parseMarkdown } = useMarkdown();

// 编辑器内容
const content = ref('');

// 防抖保存
let saveTimer: number | null = null;
const debouncedSave = (text: string) => {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = window.setTimeout(() => {
    save(text);
  }, 800);
};

// 监听内容变化，自动保存
watch(content, (newContent) => {
  debouncedSave(newContent);
});

// 处理导入
const handleImport = (importedContent: string) => {
  content.value = importedContent;
};

// 处理导出 Markdown
const handleExportMarkdown = () => {
  const filename = prompt('请输入文件名（不含扩展名）', 'document');
  if (filename) {
    exportMarkdown(content.value, `${filename}.md`);
  }
};

// 处理导出 HTML
const handleExportHTML = () => {
  const filename = prompt('请输入文件名（不含扩展名）', 'document');
  if (filename) {
    const html = parseMarkdown(content.value);
    exportHTML(html, `${filename}.html`);
  }
};

// 处理清空
const handleClear = () => {
  content.value = '';
  clear();
};

// 初始化时加载内容
onMounted(() => {
  content.value = load();
});
</script>

<template>
  <div class="app-container">
    <Toolbar
      @import="handleImport"
      @export-markdown="handleExportMarkdown"
      @export-html="handleExportHTML"
      @clear="handleClear"
    />

    <div class="main-content">
      <div class="editor-panel">
        <Editor v-model="content" />
      </div>

      <div class="divider"></div>

      <div class="preview-panel">
        <Preview :markdown="content" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-panel {
  flex: 1;
  overflow: hidden;
}

.divider {
  width: 1px;
  background-color: #e1e4e8;
}

.preview-panel {
  flex: 1;
  overflow: hidden;
}
</style>

