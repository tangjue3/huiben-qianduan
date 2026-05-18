<template>
  <div class="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#060504] text-[#e6cfaa]">
    <div class="absolute inset-0">
      <div
        class="absolute inset-0 scale-105 bg-cover bg-center"
        style="background-image: url('/bencaotujian.png');"
      ></div>
      <div class="absolute inset-0 bg-[rgba(7,5,3,0.84)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,133,57,0.16),transparent_32%)]"></div>
      <div class="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,5,4,0.9)_0%,rgba(6,5,4,0.68)_38%,rgba(6,5,4,0.82)_100%)]"></div>
    </div>

    <div class="relative z-10 mx-auto w-[min(1820px,calc(100vw-20px))] px-2 py-5 md:w-[min(1880px,calc(100vw-36px))] md:px-3 md:py-7">
      <div class="grid gap-5 2xl:grid-cols-[272px_minmax(0,1fr)]">
        <aside class="flex flex-col gap-6">
          <div class="rounded-[24px] border border-[rgba(186,139,72,0.16)] bg-[rgba(10,8,6,0.72)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-sm">
            <button
              v-for="item in sidebarItems"
              :key="item.key"
              type="button"
              class="group flex w-full items-start gap-4 rounded-[18px] px-4 py-4 text-left transition-all duration-300"
              :class="item.active
                ? 'border border-[rgba(53,175,146,0.18)] bg-[linear-gradient(135deg,rgba(13,52,43,0.92),rgba(8,24,19,0.92))] shadow-[inset_0_1px_0_rgba(117,255,225,0.08)]'
                : 'border border-transparent hover:border-[rgba(186,139,72,0.14)] hover:bg-[rgba(255,255,255,0.02)]'"
            >
              <div
                class="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors duration-300"
                :class="item.active
                  ? 'border-[rgba(83,214,180,0.28)] bg-[rgba(16,58,48,0.95)] text-[#59d8b7]'
                  : 'border-[rgba(186,139,72,0.16)] bg-[rgba(18,13,10,0.7)] text-[#d3c2a3] group-hover:text-[#f0ddbb]'"
              >
                <component :is="item.icon" :size="20" />
              </div>
              <div class="min-w-0">
                <p class="text-[22px] font-medium tracking-[0.02em]" :class="item.active ? 'text-[#f1eadb]' : 'text-[#efe0c5]'">
                  {{ item.title }}
                </p>
                <p class="mt-1 text-sm leading-6 text-[#8d7a5d]">{{ item.subtitle }}</p>
              </div>
            </button>
          </div>

          <div class="quote-card rounded-[20px] border border-[rgba(186,139,72,0.16)] bg-[rgba(10,8,6,0.68)] p-6 backdrop-blur-sm">
            <div class="mb-6 text-[40px] leading-none text-[rgba(205,156,82,0.34)]">“</div>
            <p class="max-w-[160px] text-lg leading-10 text-[#c8ae85]">
              医者，仁术也。<br>
              善治者，先医其心，<br>
              心安则身安。
            </p>
            <div class="mt-8 h-px w-16 bg-[linear-gradient(90deg,rgba(202,152,78,0.55),transparent)]"></div>
            <p class="mt-5 text-sm tracking-[0.16em] text-[#8f7650]">《黄帝内经》</p>
          </div>
        </aside>

        <main class="flex min-w-0 flex-col gap-5">
          <section class="overflow-hidden rounded-[26px] border border-[rgba(196,149,80,0.22)] bg-[rgba(12,9,6,0.54)] shadow-[0_32px_80px_rgba(0,0,0,0.3)] backdrop-blur-sm">
            <div class="grid h-[650px] lg:grid-cols-[58%_42%] 2xl:h-[700px]">
              <div class="relative min-h-[360px] overflow-hidden 2xl:min-h-[500px]">
                <div
                  class="absolute inset-0 bg-cover bg-center"
                  style="background-image: url('/bencaotujian.png');"
                ></div>
                <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,7,5,0.15),rgba(9,7,5,0.1)_44%,rgba(9,7,5,0.55))]"></div>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,207,161,0.08),transparent_38%)]"></div>

                <!-- Avatar SDK renders here -->
                <div ref="avatarContainerRef" class="absolute inset-0 z-10 avatar-slot"></div>

                <!-- Click-to-start overlay (also shows error state) -->
                <div v-if="!avatarConnected && !avatarLoading && !avatarPlayBlocked"
                     class="absolute inset-0 z-20 flex cursor-pointer items-center justify-center backdrop-blur-[1px] transition-all duration-500 hover:backdrop-blur-0"
                     @click="startAvatar">
                  <div class="flex flex-col items-center rounded-[24px] border border-[rgba(240,215,171,0.2)] bg-[rgba(5,3,0,0.72)] px-10 py-8 text-center shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[rgba(10,7,3,0.8)]">
                    <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(74,197,166,0.34)] bg-[rgba(9,33,27,0.78)] text-[#4bd1af]">
                      <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p class="text-[22px] tracking-[0.08em] text-[#efe0c4]">点击唤醒通灵</p>
                    <p class="mt-1 text-xs tracking-[0.18em] text-[#8d7a5d]">CLICK TO AWAKEN</p>
                    <!-- Error message shown after failed attempt -->
                    <p v-if="avatarError" class="mt-3 max-w-[200px] text-xs leading-relaxed text-red-400">{{ avatarError }}</p>
                  </div>
                </div>

                <!-- Loading overlay -->
                <div v-if="avatarLoading"
                     class="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(5,3,0,0.6)] backdrop-blur-sm">
                  <div class="flex flex-col items-center gap-3">
                    <div class="h-10 w-10 animate-spin rounded-full border-2 border-[#4bd1af] border-t-transparent"></div>
                    <p class="text-sm tracking-[0.12em] text-[#c8ae85]">通灵正在降临...</p>
                  </div>
                </div>

                <!-- Play-not-allowed overlay -->
                <div v-if="avatarPlayBlocked"
                     class="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(5,3,0,0.65)] backdrop-blur-sm">
                  <div class="flex flex-col items-center rounded-[24px] border border-[rgba(240,215,171,0.2)] bg-[rgba(5,3,0,0.72)] px-10 py-8 text-center shadow-2xl"
                       @click="handleResume">
                    <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(255,204,0,0.34)] bg-[rgba(40,35,10,0.78)] text-[#ffcc00]">
                      <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    </div>
                    <p class="text-[18px] tracking-[0.08em] text-[#efe0c4]">点击恢复语音</p>
                    <p class="mt-1 text-xs tracking-[0.18em] text-[#8d7a5d]">浏览器限制了自动播放</p>
                  </div>
                </div>
              </div>

              <div class="relative flex min-h-0 flex-col bg-[linear-gradient(180deg,rgba(14,10,7,0.92),rgba(14,11,8,0.96))] px-7 py-8 md:px-10 md:py-9 2xl:px-12 2xl:py-10">
                <div class="pointer-events-none absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(202,151,78,0.28),transparent)]"></div>

                <div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[26px] border border-[rgba(194,147,78,0.14)] bg-[linear-gradient(180deg,rgba(25,18,12,0.9),rgba(15,11,8,0.92))] shadow-[inset_0_1px_0_rgba(255,242,218,0.03)]">
                  <div class="flex items-center justify-between border-b border-[rgba(194,147,78,0.14)] px-5 py-4">
                    <div>
                      <p class="text-sm tracking-[0.2em] text-[#c89f61]">百草通灵</p>
                      <p class="mt-1 text-xs tracking-[0.16em] text-[#7e6848]">HERBAL DIALOGUE</p>
                    </div>
                    <div class="rounded-full border border-[rgba(194,147,78,0.14)] bg-[rgba(255,255,255,0.02)] px-3 py-1 text-xs text-[#a98d65]">
                      已载入图鉴上下文
                    </div>
                  </div>

                  <div ref="chatScrollRef" class="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
                    <div
                      v-for="message in chatMessages"
                      :key="message.id"
                      class="flex"
                      :class="message.role === 'assistant' ? 'justify-start' : 'justify-end'"
                    >
                      <div
                        class="max-w-[88%] rounded-[22px] px-4 py-3"
                        :class="message.role === 'assistant'
                          ? 'rounded-bl-[8px] border border-[rgba(197,150,82,0.16)] bg-[rgba(31,23,15,0.95)] text-[#dbc39f]'
                          : 'rounded-br-[8px] border border-[rgba(74,197,166,0.18)] bg-[linear-gradient(135deg,rgba(10,52,43,0.96),rgba(7,27,23,0.96))] text-[#e7f8f2]'"
                      >
                        <div class="mb-2 flex items-center gap-2 text-[11px] tracking-[0.18em]">
                          <span :class="message.role === 'assistant' ? 'text-[#c7a36a]' : 'text-[#62dfbc]'">
                            {{ message.role === 'assistant' ? '通灵助手' : '你' }}
                          </span>
                          <span class="text-[#6f5d44]">{{ message.time }}</span>
                        </div>
                        <p class="text-[15px] leading-8 whitespace-pre-wrap">{{ message.content }}</p>
                      </div>
                    </div>
                    <!-- Typing indicator -->
                    <div v-if="avatarLoading && chatMessages.length > 1" class="flex justify-start">
                      <div class="rounded-[22px] rounded-bl-[8px] border border-[rgba(197,150,82,0.16)] bg-[rgba(31,23,15,0.95)] px-4 py-3 text-[#dbc39f]">
                        <div class="flex items-center gap-1.5">
                          <span class="h-2 w-2 animate-bounce rounded-full bg-[#c7a36a]" style="animation-delay:0ms"></span>
                          <span class="h-2 w-2 animate-bounce rounded-full bg-[#c7a36a]" style="animation-delay:150ms"></span>
                          <span class="h-2 w-2 animate-bounce rounded-full bg-[#c7a36a]" style="animation-delay:300ms"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-[rgba(194,147,78,0.14)] px-5 pb-5 pt-4">
                    <div class="mb-4 flex flex-wrap gap-2">
                      <button
                        v-for="prompt in quickPrompts"
                        :key="prompt"
                        type="button"
                        class="rounded-full border border-[rgba(194,147,78,0.14)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-xs text-[#bfa47a] transition-all duration-300 hover:border-[rgba(78,203,170,0.22)] hover:text-[#e7d3b0]"
                        @click="handleQuickPrompt(prompt)"
                      >
                        {{ prompt }}
                      </button>
                    </div>

                    <div class="flex items-center gap-3 rounded-[18px] border border-[rgba(194,147,78,0.16)] bg-[rgba(11,8,6,0.86)] px-4 py-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(74,197,166,0.18)] bg-[rgba(9,33,27,0.78)] text-[#4bd1af]">
                        <MessageCircleMore :size="18" />
                      </div>
                      <input ref="chatInputRef" v-model="chatInput"
                        type="text"
                        placeholder="请输入你想了解的问题..."
                        class="min-w-0 flex-1 bg-transparent text-sm text-[#d9c09a] placeholder-[#766247] outline-none"
                        @keydown.enter="handleSend"
                      />
                      <button
                        type="button"
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(74,197,166,0.22)] bg-[linear-gradient(135deg,rgba(12,72,58,0.92),rgba(7,35,28,0.92))] text-[#63dfbf] transition-transform duration-300 hover:scale-105 disabled:opacity-40"
                        :disabled="!chatInput.trim()"
                        @click="handleSend"
                      >
                        <SendHorizonal :size="18" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="heritage-panel overflow-hidden rounded-[22px] border border-[rgba(196,149,80,0.2)] bg-[rgba(15,11,8,0.58)] px-6 py-5 md:px-8 md:py-6 2xl:px-10">
            <div class="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <div class="mb-3 inline-flex items-center gap-3">
                  <span class="h-px w-10 bg-[linear-gradient(90deg,rgba(205,155,81,0.8),transparent)]"></span>
                  <h2 class="text-[34px] font-medium tracking-[0.08em] text-[#f1ddb8]">本草传承</h2>
                </div>
                <p class="max-w-[980px] text-[15px] leading-8 text-[#bba27d]">
                  人参为五加科植物人参的干燥根。主产于吉林、辽宁等地，自古被誉为“百草之王”，
                  是中医补气药的代表，历代医家推崇备至。
                </p>
              </div>
              <div class="relative hidden h-full min-h-[86px] lg:block">
                <div class="absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,transparent,rgba(202,151,78,0.18),transparent)]"></div>
                <div class="heritage-drawing absolute inset-y-0 left-8 right-0 opacity-55"></div>
              </div>
            </div>
          </section>

          <section class="rounded-[22px] border border-[rgba(196,149,80,0.14)] bg-[rgba(10,8,6,0.56)] px-5 py-5 md:px-6 md:py-6 2xl:px-8">
            <div class="mb-4 flex items-center gap-3">
              <h2 class="text-[34px] font-medium tracking-[0.08em] text-[#f1ddb8]">相关本草</h2>
              <span class="h-px flex-1 bg-[linear-gradient(90deg,rgba(202,151,78,0.5),transparent)]"></span>
            </div>

            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <article
                v-for="herb in relatedHerbs"
                :key="herb.name"
                class="group flex items-center gap-4 rounded-[18px] border border-[rgba(196,149,80,0.14)] bg-[linear-gradient(180deg,rgba(28,20,13,0.88),rgba(16,12,8,0.9))] px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(204,161,95,0.26)]"
              >
                <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] border border-[rgba(196,149,80,0.12)] bg-[radial-gradient(circle,rgba(82,58,29,0.32),transparent_70%)]">
                  <img :src="herb.image" :alt="herb.name" class="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div class="min-w-0">
                  <p class="text-[26px] leading-none tracking-[0.06em] text-[#f0dcb8]">{{ herb.name }}</p>
                  <p class="mt-2 text-sm text-[#947b57]">{{ herb.tagline }}</p>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import {
  Box,
  FileText,
  Heart,
  Leaf,
  MessageCircleMore,
  ScrollText,
  Search,
  SendHorizonal,
  Wrench,
} from 'lucide-vue-next'
import { useAvatarSDK } from '@/composables/useAvatarSDK'

