<template>
  <div class="login-container">
    <h1>情绪识别</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      size="large"
      label-width="120px"
      class="demo-ruleForm"
      style="width: 500px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >登陆</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useAccountStore } from '../stores/account'
import { useRoute, useRouter } from 'vue-router'
import { apiLogin, apiTestAuth } from '../apis/login'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  password: '',
  username: '',
})
const account = useAccountStore()
const router = useRouter()
const route = useRoute()

const submitForm = (formEl: FormInstance | undefined) => {
  if (ruleForm.username == 'admin' && ruleForm.password == 'admin') {
    apiLogin(ruleForm).then((res) => {
      console.log(res)
      if (res.data.status == 200) {
        localStorage.setItem('token', res.data.token)
        console.log(localStorage.getItem('token'))
        account.confirmIsLogin()
        apiTestAuth().then((res) => {
          console.log(res)
          router.push('/')
          console.log(route.path)
        })
      }
    })
  }
}

const resetForm = (formEl: FormInstance | undefined) => {}
</script>
<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img {
  position: absolute;
}
</style>
