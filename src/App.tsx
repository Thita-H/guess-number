import { useState } from 'react'
import './App.css'
import SpaceBackground from './SpaceBackground'
import EnergyOrb from './EnergyOrb'
import NumericKeypad from './NumericKeypad'
import { soundEffects } from './utils/soundEffects'

type GameStatus = 'playing' | 'won' | 'gameOver'
type Feedback = 'higher' | 'lower' | null

function App() {
  const generateRandomNumber = (): number => {
    return Math.floor(Math.random() * 100) + 1
  }

  const [hasStarted, setHasStarted] = useState<boolean>(false)
  const [targetNumber, setTargetNumber] = useState<number>(() => generateRandomNumber())
  const [attemptsLeft, setAttemptsLeft] = useState<number>(10)
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [totalCorns, setTotalCorns] = useState<number>(0)
  const [burntCorns, setBurntCorns] = useState<number>(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [distance, setDistance] = useState<number>(100)
  const [orbActive, setOrbActive] = useState<boolean>(false)
  const [lastGuess, setLastGuess] = useState<number>(0)
  const [gamesPlayed, setGamesPlayed] = useState<number>(0)

  const handleStartGame = () => {
    soundEffects.playStartClick()
    setHasStarted(true)
  }

  const calculateCornReward = (attemptsUsed: number): number => {
    if (attemptsUsed === 1) return 3
    if (attemptsUsed <= 3) return 2
    return 1
  }

  const getHintMessage = (distance: number, guess: number): string => {
    const direction = guess < targetNumber ? 'สูงกว่า' : 'ต่ำกว่า'

    if (distance < 5) {
      return `${direction} - ใกล้มากๆ! 🔥`
    } else if (distance < 10) {
      return `${direction} - ใกล้แล้ว! ⚡`
    } else if (distance < 25) {
      return `${direction} - ค่อนข้างใกล้ 💫`
    } else if (distance < 50) {
      return `${direction} - ไกลพอสมควร 🌟`
    } else {
      return `${direction} - ไกลมาก ❄️`
    }
  }

  const handleGuess = (guessValue: string) => {
    const guess = parseInt(guessValue)

    if (isNaN(guess) || guess < 1 || guess > 100) {
      return
    }

    setLastGuess(guess)
    const attemptsUsed = 11 - attemptsLeft
    const newDistance = Math.abs(targetNumber - guess)
    setDistance(newDistance)
    setOrbActive(true)

    // เล่นเสียงลูกแก้วตามระยะห่าง
    if (guess === targetNumber) {
      soundEffects.playWinSound()
    } else if (newDistance < 10) {
      soundEffects.playOrbVeryClose()
    } else if (newDistance < 25) {
      soundEffects.playOrbClose()
    } else if (newDistance < 50) {
      soundEffects.playOrbMedium()
    } else {
      soundEffects.playOrbFar()
    }

    setTimeout(() => setOrbActive(false), 1000)

    if (guess === targetNumber) {
      const reward = calculateCornReward(attemptsUsed)
      setTotalCorns(prev => prev + reward)
      setGameStatus('won')
      setFeedback(null)
    } else {
      const newAttemptsLeft = attemptsLeft - 1
      setAttemptsLeft(newAttemptsLeft)
      setBurntCorns(prev => prev + 1)

      if (newAttemptsLeft === 0) {
        soundEffects.playLoseSound()
        setGameStatus('gameOver')
        setFeedback(null)
      } else {
        setFeedback(guess < targetNumber ? 'higher' : 'lower')
      }
    }
  }

  const handlePlayAgain = () => {
    soundEffects.playActionClick()
    setTargetNumber(generateRandomNumber())
    setAttemptsLeft(10)
    setBurntCorns(0)
    setGameStatus('playing')
    setFeedback(null)
    setDistance(100)
    setOrbActive(false)
    setGamesPlayed(prev => prev + 1)
  }

  const handleRestart = () => {
    soundEffects.playActionClick()
    setTargetNumber(generateRandomNumber())
    setAttemptsLeft(10)
    setBurntCorns(0)
    setGameStatus('playing')
    setFeedback(null)
    setDistance(100)
    setOrbActive(false)
    setGamesPlayed(prev => prev + 1)
  }

  const renderBurntCorns = () => {
    return Array(burntCorns).fill('💀').join(' ')
  }

  return (
    <div className="app">
      <SpaceBackground />

      {!hasStarted ? (
        <div className="start-screen">
          <h1 className="start-title">🌌 ภารกิจทายเลขแห่งจักรวาล 🌌</h1>
          <p className="start-subtitle">ทายตัวเลขมหัศจรรย์</p>
          <div className="start-instructions">
            <h2>วิธีการเล่น:</h2>
            <ul>
              <li>ทายตัวเลขระหว่าง 1 ถึง 100</li>
              <li>คุณมี 10 ครั้งในการทาย</li>
              <li>ลูกแก้วจักรวาลจะตอบสนองตามความใกล้ของคุณกับตัวเลข</li>
              <li>ยิ่งคุณใกล้มากเท่าไหร่ มันจะยิ่งเปล่งแสงสีเขียวมากขึ้น</li>
              <li>รางวัล: ทายถูกครั้งแรก = 3⭐, ครั้งที่ 2-3 = 2⭐, ครั้งที่ 4-10 = 1⭐</li>
            </ul>
          </div>
          <button onClick={handleStartGame} className="start-button">
            เริ่มเกม
          </button>
        </div>
      ) : (
        <>
          <header className="header">
            <div className="total-corns">ดาวที่สะสม: {totalCorns} ⭐</div>
          </header>

          <main className="game-container">
            {gameStatus === 'playing' && (
              <>
                <div className="energy-orb-container">
                  <EnergyOrb distance={distance} isActive={orbActive} />
                  {burntCorns > 0 && (
                    <div className="burnt-corns">{renderBurntCorns()}</div>
                  )}
                </div>

                <h1 className="game-title">🔮 ถามลูกแก้วจักรวาล 🔮</h1>

                <div className="attempts-left">
                  จำนวนครั้งที่เหลือ: {attemptsLeft}
                </div>

                <NumericKeypad onSubmit={handleGuess} />

                {feedback && (
                  <div className="hint-container">
                    <div className="hint-message">
                      {getHintMessage(distance, lastGuess)}
                    </div>
                  </div>
                )}
              </>
            )}

            {gameStatus === 'won' && (
              <div className="result-screen won-screen">
                <h1>🎉 ชนะแล้ว! 🎉</h1>
                <p className="result-message">คุณทายตัวเลขมหัศจรรย์ได้!</p>
                <p className="reward-message">
                  รางวัล: {calculateCornReward(11 - attemptsLeft)} ⭐
                </p>
                <button onClick={handlePlayAgain} className="action-button">
                  เล่นต่อ
                </button>
              </div>
            )}

            {gameStatus === 'gameOver' && (
              <div className="result-screen gameover-screen">
                <h1>💫 จบเกม</h1>
                <p className="result-message">คุณใช้โอกาสหมดแล้ว</p>
                <p className="answer-reveal">ตัวเลขที่ถูกต้องคือ: {targetNumber}</p>
                <button onClick={handleRestart} className="action-button">
                  เริ่มใหม่
                </button>
              </div>
            )}
          </main>

          <footer className="footer">
            <div className="collected-corns">
              <p className="collected-title">จำนวนครั้งที่เล่น: {gamesPlayed}</p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

export default App
