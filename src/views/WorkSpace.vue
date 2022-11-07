<template>
  <div class="layout-view">
    <el-menu
      :default-active="curIndex"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      :router="true"
    >
      <el-menu-item index="/workspace/upload" @click="handleClickItem">
        <el-icon><upload /></el-icon>
        <template #title>视频上传识别</template>
      </el-menu-item>
      <el-menu-item index="/workspace/rtcam" @click="handleClickItem">
        <el-icon><video-camera /></el-icon>
        <template #title>实时识别</template>
      </el-menu-item>
      <el-menu-item index="/workspace/history" @click="handleClickItem">
        <el-icon><document /></el-icon>
        <template #title>历史记录</template>
      </el-menu-item>
      <el-menu-item index="/workspace/settings" @click="handleClickItem">
        <el-icon><operation /></el-icon>
        <template #title>设置</template>
      </el-menu-item>
    </el-menu>
    <div class="layout-main">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        :style="{ height: '50px', lineHeight: '50px' }"
      >
        <div class="flex-grow"></div>
        <el-sub-menu index="">
        <template #title>Admin</template>
        <el-menu-item @click="logout">退出</el-menu-item>
      </el-sub-menu>
      </el-menu>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import {
  Document,
  Setting,//离谱！！！只要用这个图标同时设置disabled就会让chrome卡崩！！！远离它！！！
  VideoCamera,
  Upload,
  Operation
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '../stores/account';
const router = useRouter()
onBeforeMount(() => {
  router.replace({ path: localStorage.getItem('curIndex') ?? '/workspace/upload' })
})
const curIndex = ref(localStorage.getItem('curIndex') ?? '/workspace/upload')
const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  localStorage.setItem('curIndex', key)
}

const handleClickItem = (item: any) => {
  localStorage.setItem('curIndex', item.index)
}
const account = useAccountStore()
const logout = () => {
  account.isLogin = false
  localStorage.removeItem('token')
  router.replace({
    path: '/login'
  })
}
</script>

<style scoped>
.layout-view {
  height: 100vh;
  width: 100%;
  display: flex;
}
.layout-main {
  height: 100vh;
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu {
  height: 100vh;
}
.flex-grow {
  flex-grow: 1;
}
</style>
