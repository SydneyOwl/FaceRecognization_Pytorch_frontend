<template>
  <section class="upload-section">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      :headers="{'auth-token': getToken()}"
      action="https://YOUR_SITE:60089/sendVideo"
      ref="uploadRef"
      :limit="1"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :auto-upload="false"
    >
      <template #trigger>
        <el-button>选择视频</el-button>
      </template>
      |
      <el-button @click="submitUpload" :loading="isloading">开始上传</el-button>
      <el-button>
        <a :href="download" class="download-btn">下载识别视频</a></el-button
      >
      <el-progress :percentage="progress"> </el-progress>
    </el-upload>

    <img :src="onlineVideo" alt="" class="preview" v-if="isOnStream" />
    <el-skeleton :style="{ width: '100%' }" :loading="true" v-if="!isOnStream"
      ><template #template
        ><el-skeleton-item
          variant="image"
          :style="{ width: '100%', height: 'calc(100vh - 135px)' }" /></template
    ></el-skeleton>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadProps, UploadUserFile, UploadInstance } from 'element-plus'
import { io } from 'socket.io-client'

const getToken = () => {
  return localStorage.getItem('token')
}
const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  // console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  // console.log(file)
}

const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  uploadRef.value!.submit()
}

const onlineVideo = ref('')
const progress = ref(0)
const download = ref('javascript:void(0)')
const isloading = ref(false)
const isOnStream = ref(false)
const ratioW = ref('100%')
const ratioH = ref('calc(100vh - 35px)')
const handleSuccess: UploadProps['onSuccess'] = (res) => {
  console.log(res)
  isloading.value = true
  uploadRef.value!.clearFiles()
  localStorage.setItem('vpr_key', res.key)
  download.value = `${import.meta.env.VITE_BASE_URL}/downloadVideo?videoKey=${
    res.key
  }`
  const socket = io('wss://YOUR_SITE:60089/wss/rtVideoProcess', {
    reconnection: true,
  })
  socket.on('connect', () => {
    console.log(socket.connected)
    isloading.value = true
    socket.send(res.key)
    console.log(res.key)
  })

  socket.on('data', (arg: any) => {
    console.log(arg)
    if (arg.width > arg.height) {
      ratioH.value = 'auto'
      ratioW.value = '100%'
    } else {
      ratioW.value = 'auto'
      ratioH.value = 'calc(100vh - 135px)'
    }
    isloading.value = false
    isOnStream.value = true
    const blob = new Blob([arg.img], { type: 'image/jpeg' })
    onlineVideo.value = URL.createObjectURL(blob)
    if (arg.status == 201) {
      progress.value = 0.0
      isOnStream.value = false
      socket.disconnect()
      return
    }
    progress.value = Number(arg.processPercent.toFixed(2))
  })

  socket.on('disconnect', () => {
    isOnStream.value = false
    console.log(socket.connected)
  })
}

</script>

<style scoped>
.upload-section {
  padding: 10px;
}
.front-end-video {
  width: 100%;
}
.preview {
  width: v-bind(ratioW);
  height: v-bind(ratioH);
  margin-left: 50%;
  transform: translate(-50%);
}
.download-btn {
  text-decoration: none;
  color: #cfd3dc;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 5em;
}
</style>