const {
  isConnected: avatarConnected,
  isLoading: avatarLoading,
  playNotAllowed: avatarPlayBlocked,
  error: avatarError,
  initAndStart,
  sendText,
  resume: handleResume,
} = useAvatarSDK()

// ---- Avatar lifecycle ----
const avatarWrapper = ref(null)
const avatarContainerRef = ref(null)

const startAvatar = async () => {
  if (!avatarContainerRef.value) return
  await initAndStart(avatarContainerRef.value)
}

// ---- Sidebar ----
const sidebarItems = [
  { key: 'atlas', title: '本草图鉴', subtitle: '药材详解与知识', icon: Leaf, active: true },
  { key: 'classics', title: '经方典籍', subtitle: '经典方剂与解析', icon: ScrollText, active: false },
  { key: 'wellness', title: '养生知识', subtitle: '养生方法与调理', icon: Heart, active: false },
  { key: 'tools', title: '中医工具', subtitle: '常用工具与计算', icon: Wrench, active: false },
]

// ---- Hero herb ----
const heroHerb = {
  name: '人参',
  tag: '补气圣药',
}

// ---- Chat ----
const chatInput = ref('')
const chatInputRef = ref(null)
const chatScrollRef = ref(null)

const formatTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const chatMessages = ref([
  {
    id: 'welcome',
    role: 'assistant',
    time: formatTime(),
    content: '年轻人，你来了。本灵在此等候多时。\n有什么关于本草种植、节气养生的问题，尽管问吧。',
  },
])

