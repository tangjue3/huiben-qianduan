<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Radar, Line } from 'vue-chartjs'
import {
  Leaf,
  CloudSun,
  Droplets,
  Thermometer,
  Activity,
  AlertTriangle,
  Home,
  Wifi,
  ChevronDown,
  Box,
  Layers
} from 'lucide-vue-next'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
)

const radarData = [
  { subject: '光照(lux)', A: 15800, fullMark: 20000, unit: ' lux' },
  { subject: 'pH值', A: 6.38, fullMark: 14, unit: '' },
  { subject: '土壤湿度', A: 32.6, fullMark: 100, unit: '%' },
  { subject: 'CO₂浓度', A: 613, fullMark: 1000, unit: ' ppm' },
  { subject: '空气湿度', A: 68.2, fullMark: 100, unit: '%' },
  { subject: '空气温度', A: 26.4, fullMark: 50, unit: '°C' },
  { subject: '钾(K)', A: 28.6, fullMark: 100, unit: '%' },
  { subject: '磷(P)', A: 192, fullMark: 300, unit: ' mg/kg' },
]

const areaChartData = [
  { time: '00:00', value: 3 },
  { time: '04:00', value: 4 },
  { time: '08:00', value: 6 },
  { time: '11:30', value: 8.76 },
  { time: '12:00', value: 9 },
  { time: '16:00', value: 7 },
  { time: '20:00', value: 4 },
  { time: '24:00', value: 3 },
]

const decisionLog = [
  { time: '14:35:30', title: '智能水肥机已开启', desc: '调整灌溉量至 28%，施用平衡肥', status: 'running', icon: Droplets },
  { time: '14:35:15', title: '无人机已派出巡检', desc: '执行多光谱巡检任务，区域：A3区块', status: 'running', icon: Layers },
  { time: '14:34:58', title: '通风系统已调整', desc: '湿度偏高，已将风机转速调至 65%', status: 'completed', icon: Activity },
  { time: '14:34:42', title: '检测到潜在虫害风险', desc: '钻心虫声学信号增强，建议加强监测', status: 'alert', icon: AlertTriangle },
  { time: '14:34:20', title: 'LED补光灯已开启', desc: '光照不足，已开启补光灯至 60%', status: 'completed', icon: CloudSun },
]

const radarChartData = computed(() => ({
  labels: radarData.map(d => d.subject),
  datasets: [
    {
      label: '环境数据',
      data: radarData.map(d => (d.A / d.fullMark) * 100),
      backgroundColor: 'rgba(0, 255, 255, 0.25)',
      borderColor: '#00ffff',
      borderWidth: 2.5,
      pointBackgroundColor: '#00ffff',
      pointBorderColor: '#01060e',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
    }
  ]
}))

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { 
        color: 'rgba(0, 255, 255, 0.15)',
        lineWidth: 1
      },
      grid: { 
        color: 'rgba(0, 255, 255, 0.1)',
        circular: true
      },
      pointLabels: { 
        color: '#a0aec0', 
        font: { 
          size: 11,
          weight: '500'
        },
        padding: 12
      },
      ticks: { 
        display: false 
      },
      min: 0,
      max: 100,
      beginAtZero: true
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(2, 17, 36, 0.95)',
      borderColor: '#00ffff',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: '#00ffff',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          const idx = context.dataIndex
          const item = radarData[idx]
          return `${item.A}${item.unit || ''} (${Math.round((item.A / item.fullMark) * 100)}%)`
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}

const lineChartData = computed(() => ({
  labels: areaChartData.map(d => d.time),
  datasets: [
    {
      label: '蒸腾速率',
      data: areaChartData.map(d => d.value),
      fill: true,
      backgroundColor: 'rgba(0, 168, 255, 0.3)',
      borderColor: '#00ffff',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: '#00ffff',
      pointRadius: 3
    }
  ]
}))

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#64748b', font: { size: 10 } },
      border: { display: false }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#64748b', font: { size: 10 } },
      border: { display: false }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(2, 17, 36, 0.9)',
      borderColor: '#00ffff',
      borderWidth: 1,
      itemStyle: { color: '#00ffff' },
      labelStyle: { color: '#fff' }
    }
  }
}

const time = ref(new Date())
const canvasRef = ref(null)
const ndviCanvasRef = ref(null)
let timer = null
let animationId = null

const timeString = computed(() => {
  return time.value.toLocaleTimeString('zh-CN', { hour12: false })
})

const dateString = '2025-05-22'
const dayString = '星期四'

onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date()
  }, 1000)

  nextTick(() => {
    drawSpectrogram()
    drawNDVI()
    initOpenFieldChart()
    updateOpenFieldTime()
    openFieldTimeInterval = setInterval(updateOpenFieldTime, 1000)
  })

  window.addEventListener('resize', handleOpenFieldResize)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (animationId) cancelAnimationFrame(animationId)
  if (openFieldTimeInterval) clearInterval(openFieldTimeInterval)
  if (openFieldChartInstance) openFieldChartInstance.dispose()
  window.removeEventListener('resize', handleOpenFieldResize)
})

const drawSpectrogram = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const draw = () => {
    const w = canvas.width
    const h = canvas.height

    ctx.fillStyle = '#050a15'
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < h; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(w, i)
      ctx.stroke()
    }

    const barWidth = 2
    const gap = 1

    for (let x = 0; x < w; x += (barWidth + gap)) {
      const intensity = Math.sin(x / w * Math.PI) + Math.random() * 0.5
      const height = h * 0.8 * intensity * (Math.random() * 0.5 + 0.5)
      const y = h - height

      const gradient = ctx.createLinearGradient(0, h, 0, h - height)
      gradient.addColorStop(0, '#ffff00')
      gradient.addColorStop(0.3, '#ff6600')
      gradient.addColorStop(0.7, '#ff0000')
      gradient.addColorStop(1, 'rgba(255,0,0,0)')

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, height)

      if (Math.random() > 0.8) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)'
        ctx.fillRect(x, Math.random() * h, barWidth, 2)
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

const drawNDVI = () => {
  const canvas = ndviCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = '#0a5c0a'
  ctx.fillRect(0, 0, w, h)

  const drawBlob = (color, count, minR, maxR) => {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = minR + Math.random() * (maxR - minR)

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, color)
      grad.addColorStop(1, 'transparent')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  drawBlob('rgba(0, 220, 0, 0.8)', 30, 10, 25)
  drawBlob('rgba(200, 255, 0, 0.8)', 20, 8, 20)
  drawBlob('rgba(255, 150, 0, 0.85)', 15, 8, 18)
  drawBlob('rgba(255, 0, 0, 0.9)', 10, 5, 15)
}

const getStatusClass = (status) => {
  if (status === 'running') return 'bg-[#00ffff]/20 text-[#00ffff] border-[#00ffff]/50'
  if (status === 'alert') return 'bg-red-500/20 text-red-500 border-red-500/50'
  return 'bg-green-500/20 text-green-500 border-green-500/50'
}

const getStatusText = (status) => {
  if (status === 'running') return '执行中'
  if (status === 'alert') return '告警'
  return '已完成'
}

