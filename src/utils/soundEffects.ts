// Sound effects utility using Web Audio API - Space Theme
class SoundEffects {
  private audioContext: AudioContext | null = null

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // เสียงสแกนอวกาศ - ใกล้มาก (< 10) - เสียงพัลส์เร็วมาก
  playOrbVeryClose() {
    const ctx = this.getAudioContext()

    // เสียงพัลส์เร็วแบบสแกนเนอร์
    for (let i = 0; i < 8; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 800 + Math.sin(i) * 200
      oscillator.type = 'square'

      const startTime = ctx.currentTime + i * 0.04
      gainNode.gain.setValueAtTime(0.15, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.03)
    }
  }

  // เสียงสัญญาณอวกาศ - ใกล้ (< 25) - เสียงพัลส์ปานกลาง
  playOrbClose() {
    const ctx = this.getAudioContext()

    for (let i = 0; i < 4; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 600 + i * 100
      oscillator.type = 'square'

      const startTime = ctx.currentTime + i * 0.08
      gainNode.gain.setValueAtTime(0.12, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.06)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.06)
    }
  }

  // เสียงโซนาร์อวกาศ - ปานกลาง (< 50)
  playOrbMedium() {
    const ctx = this.getAudioContext()

    for (let i = 0; i < 2; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 400 - i * 50
      oscillator.type = 'sawtooth'

      const startTime = ctx.currentTime + i * 0.15
      gainNode.gain.setValueAtTime(0.1, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.12)
    }
  }

  // เสียงสัญญาณไกล - ไกล (>= 50)
  playOrbFar() {
    const ctx = this.getAudioContext()

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 250
    oscillator.type = 'triangle'

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }

  // เสียงพลังงานชาร์จ - ชนะ! (เหมือนเครื่องยนต์วาร์ป)
  playWinSound() {
    const ctx = this.getAudioContext()

    // เสียงพลังงานชาร์จขึ้น
    const oscillator1 = ctx.createOscillator()
    const gainNode1 = ctx.createGain()

    oscillator1.connect(gainNode1)
    gainNode1.connect(ctx.destination)

    oscillator1.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5)
    oscillator1.type = 'sawtooth'

    gainNode1.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    oscillator1.start(ctx.currentTime)
    oscillator1.stop(ctx.currentTime + 0.5)

    // เสียงระเบิดพลังงาน
    for (let i = 0; i < 3; i++) {
      const oscillator2 = ctx.createOscillator()
      const gainNode2 = ctx.createGain()

      oscillator2.connect(gainNode2)
      gainNode2.connect(ctx.destination)

      oscillator2.frequency.value = 1200 - i * 200
      oscillator2.type = 'square'

      const startTime = ctx.currentTime + 0.5 + i * 0.1
      gainNode2.gain.setValueAtTime(0.15, startTime)
      gainNode2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

      oscillator2.start(startTime)
      oscillator2.stop(startTime + 0.2)
    }
  }

  // เสียงระบบล้มเหลว - แพ้ (เหมือนเครื่องยนต์ดับ)
  playLoseSound() {
    const ctx = this.getAudioContext()

    // เสียงพลังงานลดลง
    const oscillator1 = ctx.createOscillator()
    const gainNode1 = ctx.createGain()

    oscillator1.connect(gainNode1)
    gainNode1.connect(ctx.destination)

    oscillator1.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8)
    oscillator1.type = 'sawtooth'

    gainNode1.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)

    oscillator1.start(ctx.currentTime)
    oscillator1.stop(ctx.currentTime + 0.8)

    // เสียงสัญญาณเตือน
    for (let i = 0; i < 2; i++) {
      const oscillator2 = ctx.createOscillator()
      const gainNode2 = ctx.createGain()

      oscillator2.connect(gainNode2)
      gainNode2.connect(ctx.destination)

      oscillator2.frequency.value = 300
      oscillator2.type = 'square'

      const startTime = ctx.currentTime + 0.8 + i * 0.2
      gainNode2.gain.setValueAtTime(0.1, startTime)
      gainNode2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

      oscillator2.start(startTime)
      oscillator2.stop(startTime + 0.15)
    }
  }

  // เสียงระบบเริ่มทำงาน - เริ่มเกม (เหมือนคอมพิวเตอร์บูท)
  playStartClick() {
    const ctx = this.getAudioContext()

    // เสียงสแกนระบบ
    const oscillator1 = ctx.createOscillator()
    const gainNode1 = ctx.createGain()

    oscillator1.connect(gainNode1)
    gainNode1.connect(ctx.destination)

    oscillator1.frequency.setValueAtTime(300, ctx.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3)
    oscillator1.type = 'square'

    gainNode1.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator1.start(ctx.currentTime)
    oscillator1.stop(ctx.currentTime + 0.3)

    // เสียงยืนยัน
    const oscillator2 = ctx.createOscillator()
    const gainNode2 = ctx.createGain()

    oscillator2.connect(gainNode2)
    gainNode2.connect(ctx.destination)

    oscillator2.frequency.value = 800
    oscillator2.type = 'sine'

    const startTime2 = ctx.currentTime + 0.35
    gainNode2.gain.setValueAtTime(0.12, startTime2)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, startTime2 + 0.15)

    oscillator2.start(startTime2)
    oscillator2.stop(startTime2 + 0.15)
  }

  // เสียงระบบรีเซ็ต - Play Again/Restart
  playActionClick() {
    const ctx = this.getAudioContext()

    // เสียงสวิตช์อิเล็กทรอนิกส์
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }
}

export const soundEffects = new SoundEffects()
