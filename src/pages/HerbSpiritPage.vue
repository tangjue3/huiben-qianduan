<template>
  <div class="herb-spirit-page">
    <!-- Background ambiance -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[var(--color-jade)] blur-[200px] opacity-[0.04]"></div>
      <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--color-cyan-glow)] blur-[150px] opacity-[0.03]"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[var(--color-gold)] blur-[250px] opacity-[0.015]"></div>
      <!-- Floating particles -->
      <div v-for="i in 12" :key="'p'+i" class="absolute w-1 h-1 rounded-full bg-[var(--color-cyan-glow)]"
           :style="particleStyle(i)"></div>
    </div>

    <div class="relative z-10 h-full flex flex-col">
      <!-- ===== TOP BAR ===== -->
      <div class="shrink-0 flex items-center px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]/40 backdrop-blur-xl">
        <!-- Tabs -->
        <div class="flex items-center gap-1">
          <button v-for="tab in tabs" :key="tab.key"
                  @click="activeTab = tab.key"
                  class="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group"
                  :class="activeTab === tab.key
                    ? 'text-[var(--color-cyan-glow)]'
                    : 'text-gray-500 hover:text-gray-300'">
            <span class="relative z-10 flex items-center gap-2">
              <span class="text-base">{{ tab.icon }}</span>
              <span class="hidden sm:inline">{{ tab.label }}</span>
            </span>
            <div v-if="activeTab === tab.key"
                 class="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--color-cyan-glow)]/10 to-transparent border border-[var(--color-border)]">
            </div>
          </button>
        </div>

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Right status -->
        <div class="flex items-center gap-4">
          <!-- Voice toggle -->
          <button @click="toggleVoice"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
                  :class="voiceEnabled
                    ? 'bg-[var(--color-cyan-dim)] text-[var(--color-cyan-glow)] border border-[var(--color-border)]'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span class="hidden sm:inline text-xs">{{ voiceEnabled ? '语音中' : '语音' }}</span>
          </button>

          <!-- Status chips -->
          <div class="hidden md:flex items-center gap-2">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-cyan-dim)] border border-[var(--color-border)]">
              <span class="text-xs">{{ currentTerm?.icon || '🍃' }}</span>
              <span class="text-xs text-[var(--color-text-secondary)]">{{ currentTerm?.name || '立夏' }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-[var(--color-border)]">
              <span class="text-xs text-[var(--color-gold)]">☀️</span>
              <span class="text-xs text-[var(--color-text-secondary)]">26°</span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 border border-[var(--color-border)]">
              <span class="text-xs text-[var(--color-cyan-glow)]">🌡️</span>
              <span class="text-xs text-[var(--color-text-secondary)]">28°</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="flex-1 flex min-h-0">
        <!-- Left: Content area (65%) -->
        <div class="flex-1 flex flex-col min-w-0 relative">
          <!-- Background pattern for content area -->
          <div class="absolute inset-0 opacity-[0.015] pointer-events-none"
               style="background-image: radial-gradient(circle at 1px 1px, var(--color-cyan-glow) 1px, transparent 0); background-size: 40px 40px;">
          </div>

          <!-- Tab content with transition -->
          <div class="relative z-10 flex-1 flex flex-col min-h-0">
            <transition name="tab-switch" mode="out-in">
              <!-- Chat -->
              <div v-if="activeTab === 'chat'" key="chat" class="flex-1 flex flex-col min-h-0">
                <SageChat :messages="messages" :is-typing="isTyping"
                          :quick-questions="quickQuestions" :expression="currentExpression"
                          @ask="handleAsk" />
              </div>

              <!-- Solar Term Wheel -->
              <div v-else-if="activeTab === 'solar'" key="solar" class="flex-1 overflow-y-auto custom-scrollbar p-6">
                <SolarTermWheel />
              </div>

              <!-- Herb Guide -->
              <div v-else-if="activeTab === 'herb'" key="herb" class="flex-1 overflow-y-auto custom-scrollbar p-6">
                <HerbGuide />
              </div>

              <!-- Alert -->
              <div v-else key="alert" class="flex-1 flex items-center justify-center p-6">
                <div class="text-center max-w-md">
                  <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 flex items-center justify-center">
                    <svg class="w-9 h-9 text-green-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="text-base font-bold text-white/60 mb-2">一切安好</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">
                    当前无告警信息。百草通灵日夜守护，众生平安。<br>
                    若遇异常，本灵自会第一时间告知。
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Right: Sage Panel (35%) -->
        <div class="hidden lg:flex w-[420px] shrink-0 flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-panel)]/20 relative overflow-hidden">
          <!-- Sage ambient glow -->
          <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
               :style="sageGlowStyle"></div>

          <div class="relative z-10 flex-1 flex flex-col items-center justify-start px-6 pt-8 pb-4">
            <!-- Sage Character -->
            <SageCharacter :expression="currentExpression" />

            <!-- Divider -->
            <div class="w-3/4 h-px my-5 bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent"></div>

            <!-- Current Status -->
            <div class="w-full max-w-[220px] space-y-2">
              <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-black/30 border border-[var(--color-border)]">
                <span class="text-xs text-gray-500">时节</span>
                <span class="text-xs text-white flex items-center gap-1.5">
                  <span>{{ currentTerm?.icon }}</span>
                  {{ currentTerm?.name }}
                </span>
              </div>
              <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-black/30 border border-[var(--color-border)]">
                <span class="text-xs text-gray-500">天气</span>
                <span class="text-xs text-[var(--color-gold)]">☀️ 晴 26°C</span>
              </div>
              <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-black/30 border border-[var(--color-border)]">
                <span class="text-xs text-gray-500">棚内温度</span>
                <span class="text-xs text-[var(--color-cyan-glow)]">🌡️ 28°C</span>
              </div>
              <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-black/30 border border-[var(--color-border)]">
                <span class="text-xs text-gray-500">棚内湿度</span>
                <span class="text-xs text-[var(--color-jade-light)]">💧 65%</span>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-2 mt-5">
              <button v-for="act in quickActions" :key="act.key"
                      @click="activeTab = act.key"
                      class="w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all duration-300 hover:scale-110"
                      :class="activeTab === act.key
                        ? 'bg-[var(--color-cyan-dim)] text-[var(--color-cyan-glow)] border border-[var(--color-border)] shadow-[0_0_15px_rgba(0,255,204,0.1)]'
                        : 'bg-black/30 text-gray-500 border border-[var(--color-border)] hover:text-white hover:bg-white/5'"
                      :title="act.label">
                {{ act.icon }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSageAI } from '@/composables/useSageAI'
import { currentSolarTerm } from '@/data/solarTerms'
import Footer from '@/components/Footer.vue'
import SageCharacter from '@/modules/herbsage/SageCharacter.vue'
import SageChat from '@/modules/herbsage/SageChat.vue'
import SolarTermWheel from '@/modules/herbsage/SolarTermWheel.vue'
import HerbGuide from '@/modules/herbsage/HerbGuide.vue'

const { messages, isTyping, currentExpression, askQuestion, quickQuestions } = useSageAI()
const activeTab = ref('chat')
const voiceEnabled = ref(false)
const currentTerm = currentSolarTerm()

const tabs = [
  { key: 'chat', label: '对话', icon: '💬' },
  { key: 'solar', label: '节气', icon: '🍃' },
  { key: 'herb', label: '本草', icon: '📖' },
  { key: 'alert', label: '告警', icon: '🔔' },
]

const quickActions = [
  { key: 'solar', label: '节气轮盘', icon: '🍃' },
  { key: 'herb', label: '本草图鉴', icon: '📖' },
  { key: 'alert', label: '告警', icon: '🔔' },
]

const handleAsk = (text, type) => { askQuestion(text, type || 'default') }

const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value
  if (voiceEnabled.value) {
    const u = new SpeechSynthesisUtterance('本灵在呢')
    u.lang = 'zh-CN'
    u.rate = 0.9
    speechSynthesis.speak(u)
  } else {
    speechSynthesis.cancel()
  }
}