const statCards = [
  { icon: Home, label: '大棚总数', value: '12', unit: '个' },
  { icon: Box, label: '种植面积', value: '85.6', unit: '亩' },
  { icon: Wifi, label: '设备在线率', value: '98.7', unit: '%' },
  { icon: AlertTriangle, label: '今日告警数', value: '3', unit: '次', isWarning: true },
  { icon: Activity, label: '今日干预次数', value: '18', unit: '次' },
  { icon: Activity, label: '累计增产预估', value: '+12.6', unit: '%', trend: true },
  { icon: Droplets, label: '节水节肥率', value: '23.4', unit: '%', trend: true },
]

const envMonitors = [
  { icon: Thermometer, label: '空气温度', val: '26.4', unit: '°C' },
  { icon: Droplets, label: '空气湿度', val: '68.2', unit: '%' },
  { icon: CloudSun, label: 'CO₂浓度', val: '613', unit: 'ppm' },
  { icon: Layers, label: '土壤湿度', val: '32.6', unit: '%' },
]

const currentPage = ref('greenhouse')

const greenhouseStats = [
  { icon: Home, label: '大棚总数', value: '12', unit: '个' },
  { icon: Box, label: '种植面积', value: '85.6', unit: '亩' },
  { icon: Wifi, label: '设备在线率', value: '98.7', unit: '%' },
  { icon: AlertTriangle, label: '今日告警数', value: '3', unit: '次', isWarning: true },
  { icon: Activity, label: '今日干预次数', value: '18', unit: '次' },
  { icon: Activity, label: '累计增产预估', value: '+12.6', unit: '%', trend: true },
  { icon: Droplets, label: '节水节肥率', value: '23.4', unit: '%', trend: true },
]

const openFieldStats = [
  { icon: Home, label: '田块总数', value: '24', unit: '个' },
  { icon: Box, label: '种植面积', value: '156.8', unit: '亩' },
  { icon: Wifi, label: '设备在线率', value: '95.2', unit: '%' },
  { icon: AlertTriangle, label: '今日告警数', value: '5', unit: '次', isWarning: true },
  { icon: Activity, label: '今日干预次数', value: '12', unit: '次' },
  { icon: Activity, label: '累计增产预估', value: '+8.3', unit: '%', trend: true },
  { icon: Droplets, label: '节水节肥率', value: '18.7', unit: '%', trend: true },
]

const openFieldEnvMonitors = [
  { icon: Thermometer, label: '空气温度', val: '28.6', unit: '°C' },
  { icon: Droplets, label: '空气湿度', val: '72.5', unit: '%' },
  { icon: CloudSun, label: 'CO₂浓度', val: '420', unit: 'ppm' },
  { icon: Layers, label: '土壤湿度', val: '45.2', unit: '%' },
]

const moistureChartRef = ref(null)
const currentOpenFieldTime = ref('')
let openFieldChartInstance = null
let openFieldTimeInterval = null

const updateOpenFieldTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentOpenFieldTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const initOpenFieldChart = () => {
  if (!moistureChartRef.value) return

  openFieldChartInstance = echarts.init(moistureChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(3, 14, 22, 0.9)',
      borderColor: '#00ffcc',
      textStyle: { color: '#fff', fontSize: 12 },
      axisPointer: { type: 'line', lineStyle: { color: '#00ffcc', type: 'dashed' } }
    },
    grid: {
      top: '20%',
      left: '0%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: { lineStyle: { color: '#133c46' } },
      axisLabel: { color: '#7ab3c4', fontSize: 10, fontFamily: 'Oswald' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: { show: false },
      axisLabel: { color: '#7ab3c4', fontSize: 10, fontFamily: 'Oswald' },
      splitLine: { lineStyle: { color: '#133c46', type: 'dashed' } }
    },
    series: [
      {
        name: '10cm层',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        itemStyle: { color: '#00aaff' },
        lineStyle: { width: 2, color: '#00aaff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 170, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 170, 255, 0)' }
          ])
        },
        data: [50, 55, 62, 58, 45, 32.6, 40],
        markPoint: {
          data: [
            { type: 'min', name: 'Min', itemStyle: { color: '#00aaff' }, label: { formatter: '{c}%', fontSize: 10, offset: [0, -15], color: '#fff', backgroundColor: 'rgba(0,170,255,0.5)', padding: [2,4], borderRadius: 2 } }
          ],
          symbol: 'circle',
          symbolSize: 8
        }
      }
    ]
  }

  openFieldChartInstance.setOption(option)
}

const handleOpenFieldResize = () => {
  if (openFieldChartInstance) {
    openFieldChartInstance.resize()
  }
}
</script>

