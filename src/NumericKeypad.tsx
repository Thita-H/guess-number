import { useState } from 'react'
import './NumericKeypad.css'

interface NumericKeypadProps {
  onSubmit: (value: string) => void
}

const NumericKeypad = ({ onSubmit }: NumericKeypadProps) => {
  const [display, setDisplay] = useState<string>('')

  const handleNumberClick = (num: string) => {
    if (display.length < 3) {
      setDisplay(display + num)
    }
  }

  const handleClear = () => {
    setDisplay('')
  }

  const handleDelete = () => {
    setDisplay(display.slice(0, -1))
  }

  const handleSubmit = () => {
    if (display !== '') {
      onSubmit(display)
      setDisplay('')
    }
  }

  return (
    <div className="numeric-keypad">
      <div className="keypad-display">
        {display || '...'}
      </div>

      <div className="keypad-grid">
        <button onClick={() => handleNumberClick('1')} className="keypad-button">1</button>
        <button onClick={() => handleNumberClick('2')} className="keypad-button">2</button>
        <button onClick={() => handleNumberClick('3')} className="keypad-button">3</button>
        <button onClick={handleClear} className="keypad-button keypad-clear">C</button>

        <button onClick={() => handleNumberClick('4')} className="keypad-button">4</button>
        <button onClick={() => handleNumberClick('5')} className="keypad-button">5</button>
        <button onClick={() => handleNumberClick('6')} className="keypad-button">6</button>
        <button onClick={handleDelete} className="keypad-button keypad-delete">⌫</button>

        <button onClick={() => handleNumberClick('7')} className="keypad-button">7</button>
        <button onClick={() => handleNumberClick('8')} className="keypad-button">8</button>
        <button onClick={() => handleNumberClick('9')} className="keypad-button">9</button>
        <button onClick={handleSubmit} className="keypad-button keypad-ok-inline" disabled={display === ''}>OK</button>

        <button onClick={() => handleNumberClick('0')} className="keypad-button keypad-zero">0</button>
      </div>
    </div>
  )
}

export default NumericKeypad
