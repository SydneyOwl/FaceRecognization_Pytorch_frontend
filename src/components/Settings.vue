<template>
  <div class="settings-container">
    <el-form :model="form" label-width="120px" label-position="left">
      <el-form-item label="视频比例">
        <el-select v-model="form.videoRatio" placeholder="选择视频比例">
          <el-option label="4 : 3" value="4/3" />
          <el-option label="16 : 9" value="16/9" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否抓拍人脸">
        <el-switch
          v-model="form.captureFace"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave" :disabled="!canSave">保存设置</el-button>
        <el-button @click="onCancel" v-if="canSave">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { apiSettings } from '../apis/settings'
import { useSettingStore } from '../stores/settings'
const settings = useSettingStore()
const form = reactive({
  videoRatio: settings.videoRatio,
  captureFace: settings.captureFace,
})
const canSave = ref(false)
const onSave = () => {
  canSave.value = false
  apiSettings(form).then((res) => {
    console.log(res)
    if(res.data.status == 200) {
      canSave.value = false
    }
  })
}
const onCancel = () => {
  form.videoRatio = settings.videoRatio
  form.captureFace = settings.captureFace
  canSave.value = false
}
watch(form, () => {
  if(form.captureFace!=settings.captureFace || form.videoRatio!=settings.videoRatio){
    canSave.value = true
  }
})
</script>

<style scoped>
.settings-container {
  padding: 20px;
}
</style>