<template>
  <div class="min-h-screen text-slate-200 font-sans p-4 overflow-hidden relative selection:bg-cyan-900 flex flex-col">
    <div class="absolute inset-0 bg-[url('/hui-background1.jpg')] bg-cover bg-center brightness-110"></div>
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ffff] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

    <header class="flex justify-between items-center mb-4 relative z-10 flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="text-[#00ffcc] p-1 bg-[#00ffcc]/10 rounded-lg border border-[#00ffcc]/30">
          <Leaf :size="32" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#00ffff] tracking-widest">
            慧种仁心
          </h1>
          <div class="text-xs text-[#00a8ff] tracking-[0.2em] mt-1 uppercase">AI 智能农业决策平台</div>
        </div>
      </div>

      <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-[#00a8ff] tracking-widest" style="text-shadow: 0 0 20px rgba(0, 255, 255, 0.4)">
          慧种仁心AI智能农业决策平台
        </h2>
        <div class="w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent mt-2 relative">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-[#00ffff] shadow-[0_0_10px_#00ffff]"></div>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <CloudSun :size="24" class="text-gray-300" />
          <div>
            <div class="text-sm font-bold">23°C</div>
            <div class="text-xs text-gray-400">多云</div>
          </div>
        </div>
        <div class="h-8 w-px bg-slate-700"></div>
        <div class="text-right">
          <div class="text-sm">{{ dateString }}</div>
          <div class="text-xs text-gray-400">{{ dayString }}</div>
        </div>
        <div class="text-3xl font-mono text-[#00ffff] font-light shadow-[#00ffff]">
          {{ timeString }}
        </div>
        <div class="flex items-center gap-2 bg-[#00ff00]/10 px-3 py-1 rounded-full border border-[#00ff00]/30">
          <div class="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_8px_#00ff00] animate-pulse"></div>
          <span class="text-xs text-[#00ff00]">系统运行正常</span>
        </div>
      </div>
    </header>

    <nav class="flex justify-center mb-4 relative z-10 flex-shrink-0">
      <div class="bg-[#021124]/80 backdrop-blur-md border border-[#00ffff]/30 rounded-xl p-1.5 flex gap-2">
        <button
          @click="currentPage = 'greenhouse'"
          :class="[
            'px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-300',
            currentPage === 'greenhouse'
              ? 'bg-gradient-to-r from-[#00ffff] to-[#00a8ff] text-[#021124] shadow-[0_0_20px_rgba(0,255,255,0.4)]'
              : 'text-[#00ffff] hover:bg-[#00ffff]/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]'
          ]"
        >
          有棚区
        </button>
        <button
          @click="currentPage = 'openfield'"
          :class="[
            'px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-300',
            currentPage === 'openfield'
              ? 'bg-gradient-to-r from-[#00ffff] to-[#00a8ff] text-[#021124] shadow-[0_0_20px_rgba(0,255,255,0.4)]'
              : 'text-[#00ffff] hover:bg-[#00ffff]/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]'
          ]"
        >
          无棚区
        </button>
      </div>
    </nav>

    <main v-if="currentPage === 'greenhouse'" class="grid grid-cols-[3fr_5fr_3fr] gap-4 relative z-10 flex-1 overflow-hidden">
      <div class="flex flex-col gap-4 relative z-[20]">
        <div class="relative rounded-xl p-4 flex flex-col backdrop-blur-md overflow-hidden" style="background-color: transparent; border-width: 1px; border-style: solid; border-color: #22c55e; left: 40px; z-index: 20; width: 400px;">
          <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffff]"></div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-[#00ffff] font-bold italic text-lg">//</span>
              <h2 class="text-lg font-bold text-white tracking-wide">天 / 地环境监控</h2>
            </div>
            <span class="text-xs text-gray-400">更新时间: 14:35:30</span>
          </div>

          <div class="h-[240px] w-full">
            <Radar :data="radarChartData" :options="radarOptions" />
          </div>

          <div class="grid grid-cols-4 gap-3 mt-3">
            <div v-for="(item, idx) in envMonitors" :key="idx" class="bg-gradient-to-br from-[#002b4d]/60 to-[#001a2e]/80 p-3 rounded-lg border border-[#00ffff]/20 flex flex-col items-center justify-center hover:border-[#00ffff]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div class="flex items-center gap-1.5 text-[#00ffff] text-xs mb-1.5">
                <component :is="item.icon" :size="16" />
                <span class="font-medium">{{ item.label }}</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-bold text-white">{{ item.val }}</span>
                <span class="text-xs text-gray-400">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="relative rounded-xl p-4 flex flex-col backdrop-blur-md overflow-hidden flex-1" style="background-color: transparent; border-width: 1px; border-style: solid; border-color: #22c35d; left: 40px; box-sizing: border-box; width: 400px;">
          <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffff]"></div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-[#00ffff] font-bold italic text-lg">//</span>
              <h2 class="text-lg font-bold text-white tracking-wide">植物生理与多光谱数据</h2>
            </div>
            <span class="text-xs text-gray-400">更新时间: 14:35:20</span>
          </div>

          <div class="flex flex-col h-full">
            <div class="mb-4">
              <div class="text-xs text-gray-400 mb-2">NDVI 热力图</div>
              <div class="flex gap-3 items-center">
                <div class="flex-1 relative h-20 rounded border border-[#00ffff]/30 overflow-hidden">
                  <canvas ref="ndviCanvasRef" class="w-full h-full" width="300" height="80"></canvas>
                </div>

                <div class="w-[120px] flex items-center gap-3 shrink-0">
                  <div class="flex items-center gap-1">
                    <div class="w-1.5 h-16 bg-gradient-to-b from-red-500 via-yellow-400 to-green-600 rounded"></div>
                    <div class="flex flex-col justify-between h-16 text-[10px] text-gray-400 py-0.5">
                      <span>1.0</span>
                      <span>0.5</span>
                      <span>0</span>
                    </div>
                  </div>
                  <div class="flex flex-col justify-center">
                    <span class="text-[10px] text-gray-400 mb-1">当前NDVI均值</span>
                    <div class="text-2xl font-bold text-white flex items-baseline gap-1">
                      0.78 <span class="text-[#00ffcc] text-sm">↑</span>
                    </div>
                    <span class="text-[10px] text-gray-400">较昨日 <span class="text-[#00ffcc]">+0.05</span></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-1 flex flex-col min-h-[100px]">
              <div class="text-xs text-gray-400 mb-1">蒸腾速率 (mmol/m²/s)</div>
              <div class="flex-1 w-full relative">
                <Line :data="lineChartData" :options="lineChartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="relative w-full h-full rounded-xl overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute top-[15%] left-[25%] label-container">
            <svg class="absolute w-16 h-8" style="transform: rotate(180deg); top: -40px; left: -20px;" viewBox="0 0 64 32">
              <line x1="0" y1="16" x2="60" y2="16" stroke="#00ffff" stroke-width="1" stroke-dasharray="2,2" />
            </svg>
            <div class="bg-[rgba(0,255,255,0.1)] backdrop-blur-sm border border-[#00ffff]/50 px-3 py-1.5 rounded text-[#00ffff] text-xs font-medium animate-pulse absolute" style="left: 45px; top: -40px; writing-mode: horizontal-tb; white-space: nowrap;">
              多光谱无人机
            </div>
          </div>

          <div class="absolute bottom-[20%] left-[20%] label-container">
            <svg class="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-8" viewBox="0 0 48 32">
              <line x1="0" y1="16" x2="40" y2="16" stroke="#00ffff" stroke-width="1" stroke-dasharray="2,2" />
            </svg>
            <div class="bg-[rgba(0,255,255,0.1)] backdrop-blur-sm border border-[#00ffff]/50 px-3 py-1.5 rounded text-[#00ffff] text-xs font-medium animate-pulse" style="animation-delay: 0.2s;">
              巡检机器人
            </div>
          </div>

          <div class="absolute top-[35%] left-[52%] label-container">
            <svg class="absolute left-1/2 -translate-x-1/2 w-8 h-12" style="top: -120px;" viewBox="0 0 32 48">
              <line x1="16" y1="0" x2="16" y2="40" stroke="#00ffff" stroke-width="1" stroke-dasharray="2,2" />
            </svg>
            <div class="bg-[rgba(0,255,255,0.1)] backdrop-blur-sm border border-[#00ffff]/50 px-3 py-1.5 rounded text-[#00ffff] text-xs font-medium animate-pulse absolute" style="animation-delay: 0.4s; writing-mode: horizontal-tb; white-space: nowrap; left: -37px; top: -150px;">
              通风系统
            </div>
          </div>

          <div class="absolute top-[38%] left-[65%] label-container">
            <svg class="absolute left-1/2 -translate-x-1/2 w-8 h-12" style="top: 23px;" viewBox="0 0 32 48">
              <line x1="16" y1="0" x2="16" y2="40" stroke="#00ffff" stroke-width="1" stroke-dasharray="2,2" />
            </svg>
            <div class="bg-[rgba(0,255,255,0.1)] backdrop-blur-sm border border-[#00ffff]/50 px-3 py-1.5 rounded text-[#00ffff] text-xs font-medium animate-pulse" style="animation-delay: 0.6s;">
              LED补光灯
            </div>
          </div>

          <div class="absolute top-[50%] right-[15%] label-container">
            <svg class="absolute top-1/2 -translate-y-1/2 w-16 h-8" style="left: 70px;" viewBox="0 0 64 32">
              <line x1="64" y1="16" x2="8" y2="16" stroke="#00ffff" stroke-width="1" stroke-dasharray="2,2" />
            </svg>
            <div class="bg-[rgba(0,255,255,0.1)] backdrop-blur-sm border border-[#00ffff]/50 px-3 py-1.5 rounded text-[#00ffff] text-xs font-medium animate-pulse" style="animation-delay: 0.8s;">
              水肥控制机
            </div>
          </div>

          <div class="absolute bottom-[30%] left-[58%] label-container">
            <svg class="absolute left-1/2 -translate-x-1/2 -top-6 w-8 h-12" viewBox="0 0 32 48">
              <line x1="16" y1="48" x2="16" y2="8" stroke="#00ffff" stroke-width="1" stroke-dasharray="2,2" />
            </svg>
            <div class="bg-[rgba(0,255,255,0.1)] backdrop-blur-sm border border-[#00ffff]/50 px-3 py-1.5 rounded text-[#00ffff] text-xs font-medium animate-pulse" style="animation-delay: 1s;">
              环境传感器
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 overflow-hidden">
        <div class="relative rounded-xl p-4 flex flex-col backdrop-blur-md overflow-hidden" style="background-color: transparent; border-width: 1px; border-style: solid; border-color: #22c55e; left: 60px; width: 400px;">
          <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffff]"></div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-[#00ffff] font-bold italic text-lg">//</span>
              <h2 class="text-lg font-bold text-white tracking-wide">视听融合病虫害预警</h2>
            </div>
            <span class="text-xs text-gray-400">更新时间: 14:35:42</span>
          </div>

          <div class="bg-red-500/20 border border-red-500 text-red-500 text-center py-1.5 rounded text-sm font-bold flex items-center justify-center gap-2 mb-3 shadow-[0_0_10px_rgba(255,0,0,0.3)] animate-pulse">
            <AlertTriangle :size="18" /> 检测到异常声学信号！
          </div>

          <div class="flex gap-3 h-[180px]">
            <div class="flex-1 relative">
              <div class="absolute top-0 left-0 text-[10px] text-gray-400">频率(Hz)</div>
              <div class="absolute bottom-[-15px] right-0 text-[10px] text-gray-400">时间(秒)</div>
              <div class="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[10px] text-gray-400 pb-4 pt-4 z-10 bg-[#021124]/50">
                <span>20k</span><span>10k</span><span>5k</span><span>2k</span><span>1k</span><span>500</span>
              </div>
              <div class="absolute bottom-0 left-6 right-0 flex justify-between text-[10px] text-gray-400 px-2">
                <span>-60</span><span>-45</span><span>-30</span><span>-15</span><span>0</span>
              </div>

              <div class="absolute top-4 left-6 right-0 bottom-4 border border-red-500/30 rounded overflow-hidden">
                <div class="absolute top-[30%] right-[20%] w-8 h-8 pointer-events-none z-20">
                  <div class="absolute top-1/2 left-0 right-0 h-px bg-red-500/80"></div>
                  <div class="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/80"></div>
                  <div class="absolute inset-0 border border-red-500/80 rounded-full animate-ping opacity-50"></div>
                </div>
                <canvas ref="canvasRef" width="300" height="150" class="w-full h-full"></canvas>
              </div>
            </div>

            <div class="w-[100px] flex flex-col gap-2">
              <div class="text-xs text-gray-400 mb-1">识别结果</div>
              <div class="bg-red-500/10 border border-red-500/30 p-2 rounded relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div class="text-white text-sm font-bold">钻心虫</div>
                <div class="text-red-400 text-[10px]">高置信度</div>
              </div>
              <div class="bg-red-500/10 border border-red-500/30 p-2 rounded relative overflow-hidden opacity-70">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div class="text-white text-sm font-bold">根结线虫</div>
                <div class="text-red-400 text-[10px]">高置信度</div>
              </div>
              <div class="bg-green-500/10 border border-green-500/30 p-2 rounded relative overflow-hidden opacity-50">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div class="text-white text-sm font-bold">蚜虫</div>
                <div class="text-green-400 text-[10px]">低风险</div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative rounded-xl p-4 flex flex-col backdrop-blur-md overflow-hidden flex-1" style="left: 60px; width: 400px; border-width: 1px; border-style: solid; border-color: #22c55e;">
          <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffff]"></div>
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffff]"></div>

          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-[#00ffff] font-bold italic text-lg">//</span>
              <h2 class="text-lg font-bold text-white tracking-wide">AI 决策与控制指令流</h2>
            </div>
            <span class="text-xs text-gray-400">更新时间: 14:35:42</span>
          </div>

          <div class="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar" style="flex: 1">
            <div v-for="(log, index) in decisionLog" :key="index" class="flex gap-3 items-start relative pb-2 group">
              <div v-if="index !== decisionLog.length - 1" class="absolute left-[15px] top-8 bottom-[-10px] w-px bg-[#00ffff]/20"></div>

              <div :class="['relative z-10 p-1.5 rounded-full mt-1 border', getStatusClass(log.status)]">
                <component :is="log.icon" :size="16" />
              </div>

              <div class="flex-1 bg-[#041a33]/50 p-2 rounded border border-[#00ffff]/10 group-hover:bg-[#041a33] transition-colors">
                <div class="flex justify-between items-center mb-1">
                  <div :class="['font-bold text-sm', log.status === 'alert' ? 'text-red-400' : 'text-[#00ffff]']">{{ log.title }}</div>
                  <div class="text-[10px] text-gray-500">{{ log.time }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ log.desc }}</div>
              </div>

              <div class="mt-2 text-[10px]">
                <span :class="{
                  'text-[#00ffff]': log.status === 'running',
                  'text-red-500': log.status === 'alert',
                  'text-green-500': log.status === 'completed'
                }">{{ getStatusText(log.status) }}</span>
              </div>
            </div>

            <div class="text-center mt-2 cursor-pointer text-[#00ffff]/70 text-xs flex items-center justify-center gap-1 hover:text-[#00ffff]">
              查看更多日志 <ChevronDown :size="14" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer v-if="currentPage === 'greenhouse'" class="grid grid-cols-7 gap-3 mt-3 relative z-10 flex-shrink-0">
      <div v-for="(card, idx) in greenhouseStats" :key="idx" class="bg-transparent border border-[#22c55e]/50 rounded-lg p-2.5 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#22c55e]/80 transition-colors text-center">
        <div class="absolute inset-0 bg-gradient-to-r from-[#22c55e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex flex-col items-center gap-2.5 relative z-10">
          <div :class="['p-1.5 rounded-lg', card.isWarning ? 'bg-red-500/20 text-red-400' : 'bg-[#22c55e]/20 text-[#22c55e]']">
            <component :is="card.icon" :size="16" />
          </div>
          <div class="flex flex-col items-center">
            <div class="text-sm text-gray-400 mb-0.5">{{ card.label }}</div>
            <div class="flex items-baseline gap-1 justify-center">
              <span :class="['text-2xl font-bold', card.isWarning ? 'text-red-400' : 'text-white']">{{ card.value }}</span>
              <span class="text-sm text-gray-400">{{ card.unit }}</span>
              <span v-if="card.trend" class="text-[#22c55e] text-sm ml-1">↑</span>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div v-if="currentPage === 'openfield'" class="app-container">
      <!-- Main Content -->
      <main class="flex-1 flex gap-4 px-4 pb-2 min-h-0 relative z-10">
        
        <!-- Left Column -->
        <div class="w-[28%] flex flex-col gap-4">
          
          <!-- 环境监测 -->
          <div class="tech-panel flex-1 flex flex-col p-4 pt-3">
            <div class="tech-panel-inner"></div>
            <div class="panel-title">
              <i class="ph ph-leaf text-green-400 mr-2"></i> 环境监测
              <div class="panel-title-line"></div>
            </div>
            
            <div class="flex justify-between items-end mb-2">
              <div class="flex items-center gap-1 text-xs text-[#00ffcc]">
                <i class="ph-fill ph-lightning"></i> 气象雷达
              </div>
              <div class="text-xs text-gray-400">亳州市 谯城区</div>
            </div>

            <div class="flex gap-4 mb-4">
              <!-- Left Stats -->
              <div class="w-1/3 flex flex-col justify-center">
                <div class="text-3xl font-bold text-white num-font mb-2">25<span class="text-base text-gray-400">°C</span></div>
                <div class="text-xs text-gray-400 space-y-1">
                  <p>东南风 2级</p>
                  <p>湿度 <span class="text-[#00ffcc]">65%</span></p>
                  <p>降水概率 20%</p>
                </div>
              </div>
              <!-- Radar Image Placeholder -->
              <div class="w-2/3 h-[120px] bg-[#051822] border border-[#133c46] rounded relative overflow-hidden flex items-center justify-center">
                <!-- Radar Map -->
                <div class="absolute inset-0 bg-[url('/leidaditu.png')] bg-cover bg-center"></div>
                <div class="radar-scan"></div>
                <!-- Radar colors blob -->
                <div class="absolute w-20 h-20 bg-gradient-to-tr from-green-500 via-yellow-400 to-red-500 rounded-full blur-xl opacity-60"></div>
                <div class="absolute w-12 h-12 bg-red-500 rounded-full blur-lg opacity-80"></div>
              </div>
            </div>

            <!-- Color scale -->
            <div class="flex items-center gap-1 text-[10px] text-gray-500 mb-4">
              <span>0</span>
              <div class="h-1 flex-1 flex">
                <div class="w-1/6 bg-blue-500"></div><div class="w-1/6 bg-cyan-400"></div><div class="w-1/6 bg-green-500"></div>
                <div class="w-1/6 bg-yellow-400"></div><div class="w-1/6 bg-orange-500"></div><div class="w-1/6 bg-red-500"></div>
              </div>
              <span>100</span>
            </div>

            <!-- Forecast -->
            <div class="flex justify-between mt-auto">
              <div class="text-center">
                <p class="text-xs text-gray-400 mb-1">今天</p>
                <p class="text-sm text-[#00ffcc] num-font">18~26°C</p>
                <i class="ph-fill ph-cloud text-xl text-gray-300 my-1 block"></i>
                <p class="text-xs">多云</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-400 mb-1">明天</p>
                <p class="text-sm text-white num-font">20~28°C</p>
                <i class="ph-fill ph-cloud-sun text-xl text-gray-300 my-1 block"></i>
                <p class="text-xs">多云转晴</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-400 mb-1">后天</p>
                <p class="text-sm text-white num-font">21~30°C</p>
                <i class="ph-fill ph-sun text-xl text-yellow-400 my-1 block"></i>
                <p class="text-xs">晴转多云</p>
              </div>
            </div>
          </div>

          <!-- 土壤墒情监测 -->
          <div class="tech-panel flex-[1.2] flex flex-col p-4 pt-3 relative">
            <div class="tech-panel-inner"></div>
            <div class="panel-title">
              <i class="ph ph-waves text-green-400 mr-2"></i> 土壤墒情监测
              <div class="panel-title-line"></div>
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-[#133c46] mb-2 text-xs">
              <div class="px-4 py-1 text-[#00ffcc] border-b-2 border-[#00ffcc] cursor-pointer">10cm层</div>
              <div class="px-4 py-1 text-gray-400 hover:text-white cursor-pointer">20cm层</div>
              <div class="px-4 py-1 text-gray-400 hover:text-white cursor-pointer">40cm层</div>
              <div class="px-4 py-1 text-gray-400 hover:text-white cursor-pointer">60cm层</div>
            </div>
            
            <div class="text-xs text-gray-400 absolute right-4 top-12">土壤湿度 (%)</div>
            
            <!-- Soil Moisture Chart -->
            <div class="flex-1 w-full mt-2" style="min-height: 140px; position: relative;">
              <!-- Y Axis -->
              <div style="position: absolute; left: 0; top: 0; bottom: 24px; width: 24px; display: flex; flex-direction: column; justify-content: space-between; font-size: 10px; color: #64748b; padding: 4px 0;">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>
              
              <!-- Chart Area -->
              <div style="position: absolute; left: 24px; right: 0; top: 0; bottom: 24px;">
                <!-- Grid Lines -->
                <div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between;">
                  <div style="width: 100%; height: 1px; background-color: rgba(19, 60, 70, 0.3);"></div>
                  <div style="width: 100%; height: 1px; background-color: rgba(19, 60, 70, 0.3);"></div>
                  <div style="width: 100%; height: 1px; background-color: rgba(19, 60, 70, 0.3);"></div>
                  <div style="width: 100%; height: 1px; background-color: rgba(19, 60, 70, 0.3);"></div>
                  <div style="width: 100%; height: 1px; background-color: rgba(19, 60, 70, 0.3);"></div>
                  <div style="width: 100%; height: 1px; background-color: rgba(19, 60, 70, 0.3);"></div>
                </div>
                
                <!-- SVG Line Chart -->
                <svg style="position: absolute; inset: 0; width: 100%; height: 100%;" preserveAspectRatio="none" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient id="soilMoistureGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#00aaff" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="#00aaff" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  <!-- Area Fill -->
                  <path d="M0,65 L50,55 L100,45 L150,35 L200,50 L250,75 L300,60 L300,100 L0,100 Z" 
                        fill="url(#soilMoistureGradient)"/>
                  
                  <!-- Line -->
                  <path d="M0,65 L50,55 L100,45 L150,35 L200,50 L250,75 L300,60" 
                        fill="none" stroke="#00aaff" stroke-width="2"/>
                  
                  <!-- Data Points -->
                  <circle cx="0" cy="65" r="3" fill="#00aaff"/>
                  <circle cx="50" cy="55" r="3" fill="#00aaff"/>
                  <circle cx="100" cy="45" r="3" fill="#00aaff"/>
                  <circle cx="150" cy="35" r="3" fill="#00aaff"/>
                  <circle cx="200" cy="50" r="3" fill="#00aaff"/>
                  <circle cx="250" cy="75" r="4" fill="#00aaff" stroke="#fff" stroke-width="1.5"/>
                  <circle cx="300" cy="60" r="3" fill="#00aaff"/>
                </svg>
                
                <!-- Current Value Tooltip -->
                <div style="position: absolute; left: 80%; top: 65%; transform: translate(-50%, -100%); z-index: 10;">
                  <div style="background-color: #00aaff; color: white; font-size: 12px; padding: 4px 8px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); white-space: nowrap;">
                    32.6%
                  </div>
                  <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #00aaff; margin: 0 auto;"></div>
                </div>
              </div>
              
              <!-- X Axis -->
              <div style="position: absolute; left: 24px; right: 0; bottom: 0; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>

          <!-- 土壤养分检测 -->
          <div class="tech-panel flex-1 flex flex-col p-4 pt-3">
            <div class="tech-panel-inner"></div>
            <div class="panel-title">
              <i class="ph ph-flask text-green-400 mr-2"></i> 土壤养分检测 <span class="text-xs text-gray-500 ml-2">(mg/kg)</span>
              <div class="panel-title-line"></div>
            </div>

            <div class="flex items-center h-full gap-4">
              <!-- Circular Gauge -->
              <div class="w-[120px] h-[120px] relative flex-shrink-0">
                <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                  <!-- Background track -->
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0a2a36" stroke-width="8" />
                  <!-- Progress tracks (multiple segments for sci-fi look) -->
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#00ffcc" stroke-width="8" stroke-dasharray="180 251" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#008877" stroke-width="2" stroke-dasharray="4 4" />
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#005566" stroke-width="1" stroke-dasharray="10 10" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center text-[#00ffcc] text-3xl">
                  <i class="ph-fill ph-drop"></i>
                </div>
              </div>

              <!-- Data List -->
              <div class="flex-1 space-y-3 pr-4">
                <div class="flex items-center justify-start gap-4 text-sm">
                  <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#00ffcc]"></div>有机质</span>
                  <span class="num-font text-white">23.5</span>
                </div>
                <div class="flex items-center justify-start gap-4 text-sm">
                  <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#00ffcc]"></div>氮(N)</span>
                  <span class="num-font text-white">118.6</span>
                </div>
                <div class="flex items-center justify-start gap-4 text-sm">
                  <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#00ffcc]"></div>磷(P)</span>
                  <span class="num-font text-white">45.3</span>
                </div>
                <div class="flex items-center justify-start gap-4 text-sm">
                  <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-[#00ffcc]"></div>钾(K)</span>
                  <span class="num-font text-white">184.6</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Center Column -->
        <div class="w-[44%] flex flex-col relative">
          
          <!-- Top Stats Row -->
          <div class="flex gap-2 mb-4 h-[70px]">
            <!-- Card 1 -->
            <div class="tech-panel flex-1 flex items-center p-2 stat-card rounded-md" style="background: rgba(3, 14, 22, 0.95);">
              <div class="w-10 h-10 rounded-full bg-[#003333] flex items-center justify-center text-[#00ffcc] text-xl mr-2 border border-[#005555]">
                <i class="ph ph-stack"></i>
              </div>
              <div>
                <div class="text-xs text-gray-400">种植面积(亩)</div>
                <div class="text-xl font-bold num-font text-[#00ffcc]">12,560</div>
              </div>
            </div>
            <!-- Card 2 -->
            <div class="tech-panel flex-1 flex items-center p-2 stat-card rounded-md" style="background: rgba(3, 14, 22, 0.95);">
              <div class="w-10 h-10 rounded-full bg-[#003333] flex items-center justify-center text-[#00ffcc] text-xl mr-2 border border-[#005555]">
                <i class="ph ph-thermometer"></i>
              </div>
              <div>
                <div class="text-xs text-gray-400">传感器数量(个)</div>
                <div class="text-xl font-bold num-font text-[#00ffcc]">156</div>
              </div>
            </div>
            <!-- Card 3 -->
            <div class="tech-panel flex-1 flex items-center p-2 stat-card rounded-md" style="background: rgba(3, 14, 22, 0.95);">
              <div class="w-10 h-10 rounded-full bg-[#003333] flex items-center justify-center text-white text-xl mr-2 border border-[#005555]">
                <i class="ph ph-airplane"></i>
              </div>
              <div>
                <div class="text-xs text-gray-400">无人机数量(台)</div>
                <div class="text-xl font-bold num-font text-white">8</div>
              </div>
            </div>
            <!-- Card 4 Warning -->
            <div class="tech-panel flex-1 flex items-center p-2 stat-card-warning rounded-md" style="background: rgba(3, 14, 22, 0.95);">
              <div class="w-10 h-10 rounded-full bg-[#332200] flex items-center justify-center text-[#ffcc00] text-xl mr-2 border border-[#664400]">
                <i class="ph-fill ph-warning"></i>
              </div>
              <div>
                <div class="text-xs text-gray-400">告警数量(条)</div>
                <div class="text-xl font-bold num-font text-[#ffcc00]">3</div>
              </div>
            </div>
            <!-- Card 5 -->
            <div class="tech-panel flex-[1.2] flex items-center p-2 stat-card rounded-md" style="background: rgba(3, 14, 22, 0.95);">
              <div class="w-10 h-10 rounded-full bg-[#002233] flex items-center justify-center text-[#00aaff] text-xl mr-2 border border-[#004466]">
                <i class="ph ph-chart-bar"></i>
              </div>
              <div>
                <div class="text-xs text-gray-400">产量预测(kg)</div>
                <div class="flex items-baseline gap-1">
                  <div class="text-xl font-bold num-font text-[#00aaff]">8,560</div>
                  <div class="text-xs text-[#00ffcc]">↑ 12%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Central 3D Map Area -->
          <div class="flex-1 relative rounded-lg overflow-hidden border border-[#133c46] bg-[#020a10]">
            <!-- Background Image (Simulated 3D field) -->
            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity transform scale-105" style="filter: sepia(1) hue-rotate(130deg) saturate(3) contrast(1.2);"></div>
            
            <!-- Overlay Grid/Light rays to make it look techy -->
            <div class="absolute inset-0 z-0">
            <video class="w-full h-full object-cover" autoplay loop muted playsinline>
              <source src="/wupeng.mp4" type="video/mp4">
            </video>
          </div>
            
            <!-- Simulated Drones -->
            <div class="absolute top-1/4 left-1/3 z-10 text-center transform -translate-x-1/2 -translate-y-1/2">
              <img src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=150&h=150&fit=crop" class="w-20 h-auto object-cover rounded-full mix-blend-screen opacity-80" alt="Drone" style="clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); filter: drop-shadow(0 0 10px #00ffcc);">
              <div class="w-[80px] h-[150px] bg-gradient-to-b from-[rgba(0,255,204,0.4)] to-transparent absolute top-[80%] left-1/2 transform -translate-x-1/2" style="clip-path: polygon(40% 0, 60% 0, 100% 100%, 0% 100%);"></div>
            </div>
          </div>

          <!-- Bottom Controls -->
          <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
            <div class="btn-group-item active rounded-l flex flex-col items-center justify-center w-20 h-16">
              <i class="ph ph-cube text-2xl mb-1"></i>
              <span class="text-xs">全局视角</span>
            </div>
            <div class="btn-group-item flex flex-col items-center justify-center w-20 h-16">
              <i class="ph ph-plant text-2xl mb-1"></i>
              <span class="text-xs">生长模型</span>
            </div>
            <div class="btn-group-item flex flex-col items-center justify-center w-20 h-16">
              <i class="ph ph-squares-four text-2xl mb-1"></i>
              <span class="text-xs">网格管理</span>
            </div>
            <div class="btn-group-item flex flex-col items-center justify-center w-20 h-16">
              <i class="ph ph-hard-drives text-2xl mb-1"></i>
              <span class="text-xs">设备管理</span>
            </div>
            <div class="btn-group-item rounded-r flex flex-col items-center justify-center w-20 h-16">
              <i class="ph ph-stack text-2xl mb-1"></i>
              <span class="text-xs">数据图层</span>
            </div>
          </div>
          
          <!-- Glowing accent at bottom center map -->
          <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-[#00ffcc] opacity-10 blur-3xl rounded-full z-0 pointer-events-none"></div>
        </div>

        <!-- Right Column -->
        <div class="w-[28%] flex flex-col gap-4">
          
          <!-- 视听融合 -->
          <div class="tech-panel flex-[1.1] flex flex-col p-4 pt-3">
            <div class="tech-panel-inner"></div>
            <div class="panel-title">
              <i class="ph ph-waveform text-green-400 mr-2"></i> 视听融合·AI病虫害预警
              <div class="panel-title-line"></div>
            </div>

            <div class="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span class="flex items-center gap-1"><i class="ph-fill ph-caret-right text-[#00ffcc]"></i> 声学梅尔频谱</span>
              <span>设备: acoustic-12#</span>
            </div>

            <div class="flex-1 relative border border-[#133c46] rounded overflow-hidden">
              <!-- Spectrogram Background -->
              <div class="absolute inset-0 spectrogram-bg opacity-70"></div>
              <!-- Grid Lines -->
              <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20% 20%;"></div>
              
              <!-- Y Axis Labels -->
              <div class="absolute left-1 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-500 py-1">
                <span>8k</span><span>4k</span><span>2k</span><span>1k</span><span>500</span><span>0</span>
              </div>
              <!-- X Axis Labels -->
              <div class="absolute left-6 right-2 bottom-0 flex justify-between text-[9px] text-gray-500 pb-1">
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
              </div>

              <!-- Alert Zone -->
              <div class="absolute top-0 bottom-5 right-[10%] w-[30%] bg-[rgba(255,51,102,0.15)] border-x border-[#ff3366] flex flex-col items-center justify-start pt-4 z-10">
                <div class="bg-[rgba(255,51,102,0.8)] text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 shadow-[0_0_10px_#ff3366]">
                  <i class="ph-fill ph-warning"></i> 检测到害虫活动！
                </div>
              </div>
              <!-- Simulated Waveform Line over spectrogram -->
              <svg class="absolute inset-0 w-full h-[calc(100%-20px)] z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,50 L5,45 L10,55 L15,48 L20,52 L25,30 L30,60 L35,40 L40,50 L45,48 L50,55 L55,40 L60,80 L65,20 L70,90 L75,10 L80,60 L85,45 L90,55 L95,48 L100,50" fill="none" stroke="#00ffcc" stroke-width="0.5" filter="drop-shadow(0 0 2px #00ffcc)"></path>
              </svg>
            </div>
          </div>

          <!-- AI识别结果 -->
          <div class="tech-panel flex-[0.9] flex flex-col p-4 pt-3">
            <div class="tech-panel-inner"></div>
            <div class="panel-title mb-2">
              <i class="ph-fill ph-caret-right text-[#00ffcc] mr-1 text-xs"></i> AI识别结果
            </div>

            <div class="alert-box-red flex-1 flex p-3 rounded-r-md">
              <div class="flex-1 pr-2">
                <div class="flex items-start gap-2 mb-2">
                  <i class="ph-fill ph-warning-circle text-[#ff3366] text-xl mt-0.5"></i>
                  <div>
                    <h3 class="text-[#ff3366] font-bold text-base leading-tight">草地贪夜蛾</h3>
                    <p class="text-xs text-gray-400 italic">Spodoptera frugiperda</p>
                  </div>
                </div>
                <div class="text-sm space-y-1 mt-3">
                  <p class="text-gray-300">置信度: <span class="text-[#ff3366] font-bold num-font">92.6%</span></p>
                  <p class="text-gray-300">发生概率: <span class="text-[#ff3366] font-bold">高</span></p>
                </div>
              </div>
              <div class="w-[100px] h-full border border-[#ff3366] rounded overflow-hidden relative">
                <img src="/chongzi.png" alt="Pest" class="w-full h-full object-cover">
                <!-- Scanning line effect on image -->
                <div class="absolute top-0 left-0 w-full h-[2px] bg-[#ff3366] shadow-[0_0_8px_#ff3366] animate-[scan_2s_ease-in-out_infinite_alternate]"></div>
              </div>
            </div>
          </div>

          <!-- AI决策建议 -->
          <div class="tech-panel flex-[0.8] flex flex-col p-4 pt-3">
            <div class="tech-panel-inner"></div>
            <div class="panel-title mb-2">
              <i class="ph-fill ph-flask text-[#00d0ff] mr-2"></i> AI决策建议
            </div>

            <div class="advice-box flex-1 flex items-center p-3 relative overflow-hidden">
              <div class="flex-1 space-y-1.5 z-10">
                <p class="text-[#00d0ff] font-bold mb-2">建议使用生物农药进行防治</p>
                <p class="text-xs text-gray-300 flex items-center gap-2"><span class="text-gray-500 w-16">推荐药剂:</span> Bt可湿性粉剂</p>
                <p class="text-xs text-gray-300 flex items-center gap-2"><span class="text-gray-500 w-16">推荐浓度:</span> 800-1000倍液</p>
                <p class="text-xs text-gray-300 flex items-center gap-2"><span class="text-gray-500 w-16">最佳时间:</span> 傍晚施药</p>
              </div>
              <!-- AI Brain Icon watermark -->
              <i class="ph-fill ph-brain text-[80px] text-[#00d0ff] absolute right-[-10px] top-1/2 transform -translate-y-1/2 opacity-20"></i>
            </div>
          </div>

          <!-- 多光谱无人机监测 -->
          <div class="tech-panel flex-[1.2] flex flex-col p-4 pt-3">
            <div class="tech-panel-inner"></div>
            <div class="panel-title">
              <i class="ph-fill ph-caret-right text-green-400 mr-2 text-xs"></i> 多光谱无人机监测
              <div class="panel-title-line"></div>
            </div>

            <!-- Tabs -->
            <div class="flex justify-between border-b border-[#133c46] mb-2 text-xs pb-1">
              <div class="px-2 text-[#00ffcc] border-b-2 border-[#00ffcc] cursor-pointer">可见光</div>
              <div class="px-2 text-gray-400 hover:text-white cursor-pointer">NDVI</div>
              <div class="px-2 text-gray-400 hover:text-white cursor-pointer">红边</div>
              <div class="px-2 text-gray-400 hover:text-white cursor-pointer">热成像</div>
            </div>

            <div class="flex-1 relative border border-[#133c46] rounded overflow-hidden group">
              <img src="/wurenji.png" alt="Drone View" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500">
              <!-- Overlay Grid -->
              <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBWMDBWMHpIgZmlsbD0icmdiYSgwLDI1NSwyMDQsMC4yKSIvPjwvc3ZnPg==')] opacity-30"></div>
              <!-- Center reticle -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-[#00ffcc] opacity-50 flex items-center justify-center">
                <div class="w-1 h-1 bg-[#00ffcc]"></div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="h-[30px] flex justify-between items-center px-6 text-[11px] text-gray-400 shrink-0 border-t border-[#133c46] bg-[rgba(3,11,20,0.8)] relative z-20">
        <div class="flex gap-6">
          <span>设备在线率 <span class="text-[#00ffcc] num-font text-xs">98.6%</span></span>
          <span>数据更新时间 <span class="num-font text-xs text-gray-300">2024-05-20 10:30:00</span></span>
          <span>设备总数 <span class="num-font text-xs text-white">256</span></span>
          <span>在线设备 <span class="text-[#00ffcc] num-font text-xs">252</span></span>
        </div>
        <div class="flex items-center gap-6">
          <span>告警统计</span>
          <div class="flex items-center gap-1 text-[#ff3366]">
            <i class="ph-fill ph-warning-circle"></i> 紧急告警 <span class="num-font text-sm ml-1">1</span>
          </div>
          <div class="flex items-center gap-1 text-[#ffcc00]">
            <i class="ph-fill ph-warning"></i> 重要告警 <span class="num-font text-sm ml-1">2</span>
          </div>
          <div class="flex items-center gap-1 text-gray-300">
            <i class="ph-fill ph-info"></i> 一般告警 <span class="num-font text-sm ml-1 text-[#00ffcc]">5</span>
          </div>
        </div>
      </footer>
    </div>

    <svg width="0" height="0" class="hidden">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.2 0" />
      </filter>
    </svg>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

:root {
  --bg-color: #030b14;
  --panel-bg: rgba(6, 22, 34, 0.7);
  --panel-border: #133c46;
  --primary-glow: #00ffcc;
  --primary-dark: #008877;
  --accent-cyan: #00d0ff;
  --accent-red: #ff3366;
  --accent-yellow: #ffcc00;
  --text-main: #e2f1f8;
  --text-sub: #7ab3c4;
}

.app-container {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Noto Sans SC', sans-serif;
  margin: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 255, 204, 0.03) 0%, transparent 60%),
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 100% 100%, 30px 30px, 30px 30px;
  display: flex;
  flex-direction: column;
}

.num-font { font-family: 'Oswald', sans-serif; }

/* 科技感面板样式 */
.tech-panel {
  background: linear-gradient(180deg, rgba(9, 28, 40, 0.8) 0%, rgba(3, 14, 22, 0.9) 100%);
  border: 1px solid var(--panel-border);
  position: relative;
  backdrop-filter: blur(5px);
  box-shadow: inset 0 0 20px rgba(0, 255, 204, 0.02);
  border-radius: 4px;
}

/* 四角发光角标 */
.tech-panel::before, .tech-panel::after,
.tech-panel-inner::before, .tech-panel-inner::after {
  content: ''; position: absolute; width: 10px; height: 10px; border: 2px solid transparent;
}
.tech-panel::before { top: -1px; left: -1px; border-top-color: var(--primary-glow); border-left-color: var(--primary-glow); }
.tech-panel::after { bottom: -1px; right: -1px; border-bottom-color: var(--primary-glow); border-right-color: var(--primary-glow); }
.tech-panel-inner { position: absolute; inset: 0; pointer-events: none; }
.tech-panel-inner::before { top: -1px; right: -1px; border-top-color: var(--primary-glow); border-right-color: var(--primary-glow); }
.tech-panel-inner::after { bottom: -1px; left: -1px; border-bottom-color: var(--primary-glow); border-left-color: var(--primary-glow); }

/* 面板标题样式 */
.panel-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 12px;
  position: relative;
  padding-left: 10px;
}
.panel-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background-color: var(--primary-glow);
  box-shadow: 0 0 8px var(--primary-glow);
}
.panel-title-line {
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 255, 204, 0.5), transparent);
  margin-left: 10px;
}

