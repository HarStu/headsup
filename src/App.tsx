import { useState, useEffect } from 'react'
import type { Hand } from './game.ts'
import { generateHand } from './game.ts'
import './App.css'



function App() {

  const [hand, setHand] = useState(generateHand())

  return (
    <div>
      {JSON.stringify(hand)}
    </div>
  )

}

export default App
