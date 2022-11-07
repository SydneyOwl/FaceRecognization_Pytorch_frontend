<template>
  <el-tabs type="border-card" class="container">
    <el-tab-pane label="抓拍记录">
      <el-table :data="filterTableData" style="width: 100%">
        <el-table-column label="" prop="name" type="expand"
          ><template #default="props">
            <div style="display: flex; flex-wrap: wrap">
              <el-card
                :body-style="{ padding: '0px', width: '200px' }"
                v-for="i in 12"
                shadow="never"
              >
                <img
                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                  class="image"
                />

                <div style="padding: 14px">
                  <span>Character X</span>
                  <div class="bottom">
                    <time class="time">{{ '2022/10/10' }}</time>
                    <el-tag>emotion</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </template></el-table-column
        >
        <el-table-column label="时间" prop="date" />

        <el-table-column align="right">
          <template #header>
            <el-input
              v-model="search"
              size="small"
              placeholder="Type to search"
            />
          </template>
          <template #default="scope">
            <el-tag>Tag 1</el-tag>
            <el-tag class="ml-2" type="success">Tag 2</el-tag>
            <el-tag class="ml-2" type="info">Tag 3</el-tag>
            <el-tag class="ml-2" type="warning">Tag 4</el-tag>
            <el-tag class="ml-2" type="danger">Tag 5</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="上传记录">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item
          :title="item.time"
          :name="item.id"
          v-for="item in videoData"
          :key="item.id"
        >
          <div style="display: flex; alignitems: center; flexdirection: row">
            <el-image
              style="width: 100px; height: 100px"
              :src="item.thumb"
              :preview-src-list="[item.thumb]"
              :initial-index="1"
              fit="cover"
            />
            <section class="sec">
              <div>
                id: {{ item.id }}
                <br />
                <el-tag class="mx-1" effect="plain">{{
                  item.original_name
                }}</el-tag>
              </div>
              <div>
                <el-link :icon="Download"
                  ><a :href="`${url}/downloadVideo?videoKey=${item.id}`"
                    >下载识别视频</a
                  ></el-link
                >
              </div>
            </section>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { Download } from '@element-plus/icons-vue'
import {
  computed,
  ref,
  onBeforeMount,
  reactive,
  onMounted,
  watchEffect,
} from 'vue'
import { apiGetMyVideo } from '../apis/history'
import * as echarts from 'echarts'
interface User {
  date: string
  name: string
  address: string
}

const search = ref('')
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const videoData = reactive<any>([])
const activeName = ref('1')
const getHistory = () => {
  apiGetMyVideo().then((res) => {
    console.log(res)
    if (res.data.status == 200) {
      res.data.data.forEach((el: any) => {
        videoData.push(el)
      })
    }
  })
}
onBeforeMount(() => {
  getHistory()
})

// const analysis = reactive({
//   amaze: 0,
//   anger: 0,
//   disgust: 0,
//   fear: 0,
//   happy: 0,
//   neutral: 0,
//   sad: 0,
// })
// const pie = ref()
// let myChart: echarts.ECharts
// const options = reactive({
//   color: [
//     '#6366F1',
//     '#EF4444',
//     '#065F46',
//     '#1E3A8A',
//     '#10B981',
//     '#3B82F6',
//     '#F59E0B',
//   ],
//   tooltip: {
//     trigger: 'item',
//   },
//   legend: {
//     top: '5%',
//     left: 'center',
//   },
//   series: [
//     {
//       name: 'Access From',
//       type: 'pie',
//       radius: ['40%', '70%'],
//       avoidLabelOverlap: false,
//       itemStyle: {
//         borderRadius: 10,
//         borderColor: '#fff',
//         borderWidth: 1,
//       },
//       label: {
//         show: false,
//         position: 'center',
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: '20',
//           fontWeight: 'bold',
//         },
//       },
//       labelLine: {
//         show: false,
//       },
//       data: [
//         { value: analysis.amaze, name: '惊讶' },
//         { value: analysis.anger, name: '愤怒' },
//         { value: analysis.disgust, name: '恶心' },
//         { value: analysis.fear, name: '恐惧' },
//         { value: analysis.happy, name: '高兴' },
//         { value: analysis.neutral, name: '中性' },
//         { value: analysis.sad, name: '悲伤' },
//       ],
//     },
//   ],
// })
// onMounted(() => {
//   myChart = echarts.init(pie.value, '', {
//     useDirtyRect: true,
//   })
//   myChart.setOption(options)
//   watchEffect(() => {
//     options.series[0].data = [
//       { value: analysis.amaze, name: '惊讶' },
//       { value: analysis.anger, name: '愤怒' },
//       { value: analysis.disgust, name: '恶心' },
//       { value: analysis.fear, name: '恐惧' },
//       { value: analysis.happy, name: '高兴' },
//       { value: analysis.neutral, name: '中性' },
//       { value: analysis.sad, name: '悲伤' },
//     ]
//     myChart.setOption(options)
//   })
// })

const url = import.meta.env.VITE_BASE_URL
</script>
<style scoped>
.container {
  height: calc(100vh - 52px);
  overflow: auto;
}
.sec {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
}
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom > .button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 200px;
  display: block;
}
.demo-progress {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
a {
  text-decoration: none;
  color: #409eff;
}
</style>
