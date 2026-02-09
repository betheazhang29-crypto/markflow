<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <h1 class="toolbar-title">MarkFlow</h1>
    </div>

    <div class="toolbar-right">
      <!-- 导入按钮 -->
      <input
        ref="fileInput"
        type="file"
        accept=".md"
        @change="handleFileImport"
        class="hidden"
      />
      <button @click="triggerFileImport" class="toolbar-btn">
        <span>📁</span>
        <span>导入</span>
      </button>

      <!-- 导出 Markdown -->
      <button @click="handleExportMarkdown" class="toolbar-btn">
        <span>💾</span>
        <span>导出 MD</span>
      </button>

      <!-- 导出 HTML -->
      <button @click="handleExportHTML" class="toolbar-btn">
        <span>🌐</span>
        <span>导出 HTML</span>
      </button>

      <!-- 清空 -->
      <button @click="handleClear" class="toolbar-btn toolbar-btn-danger">
        <span>🗑️</span>
        <span>清空</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Emits {
  (e: 'import', content: string): void;
  (e: 'export-markdown'): void;
  (e: 'export-html'): void;
  (e: 'clear'): void;
}

const emit = defineEmits<Emits>();
const fileInput = ref<HTMLInputElement | null>(null);

// 触发文件选择
const triggerFileImport = () => {
  fileInput.value?.click();
};

// 处理文件导入
const handleFileImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        emit('import', content);
      };
      reader.onerror = () => {
        alert('文件读取失败');
      };
      reader.readAsText(file, 'UTF-8');
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败，请重试');
    }
  }

  // 重置 input，允许重复选择同一文件
  if (input) {
    input.value = '';
  }
};

// 导出 Markdown
const handleExportMarkdown = () => {
  emit('export-markdown');
};

// 导出 HTML
const handleExportHTML = () => {
  emit('export-html');
};

// 清空内容
const handleClear = () => {
  if (confirm('确定要清空所有内容吗？此操作不可恢复。')) {
    emit('clear');
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #24292e;
  color: white;
  border-bottom: 1px solid #1b1f23;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background-color: #2ea44f;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background-color: #2c974b;
}

.toolbar-btn:active {
  background-color: #298e46;
}

.toolbar-btn-danger {
  background-color: #d73a49;
}

.toolbar-btn-danger:hover {
  background-color: #cb2431;
}

.toolbar-btn-danger:active {
  background-color: #b5202c;
}

.hidden {
  display: none;
}
</style>