const scrollToBottom = async () => {
  await nextTick()
  if (chatScrollRef.value) {
    chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
  }
}

const handleSend = async () => {
  const text = chatInput.value.trim()
  if (!text) return
  chatInput.value = ''

  // Add user message
  chatMessages.value.push({
    id: 'msg_' + Date.now(),
    role: 'user',
    time: formatTime(),
    content: text,
  })
  await scrollToBottom()

  // Send to avatar SDK if connected
  if (avatarConnected.value) {
    try {
      await sendText(text, { nlp: true, interactive_mode: 1 })
    } catch (e) {
      // Fallback: add a simple reply
      chatMessages.value.push({
        id: 'err_' + Date.now(),
        role: 'assistant',
        time: formatTime(),
        content: '本灵暂时无法回应，请稍后再试。',
      })
      await scrollToBottom()
    }
  } else {
    // Offline fallback reply
    const fallbackReplies = [
      '嗯…你问得好。按《本草纲目》所载，此法可行。',
      '俗话说”春生夏长，秋收冬藏”，此时节宜养肝护肝。',
      '此物性味甘温，入脾肺经，乃补气之良药。',
      '本灵观之，此事颇有讲究。待我慢慢道来~',
      '且听本灵一言：养生之道，贵在坚持。',
    ]
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 800))
    chatMessages.value.push({
      id: 'reply_' + Date.now(),
      role: 'assistant',
      time: formatTime(),
      content: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
    })
    await scrollToBottom()
  }
}