/* 顶部导航背景切割 */
.header-bg {
  background: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1920 80" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1920v40l-40 40H40L0 40V0z" fill="rgba(6,22,34,0.8)" stroke="%23133c46" stroke-width="2"/></svg>') no-repeat center top;
  background-size: 100% 100%;
}

/* 导航菜单发光下划线 */
.nav-item.active {
  color: var(--primary-glow);
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
  position: relative;
}
.nav-item.active::after {
  content: ''; position: absolute; bottom: -8px; left: 10%; width: 80%; height: 2px;
  background-color: var(--primary-glow);
  box-shadow: 0 0 10px var(--primary-glow);
}

/* 滚动条隐藏 */
::-webkit-scrollbar { width: 0px; height: 0px; }

/* 顶部统计卡片 */
.stat-card {
  background: linear-gradient(90deg, rgba(0, 255, 204, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
  border-left: 2px solid var(--primary-glow);
}
.stat-card-warning {
  background: linear-gradient(90deg, rgba(255, 204, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
  border-left: 2px solid var(--accent-yellow);
}

/* 地图上的悬浮节点 */
.map-node {
  position: absolute;
  background: rgba(0, 30, 25, 0.8);
  border: 1px solid var(--primary-glow);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--primary-glow);
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -100%);
  z-index: 10;
}
.map-node::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 20px;
  background: var(--primary-glow);
}
.map-node-base {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%) rotateX(60deg);
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-glow);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--primary-glow) inset, 0 0 15px var(--primary-glow);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translateX(-50%) rotateX(60deg) scale(0.8); opacity: 0.5; }
  50% { transform: translateX(-50%) rotateX(60deg) scale(1.2); opacity: 1; }
  100% { transform: translateX(-50%) rotateX(60deg) scale(0.8); opacity: 0.5; }
}

