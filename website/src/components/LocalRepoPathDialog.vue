<template>
  <div class="path-mask" @click.self="emit('close')">
    <div class="path-dialog">
      <div class="path-head">
        <span class="path-title">本地路径配置</span>
        <div class="path-head-actions">
          <button type="button" class="path-btn head-btn" @click="openPicker">选择目录</button>
          <button type="button" class="path-close" aria-label="关闭" @click="emit('close')">×</button>
        </div>
      </div>
      <div class="path-body">
        <label class="path-label">本地仓库路径</label>
        <div class="path-row">
          <input
            v-model.trim="draftPath"
            type="text"
            class="path-input"
            placeholder="例如：D:\repo\project"
          />
        </div>
        <div v-if="pickNotice" class="path-notice">{{ pickNotice }}</div>
        <input
          ref="dirInputRef"
          type="file"
          webkitdirectory
          directory
          multiple
          class="path-hidden-input"
          @change="onDirSelected"
        />
      </div>
      <div class="path-actions">
        <button type="button" class="path-btn ghost" @click="emit('close')">取消</button>
        <button type="button" class="path-btn" @click="onSave">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['close', 'save'])

const draftPath = ref(props.modelValue || '')
const dirInputRef = ref(null)
const pickNotice = ref('')

watch(
  () => props.modelValue,
  (v) => {
    draftPath.value = v || ''
  }
)

function openPicker() {
  pickNotice.value = ''
  const el = dirInputRef.value
  if (!el) return
  el.value = ''
  el.click()
}

function onDirSelected(e) {
  const input = e.target
  const files = input?.files
  if (!files?.length) return
  const first = files[0]
  const firstFilePath = typeof first?.path === 'string' ? first.path.trim() : ''
  if (firstFilePath) {
    const lastSlash = Math.max(firstFilePath.lastIndexOf('/'), firstFilePath.lastIndexOf('\\'))
    draftPath.value = lastSlash > 0 ? firstFilePath.slice(0, lastSlash) : firstFilePath
    pickNotice.value = ''
  } else {
    const rawPath = typeof input.value === 'string' ? input.value.trim() : ''
    const looksAbsolute = /^[a-zA-Z]:[\\/]/.test(rawPath) || /^\\\\/.test(rawPath) || rawPath.startsWith('/')
    if (rawPath && looksAbsolute && !/fakepath/i.test(rawPath)) {
      draftPath.value = rawPath
      pickNotice.value = ''
    } else {
      pickNotice.value = '当前环境无法读取目录绝对路径，请手动粘贴完整路径。'
    }
  }
  input.value = ''
}

function onSave() {
  emit('save', draftPath.value || '')
  emit('close')
}
</script>

<style scoped>
.path-mask {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.path-dialog {
  width: min(760px, calc(100vw - 32px));
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  padding: 16px;
}
.path-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.path-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.path-title {
  font-size: 16px;
  font-weight: 600;
  color: #202124;
}
.path-close {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #5f6368;
}
.path-body {
  margin-bottom: 14px;
}
.path-label {
  display: block;
  font-size: 13px;
  color: #5f6368;
  margin-bottom: 6px;
}
.path-row {
  display: flex;
  gap: 8px;
}
.path-input {
  flex: 1;
  height: 36px;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 14px;
}
.path-notice {
  margin-top: 8px;
  font-size: 12px;
  color: #d93025;
}
.path-hidden-input {
  display: none;
}
.path-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.path-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid #1a73e8;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
}
.head-btn {
  height: 32px;
}
.path-btn.ghost {
  border-color: #dadce0;
  background: #fff;
  color: #202124;
}
</style>
