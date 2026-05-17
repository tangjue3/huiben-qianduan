import { ref } from 'vue'

const mockReplies = {
  default: [
    '本灵观之，此事颇有讲究。待我慢慢道来~',
    '嗯…你问得好。按《本草纲目》所载，此法可行。',
    '俗话说"春生夏长，秋收冬藏"，此时节宜…',
    '哈哈哈！你这问题倒是勾起本灵的回忆了。',
    '且听本灵一言：此物性味甘温，入脾肺经，乃补气之良药。',
  ],
  humidity: [
    '棚内湿度偏高，本灵建议开启通风系统，同时减少灌溉量。\n可辅以石灰撒地吸湿，事半功倍。',
    '湿度大则百病生。本灵观天象，今日宜通风降湿，明后日有雨，须提前防范。',
  ],
  health: [
    '按四时节气，此时宜养肝护肝。\n本灵建议：晨起一杯菊花茶，晚食一份枸杞粥。\n切记：少怒多眠，方为养生之道。',
    '养生之道，贵在坚持。本灵活了几百年，全靠"三要"：\n一要饮食有节，二要起居有常，三要情志平和。',
  ],
  herb: [
    '此药性味甘温，归脾肺经。\n功效：补气固表，利尿托毒，排脓，敛疮生肌。\n本灵常用其与当归配伍，气血双补。',
    '嗯…此物确是良药。不过须记住：\n采收以春秋二季为佳，炮制需九蒸九晒。\n否则药效大打折扣！',
  ],
}

const quickQuestions = [
  { id: 'q1', text: '当前湿度偏高怎么办', type: 'humidity' },
  { id: 'q2', text: '今日养生建议', type: 'health' },
  { id: 'q3', text: '讲讲黄芪的功效', type: 'herb' },
  { id: 'q4', text: '如何预防根腐病', type: 'default' },
  { id: 'q5', text: '推荐时令药膳', type: 'health' },
  { id: 'q6', text: '讲讲三七的功效', type: 'herb' },
]

export function useSageAI() {
  const messages = ref([
    {
      id: 'welcome',
      role: 'sage',
      content: '年轻人，你来了。本灵在此等候多时。\n有什么关于本草种植、节气养生的问题，尽管问吧。',
      type: 'text',
      timestamp: Date.now(),
    }
  ])
  const isTyping = ref(false)
  const currentExpression = ref('happy')

  const askQuestion = async (question, type = 'default') => {
    if (!question.trim()) return

    // Add user message
    const userMsg = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: question,
      type: 'text',
      timestamp: Date.now(),
    }
    messages.value.push(userMsg)
    isTyping.value = true
    currentExpression.value = 'think'

    // Simulate API delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))

    // Generate reply
    const replies = mockReplies[type] || mockReplies.default
    const reply = replies[Math.floor(Math.random() * replies.length)]

    const sageMsg = {
      id: 'reply_' + Date.now(),
      role: 'sage',
      content: reply,
      type: 'text',
      timestamp: Date.now(),
    }
    messages.value.push(sageMsg)
    isTyping.value = false
    currentExpression.value = 'happy'
  }

  const getHealthTip = (solarTerm) => {
    if (!solarTerm) return '养生之道，顺应天时。'
    return `时值${solarTerm.name}，${solarTerm.healthTip}`
  }

  const getHerbKnowledge = (herb) => {
    if (!herb) return ''
    return `${herb.name}：${herb.efficacy}`
  }

  return {
    messages, isTyping, currentExpression,
    askQuestion, getHealthTip, getHerbKnowledge,
    quickQuestions,
  }
}
