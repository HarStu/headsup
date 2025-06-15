import type { Card, Suit, Rank, HandRank, HandScore } from './scoreHand.ts'
import {
  checkPair,
  checkTwoPair,
  checkStraight,
  checkFlush,
  checkFullHouse,
  checkStraightFlush,
  HandRanks
} from './scoreHand.ts'
import { test, expect } from 'vitest'

// utility function for quickly returning an array of cards for testing
// ERROR -- CURRENTLY BROKEN FOR 11 (jack)
// I think everything else is fine? 
// This is a one-off utility function, so it's probably ok for now
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
    } else if (!(char === ' ')) {
      throw new Error(`Invalid cardString! Issue with ${char}`)
    }
  }
  return retCards.sort((a, b) => b.rank - a.rank)
}

// checkPair test
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

// checkPair test
test('checkPair: usedcards + leftovers should equal cards passed', () => {
  const testCards = generateCards('5h 6h 7h 8c 10c 10h 10c 12h 5c')

  const result = checkPair(testCards)
  const desiredHandRank = HandRanks.Pair
  const desiredCardRank = [10]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
    const allCardsSet = new Set([...result.usedCards, ...result.leftovers!])
    const testCardsSet = new Set(testCards)
    expect(allCardsSet).toStrictEqual(testCardsSet)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkPair test
test('checkPair: usedcards + leftovers should equal cards passed', () => {
  const testCards = generateCards('5h 5c 5s 5d 10h 10d')

  const result = checkPair(testCards)
  const desiredHandRank = HandRanks.Pair
  const desiredCardRank = [10]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
    const allCardsSet = new Set([...result.usedCards, ...result.leftovers!])
    const testCardsSet = new Set(testCards)
    expect(allCardsSet).toStrictEqual(testCardsSet)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkPair test
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

// checkPair test
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

// checkStraight test
test('checkStraight: should return a 10-high straight', () => {
  const testCards = generateCards('7c 9h 8h 10h 6c 3h 2c')

  const result = checkStraight(testCards)
  const desiredHandRank = HandRanks.Straight
  const desiredCardRank = [10]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkStraight test
test('checkStraight: should return an 8-high straight', () => {
  const testCards = generateCards('8h 7h 7d 7c 6h 5d 4c')

  const result = checkStraight(testCards)
  const desiredHandRank = HandRanks.Straight
  const desiredCardRank = [8]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkStraight test
test('checkStraight: should return a 5-high straight', () => {
  const testCards = generateCards('14h 9h 8h 5c 4c 3h 2c')

  const result = checkStraight(testCards)
  const desiredHandRank = HandRanks.Straight
  const desiredCardRank = [5]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})


// checkStraight test
test('checkStraight: should return a 9-high straight', () => {
  const testCards = generateCards('9h 8h 7h 6c 5c 4h 3c')

  const result = checkStraight(testCards)
  const desiredHandRank = HandRanks.Straight
  const desiredCardRank = [9]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkFlush test
test('checkFlush: should return a 9-high flush', () => {
  const testCards = generateCards('9h 8h 7h 6h 5c 4h 3c')

  const result = checkFlush(testCards)
  const desiredHandRank = HandRanks.Flush
  const desiredCardRank = [9]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkFlush test
test('checkFlush: should return false', () => {
  const testCards = generateCards('3h 8h 7h 6c 5c 4h 3c')

  const result = checkFlush(testCards)

  expect(result).toStrictEqual(false)
})

// checkStraightFlush test
test('checkStraightFlush: should return a 9-high straight flush', () => {
  const testCards = generateCards('9h 8h 7h 6h 5h 4c 3c')

  const result = checkStraightFlush(testCards)
  const desiredHandRank = HandRanks.StraightFlush
  const desiredCardRank = [9]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})

// checkStraightFlush test
test('checkStraightFlush: should return false', () => {
  const testCards = generateCards('9h 8c 7h 6h 5h 4c 3h')

  const result = checkStraightFlush(testCards)

  expect(result).toBe(false)
})

// checkFullHouse test
test('checkFullHouse: should return a 6-12 Full House', () => {
  const testCards = generateCards('12h 12c 6c 6h 6h 4c 3c')

  const result = checkFullHouse(testCards)
  const desiredHandRank = HandRanks.FullHouse
  const desiredCardRank = [6, 12]

  if (result) {
    expect(result.handRank).toStrictEqual(desiredHandRank)
    expect(result.cardRank).toStrictEqual(desiredCardRank)
  } else {
    throw new Error(`No HandScore Returned!`)
  }
})