/* 按钮组样式 */
.btn-group-item {
  background: rgba(0, 50, 60, 0.5);
  border: 1px solid #1a5051;
  color: var(--text-sub);
  padding: 4px 16px;
  transition: all 0.3s;
  cursor: pointer;
}
.btn-group-item.active {
  background: rgba(0, 255, 204, 0.2);
  border-color: var(--primary-glow);
  color: var(--primary-glow);
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.2) inset;
}

/* 预警红框 */
.alert-box-red {
  border: 1px solid rgba(255, 51, 102, 0.5);
  background: rgba(255, 51, 102, 0.1);
  position: relative;
}
.alert-box-red::before {
  content: ''; position: absolute; left: 0; top: 0; width: 3px; height: 100%; background: var(--accent-red); box-shadow: 0 0 8px var(--accent-red);
}

/* AI建议蓝框 */
.advice-box {
  border: 1px solid rgba(0, 208, 255, 0.3);
  background: rgba(0, 208, 255, 0.05);
  border-radius: 4px;
}

/* 雷达扫描动画 */
.radar-scan {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 204, 0.4) 100%);
  border-radius: 50%;
  transform-origin: center;
  animation: radar-scan-anim 4s linear infinite;
}
@keyframes radar-scan-anim {
  100% { transform: translate(-50%, -50%) rotate(360deg); }
  0% { transform: translate(-50%, -50%) rotate(0deg); }
}

/* 频段图渐变背景 */
.spectrogram-bg {
  background: linear-gradient(90deg, #010a11 0%, #052b4a 20%, #094770 40%, #1579a3 60%, #30b0b8 80%, #00ffcc 100%);
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="wave" width="10" height="100" patternUnits="userSpaceOnUse"><rect x="0" y="20" width="2" height="60" fill="white"/><rect x="4" y="10" width="2" height="80" fill="white"/><rect x="8" y="30" width="2" height="40" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(%23wave)"/></svg>');
  mask-image: url('data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="wave" width="10" height="100" patternUnits="userSpaceOnUse"><rect x="0" y="20" width="2" height="60" fill="white"/><rect x="4" y="10" width="2" height="80" fill="white"/><rect x="8" y="30" width="2" height="40" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(%23wave)"/></svg>');
}

/* 扫描线动画 */
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
</style>