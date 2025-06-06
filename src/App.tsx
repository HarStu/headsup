import { useState, useEffect } from 'react'
import clsx from 'clsx'
import type { Hand, Act, illegalAct } from './game.ts'
import { generateHand, processAction } from './game.ts'
import './App.css'



function App() {

  const [hand, setHand] = useState(generateHand())
  const [proposedWager, setProposedWager] = useState(0)

  const playersAndBoardRowClass = "flex flex-row basis-1/4"
  const playerInfoClass = "flex w-[20%] items-center justify-center text-center"
  const boardClass = "flex flex-col flex-grow items-center justify-center"
  const buttonRowClass = "flex flex-row basis-1/8 items-center justify-center"
  const buttonGridClass = "grid grid-cols-4 gap-4 max-w-fit h-11/20"
  const buttonClass = "flex aspect-square w-full h-full items-center justify-center text-xs outline outline-2"
  const wagerRowClass = "flex flex-row basis-1/18 items-center justify-center"
  const contextRowClass = "flex flex-col basis-1/6 items-center justify-center"

  // helper function wrapping processAction
  const doAct = (playerAct: Act) => {
    setHand(processAction(hand, { act: playerAct, wager: proposedWager }))
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      {/* Row containing the player information, with the board cards between them*/}
      <div className={playersAndBoardRowClass}>
        <div className={playerInfoClass + " outline outline-amber-600"}>
          {JSON.stringify(hand.p1.holeCards) + JSON.stringify(hand.p1.stack) + ', ' + JSON.stringify(hand.p1.totalWager)}
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
          {JSON.stringify(hand.p2.holeCards) + JSON.stringify(hand.p2.stack) + ', ' + JSON.stringify(hand.p2.totalWager)}
        </div>
      </div>
      {/* Row containing buttons */}
      <div className={buttonRowClass + " outline"}>
        <div className={buttonGridClass}>
          <div className={buttonClass + " outline-blue-400"} onClick={() => doAct('check')}>
            check
          </div>
          <div className={buttonClass + " outline-green-400"} onClick={() => doAct('call')}>
            call
          </div>
          <div className={buttonClass + " outline-red-400"} onClick={() => doAct('raise')}>
            raise
          </div>
          <div className={buttonClass + " outline-purple-400"} onClick={() => doAct('fold')}>
            fold
          </div>
        </div>
      </div>
      {/* Row containing the wager controls */}
      <div className={wagerRowClass}>
        <input className={clsx("outline", hand.error === 'invalid wager' && "outline-red-600")} type="number" value={proposedWager} onChange={(e) => setProposedWager(Number(e.target.value))} />
      </div>
      {/* Row containing information about the current context of the game*/}
      <div className={contextRowClass + " outline"}>
        <div>
          {hand.context}
        </div>
        <div>
          {hand.winner == 'undetermined' ? `Action on player ${hand.actionOn}. Current street: ${hand.street}` : `Player ${hand.winner} wins the hand`}
        </div>
        <div>
          {hand.error !== "na" && hand.error}
        </div>
      </div>
    </div >
  )

}

export default App