const handleQuickPrompt = (prompt) => {
  chatInput.value = prompt
  handleSend()
}

// ---- Quick prompts ----
const quickPrompts = [
  '人参与黄芪有什么区别？',
  '适合哪些体质？',
  '怎么搭配更温和？',
]

// ---- Action items ----
const actionItems = [
  { label: '3D展示', icon: Box },
  { label: '药材鉴别', icon: Search },
  { label: '配伍禁忌', icon: Leaf },
  { label: '相关方剂', icon: FileText },
  { label: '收藏本草', icon: Heart },
]

// ---- Related herbs ----
const relatedHerbs = [
  { name: '黄芪', tagline: '补气固表', image: '/herb-astragalus.png' },
  { name: '灵芝', tagline: '益气安神', image: '/herb-lingzhi.png' },
  { name: '石斛', tagline: '滋阴生津', image: '/herb-dendrobium.png' },
  { name: '枸杞子', tagline: '滋补肝肾', image: '/herb-goji.png' },
  { name: '三七', tagline: '补血活血', image: '/herb-notoginseng.png' },
]
</script>

<style scoped>
.quote-card {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.heritage-panel {
  box-shadow: inset 0 1px 0 rgba(255, 235, 210, 0.03);
}

.heritage-drawing {
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 120'%3E%3Cg fill='none' stroke='%23976f39' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 93c18-6 31-17 40-35 6 12 12 22 18 31 13-26 31-43 55-51 9 18 22 34 38 49 18-29 39-48 62-58 10 19 21 34 33 46 16-17 30-29 41-35 15 18 38 30 69 37'/%3E%3Cpath d='M277 92c6-15 14-30 26-43 10 13 17 26 21 39M303 88c5-11 10-20 18-29M333 92c8-7 13-16 15-26 8 11 18 19 31 24'/%3E%3Cpath d='M351 74c-5-20 4-38 20-49 20 8 35 25 37 46-18 7-39 8-57 3z'/%3E%3Cpath d='M374 26c-8 8-13 16-15 24M385 32c-4 8-6 16-7 24M394 40c-2 5-3 11-3 18'/%3E%3C/g%3E%3C/svg%3E")
      center / contain no-repeat;
}

.avatar-slot {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transform: translateY(-15%) !important;
}
.avatar-slot video,
.avatar-slot canvas,
.avatar-slot img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  transform: translateY(-15%) !important;
}
</style>
