<template>
  <div class="editor-container">
    <textarea
      v-model="localContent"
      @input="handleInput"
      class="editor-textarea"
      placeholder="在此输入 Markdown 内容..."
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localContent = ref(props.modelValue);

// 监听外部变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== localContent.value) {
    localContent.value = newValue;
  }
});

// 处理输入
const handleInput = () => {
  emit('update:modelValue', localContent.value);
};
</script>

<style scoped>
.editor-container {
  height: 100%;
  width: 100%;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  border: none;
  outline: none;
  resize: none;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.6;
  background-color: #ffffff;
  color: #24292e;
}

.editor-textarea::placeholder {
  color: #6a737d;
}
</style>