const sageGlowStyle = computed(() => {
  const glowMap = {
    happy: 'rgba(0,255,204,0.08)',
    think: 'rgba(196,168,106,0.08)',
    surprise: 'rgba(255,204,0,0.08)',
    worry: 'rgba(255,51,102,0.06)',
  }
  const color = glowMap[currentExpression.value] || 'rgba(0,255,204,0.08)'
  return {
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  }
})

const particleStyle = (i) => {
  const seed = i * 37
  return {
    left: `${(seed * 0.618) % 100}%`,
    top: `${(seed * 0.382) % 100}%`,
    width: `${2 + (i % 3)}px`,
    height: `${2 + (i % 3)}px`,
    opacity: 0.1 + (i % 4) * 0.05,
    animation: `float-particle ${8 + (i % 5) * 2}s ease-in-out ${i * 0.7}s infinite alternate`,
    filter: 'blur(0.5px)',
  }
}
</script>

<style scoped>
.herb-spirit-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

@keyframes float-particle {
  0% { transform: translateY(0) translateX(0); opacity: 0.1; }
  50% { transform: translateY(-30px) translateX(10px); opacity: 0.3; }
  100% { transform: translateY(-10px) translateX(-5px); opacity: 0.15; }
}

/* Tab switch transition */
.tab-switch-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.tab-switch-leave-active {
  transition: all 0.2s ease;
}
.tab-switch-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.tab-switch-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(1.01);
}
</style>
