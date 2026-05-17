<template>
  <div class="px-4 py-3 h-full flex flex-col relative overflow-hidden">
    <!-- Background image (original style) -->
    <div class="absolute inset-0 bg-[url('/hui-background1.jpg')] bg-cover bg-center brightness-110 pointer-events-none"></div>
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ffff] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

    <!-- Monitor mode tabs -->
    <div class="flex justify-center mb-3 shrink-0 relative z-10">
      <div class="bg-[#021124]/80 backdrop-blur-md border border-[var(--color-border)] rounded-xl p-1.5 flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          class="px-8 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-300"
          :class="currentTab === tab.key
            ? 'bg-gradient-to-r from-[var(--color-cyan-glow)] to-[var(--color-jade-light)] text-[#021124] shadow-[0_0_20px_rgba(0,255,204,0.4)]'
            : 'text-[var(--color-cyan-glow)] hover:bg-[var(--color-cyan-dim)]'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Monitor Content -->
    <div class="flex-1 flex flex-col min-h-0 relative z-10">
      <GreenhousePanel v-if="currentTab === 'greenhouse'" />
      <OpenFieldPanel v-else />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GreenhousePanel from '@/modules/greenhouse/GreenhousePanel.vue'
import OpenFieldPanel from '@/modules/openfield/OpenFieldPanel.vue'

const currentTab = ref('greenhouse')
const tabs = [
  { key: 'greenhouse', label: '🌿 有棚区' },
  { key: 'openfield', label: '🌾 无棚区' },
]
</script>
