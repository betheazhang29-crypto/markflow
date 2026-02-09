import { ref } from 'vue';

const STORAGE_KEY = 'markflow_content';

/**
 * localStorage 存储服务 Composable
 */
export function useStorage() {
  const content = ref<string>('');

  /**
   * 从 localStorage 加载内容
   */
  const load = (): string => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || '';
    } catch (error) {
      console.error('加载内容失败:', error);
      return '';
    }
  };

  /**
   * 保存内容到 localStorage
   */
  const save = (text: string): void => {
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch (error) {
      console.error('保存内容失败:', error);
      // 可能是存储空间不足
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('存储空间不足，请导出文件后清空内容');
      }
    }
  };

  /**
   * 清空 localStorage 中的内容
   */
  const clear = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      content.value = '';
    } catch (error) {
      console.error('清空内容失败:', error);
    }
  };

  /**
   * 初始化时加载内容
   */
  const init = (): void => {
    content.value = load();
  };

  return {
    content,
    save,
    load,
    clear,
    init,
  };
}
