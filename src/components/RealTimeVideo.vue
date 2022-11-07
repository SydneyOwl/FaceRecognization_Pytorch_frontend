<template>
  <section class="real-section">
    <div class="data-displayer">
      <div class="demo-progress" ref="pie"></div>
      <ul class="infinite-list" style="overflow: auto">
        <li
          v-for="item in faces"
          :key="item.faceThumb"
          class="infinite-list-item"
        >
          <div>
            <el-avatar
              shape="square"
              :size="100"
              fit="contain"
              :src="item.faceThumb"
            />
          </div>
          <div>{{ '估计年龄：' + item.age }}</div>
          <div>{{ '识别性别：' + (item.gender == 0 ? '男' : '女') }}</div>
        </li>
      </ul>
    </div>
    <div class="container">
      <video
        ref="videoRef"
        autoplay
        controls
        preload="true"
        class="preview"
        v-show="isOnStream"
      ></video>
      <el-skeleton
        :style="{ width: '100%' }"
        :isloading="isloading"
        v-if="!isOnStream"
        ><template #template
          ><el-skeleton-item
            variant="image"
            :style="{
              width: '100%',
              height: 'calc(100vh - 360px)',
            }" /></template
      ></el-skeleton>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  TimeHTMLAttributes,
  watch,
  watchEffect,
} from 'vue'
import { io } from 'socket.io-client'
import flvjs from 'flv.js'
import * as echarts from 'echarts'
import { apiGetHistoryFace } from '../apis/history'
const videoRef = ref()
const onlineVideo = ref<string>('')
const isOnStream = ref(false)
const isloading = ref<boolean>(false)
const ratioW = ref('100%')
const ratioH = ref('calc(100vh - 360px)')
const getAllFaces = async () => {
  const res = await apiGetHistoryFace()
  console.log(res)
  faces.value = res.data.face
  localStorage.setItem('faces', JSON.stringify(faces.value))
}
const faces = ref<any>(
  // JSON.parse(localStorage.getItem('face') ?? '[]') ?? []
  []
)
const timer = setInterval(() => {
  getAllFaces()
  console.log(faces.value)
}, 2500)
onMounted(() => {
  if (flvjs.isSupported()) {
    isOnStream.value = true
    let flvPlayer = flvjs.createPlayer(
      {
        type: 'flv',
        isLive: true,
        url:
          import.meta.env.VITE_LIVESTREAM_URL +
          '/flv?port=1935&app=live&stream=ferStream',
      },
      {
        enableStashBuffer: false,
      }
    )
    flvPlayer.attachMediaElement(videoRef.value)
    flvPlayer.load()
    flvPlayer.play()
  }

  const socket = io('wss://YOUR_SITE:60089/wss/realtimeCam', {
    reconnection: true,
  })

  socket.on('connect', () => {
    console.log(socket.connected)
    socket.send('林时晟大佬！！！')
    isloading.value = true
  })

  socket.on('data', (arg: any) => {
    console.log(arg)
    ratioW.value = 'auto'
    ratioH.value = 'calc(100vh - 360px)'

    if (arg.status == 200) {
      isloading.value = false
      isOnStream.value = true
    }
    analysis.amaze = arg.emoInfoTotal.amaze
    analysis.anger = arg.emoInfoTotal.anger
    analysis.disgust = arg.emoInfoTotal.disgust
    analysis.fear = arg.emoInfoTotal.fear
    analysis.happy = arg.emoInfoTotal.happy
    analysis.neutral = arg.emoInfoTotal.neutral
    analysis.sad = arg.emoInfoTotal.sad
  })
  onUnmounted(() => {
    console.log('unmount!')
    socket.disconnect()
    clearInterval(timer)
  })
  socket.on('disconnect', () => {
    console.log(socket.connected)
  })
})
const amaze = (percentage: number) => '惊讶'
const anger = (percentage: number) => '愤怒'
const disgust = (percentage: number) => '恶心'
const fear = (percentage: number) => '恐惧'
const happy = (percentage: number) => '高兴'
const neutral = (percentage: number) => '中性'
const sad = (percentage: number) => '悲伤'
const analysis = reactive({
  amaze: 0,
  anger: 0,
  disgust: 0,
  fear: 0,
  happy: 0,
  neutral: 0,
  sad: 0,
})

const pie = ref()
let myChart: echarts.ECharts
const options = reactive({
  color: [
    '#6366F1',
    '#EF4444',
    '#065F46',
    '#1E3A8A',
    '#10B981',
    '#3B82F6',
    '#F59E0B',
  ],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '5%',
    left: 'center',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: analysis.amaze, name: '惊讶' },
        { value: analysis.anger, name: '愤怒' },
        { value: analysis.disgust, name: '恶心' },
        { value: analysis.fear, name: '恐惧' },
        { value: analysis.happy, name: '高兴' },
        { value: analysis.neutral, name: '中性' },
        { value: analysis.sad, name: '悲伤' },
      ],
    },
  ],
})
onMounted(() => {
  myChart = echarts.init(pie.value, '', {
    useDirtyRect: true,
  })
  myChart.setOption(options)
  watchEffect(() => {
    options.series[0].data = [
      { value: analysis.amaze, name: '惊讶' },
      { value: analysis.anger, name: '愤怒' },
      { value: analysis.disgust, name: '恶心' },
      { value: analysis.fear, name: '恐惧' },
      { value: analysis.happy, name: '高兴' },
      { value: analysis.neutral, name: '中性' },
      { value: analysis.sad, name: '悲伤' },
    ]
    myChart.setOption(options)
  })
})
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.data-displayer {
  display: flex;
  justify-content: space-between;
}
.infinite-list {
  width: 800px;
  height: 300px;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 300px;
  width: 400px;
  margin: 0 20px;
  /* background: var(--el-color-primary-light-9); */
  /* margin: 10px; */
  /* color: var(--el-color-primary); */
}
.preview {
  /* width: 100%;
  height: calc(100vh - 50px - 360px); */
  width: 100%;
  /* height: v-bind('wh.h'); */
  border-color: var(--el-fill-color-light);
  width: v-bind(ratioW);
  height: v-bind(ratioH);
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

.demo-progress {
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.demo-progress .el-progress--line {
  width: 350px;
  margin: 10px 0;
}
</style>
