import { useState, useEffect } from 'react'
import type { Hand } from './game.ts'
import { generateHand } from './game.ts'
import './App.css'



function App() {

  const [hand, setHand] = useState(generateHand())

  const playersAndBoardRowClass = "flex flex-row basis-1/4"
  const playerInfoClass = "flex w-[20%] items-center justify-center text-center"
  const boardClass = "flex flex-grow items-center justify-center"
  const buttonRowClass = "flex flex-row basis-1/8 items-center justify-center"
  const contextRowClass = "flex basis-1/8 items-center justify-center"

  return (
    <div className="flex flex-col w-screen h-screen">
      {/* Row containing the player information, with the board cards between them*/}
      <div className={playersAndBoardRowClass}>
        <div className={playerInfoClass + " outline outline-amber-600"}>
          {JSON.stringify(hand.p1.holeCards) + JSON.stringify(hand.p1.stack)}
        </div>
        <div className={boardClass}>
          {JSON.stringify(hand.board)}
        </div>
        <div className={playerInfoClass + " outline outline-green-600"}>
          {JSON.stringify(hand.p2.holeCards) + JSON.stringify(hand.p2.stack)}
        </div>
      </div>
      {/* Row containing buttons */}
      <div className={buttonRowClass + " outline"}>
        Placeholder
      </div>
      {/* Row containing information about the current context of the game*/}
      <div className={contextRowClass + " outline"}>
        {hand.context}
      </div>
    </div >
  )

}

export default App
