import { useState, useEffect } from 'react'
import type { Hand, Act } from './game.ts'
import { generateHand, processAction } from './game.ts'
import './App.css'



function App() {

  const [hand, setHand] = useState(generateHand())

  const playersAndBoardRowClass = "flex flex-row basis-1/4"
  const playerInfoClass = "flex w-[20%] items-center justify-center text-center"
  const boardClass = "flex flex-col flex-grow items-center justify-center"
  const buttonRowClass = "flex flex-row basis-1/8 items-center justify-center"
  const buttonGridClass = "grid grid-cols-4 gap-4 max-w-fit h-11/20"
  const buttonClass = "flex aspect-square w-full h-full items-center justify-center text-xs outline outline-2"
  const contextRowClass = "flex flex-col basis-1/8 items-center justify-center"

  // utility function to take a given act
  const takeAction = (hand: Hand, act: Act) => {
    if (hand.actionOn === 1) {
      console.log(`Player 1 doing a ${act}`)
      setHand(processAction(hand, { 'act': act, wager: hand.p1.wager }))
    } else {
      console.log(`Player 2 doing a ${act}`)
      setHand(processAction(hand, { 'act': act, wager: hand.p2.wager }))
    }
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      {/* Row containing the player information, with the board cards between them*/}
      <div className={playersAndBoardRowClass}>
        <div className={playerInfoClass + " outline outline-amber-600"}>
          {JSON.stringify(hand.p1.holeCards) + JSON.stringify(hand.p1.stack)}
        </div>
        <div className={boardClass}>
          <div>
            {JSON.stringify(hand.board)}
          </div>
          <div>
            {`Current Pot: ${hand.pot}`}
          </div>
        </div>
        <div className={playerInfoClass + " outline outline-green-600"}>
          {JSON.stringify(hand.p2.holeCards) + JSON.stringify(hand.p2.stack)}
        </div>
      </div>
      {/* Row containing buttons */}
      <div className={buttonRowClass + " outline"}>
        <div className={buttonGridClass}>
          <div className={buttonClass + " outline-blue-400"} onClick={() => takeAction(hand, 'check')}>
            check
          </div>
          <div className={buttonClass + " outline-green-400"} onClick={() => takeAction(hand, 'call')}>
            call
          </div>
          <div className={buttonClass + " outline-red-400"} onClick={() => takeAction(hand, 'raise')}>
            raise
          </div>
          <div className={buttonClass + " outline-purple-400"} onClick={() => takeAction(hand, 'fold')}>
            fold
          </div>
        </div>
      </div>
      {/* Row containing information about the current context of the game*/}
      <div className={contextRowClass + " outline"}>
        <div>
          {hand.context}
        </div>
        <div>
          {`It is current player ${hand.actionOn}'s turn`}
        </div>
      </div>
    </div >
  )

}

export default App
