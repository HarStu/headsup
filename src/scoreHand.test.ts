import type { Card, Suit, Rank, HandRank, HandScore } from './scoreHand.ts'
import { checkPair, HandRanks } from './scoreHand.ts'
import { test, expect } from 'vitest'

// utility function for quickly returning an array of cards for testing
function generateCards(cardString: string): Card[] {
  let retRank: Rank | 0 = 0;
  let retSuit: Suit | '' = '';
  const retCards: Card[] = []
  for (let char of cardString) {
    if ([0, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(char))) {
      retRank += Number(char)
    } else if (char === '1') {
      retRank += 10;
    } else if (['h', 'd', 'c', 's'].includes(char)) {
      retSuit = char as Suit;
      retCards.push({ rank: retRank as Rank, suit: retSuit as Suit })
      retRank = 0
      retSuit = ''
    } else if (char === ' ') {
      ;
    } else {
      throw new Error(`Invalid cardString! Issue with ${char}`)
    }
  }
  return retCards
}

// checkPair tests
test('checkPair: should return a 10 pair', () => {
  const testCards = generateCards('5h 6h 7h 8c 9c 10h 10c')

  const result = checkPair(testCards)
  const desiredHandRank = HandRanks.Pair
  const desiredCardRank = [10]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkPair tests
test('checkPair: should return a 10 pair', () => {
  const testCards = generateCards('5h 6h 7h 8c 10c 10h 10c')

  const result = checkPair(testCards)
  const desiredHandRank = HandRanks.Pair
  const desiredCardRank = [10]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkPair tests
test('checkPair: should return a 10 pair', () => {
  const testCards = generateCards('5h 6h 7h 8c 10c 10h 10c')

  const result = checkPair(testCards, 3)
  const desiredHandRank = HandRanks.ThreePair
  const desiredCardRank = [10]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})
