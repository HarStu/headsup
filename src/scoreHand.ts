// Four suits, hearts diamonds clubs spades
export type Suit = 'h' | 'd' | 'c' | 's'
// ranks from 2-14, with 11 being jack, 12 being queen, 13 being king, and 14 being ace
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

// each card has a suit and a rank
export type Card = {
  rank: Rank;
  suit: Suit;
}

// Hole Cards are a player's two private cards
export type HoleCards = [Card, Card]

// the board is the cards which are available to both players
export type Board = Card[]

// hand ranks
export const HandRanks = {
  HighCard: 0,
  Pair: 1,
  TwoPair: 2,
  ThreePair: 3,
  Straight: 4,
  Flush: 5,
  FullHouse: 6,
  FourPair: 7,
  StraightFlush: 8
}
export type HandRank = typeof HandRanks[keyof typeof HandRanks]

// handScore
export type HandScore = {
  handRank: HandRank   // What rank is this hand?
  cardRank: Rank[]     // What cardRank is this hand associated with? (i.e, 10-high flush)
  usedCards: Card[]    // The cards used to make this hand (not nessesarily 5; kickers are included in leftovers)
  leftovers?: Card[]   // Cards are leftover after making this hand?
}

function scoreHand(board: Board, holeCards: HoleCards): HandScore {
  // Check each possible HandRank, starting with a StraightFlush
  // If a match is found, return it
  // If not, proceed to the next one 
  const cards: Card[] = [...board, ...holeCards].sort((a, b) => b.rank - a.rank)

  return checkHighCard(cards)
}

export function checkTwoPair(cards: Card[]): HandScore | false {
  const firstPairRes = checkPair(cards)
  if (firstPairRes && firstPairRes.leftovers) {
    const secondPairRes = checkPair(firstPairRes.leftovers)
    if (secondPairRes) {
      return {
        handRank: HandRanks.TwoPair,
        cardRank: [...firstPairRes.cardRank, ...secondPairRes.cardRank],
        usedCards: [...firstPairRes.usedCards, ...secondPairRes.usedCards],
        leftovers: secondPairRes.leftovers
      }
    }
  }
  return false
}

export function checkFullHouse(cards: Card[]): HandScore | false {
  const threeRes = checkPair(cards, 3)
  if (threeRes && threeRes.leftovers) {
    const pairRes = checkPair(threeRes.leftovers)
    if (pairRes) {
      return {
        handRank: HandRanks.FullHouse,
        cardRank: [...threeRes.cardRank, ...pairRes.cardRank],
        usedCards: [...threeRes.usedCards, ...pairRes.usedCards],
        leftovers: pairRes.leftovers
      }
    }
  }
  return false
}

export function checkStraightFlush(cards: Card[]): HandScore | false {
  const straightRes = checkStraight(cards)
  if (straightRes && checkFlush(straightRes.usedCards)) {
    return {
      handRank: HandRanks.StraightFlush,
      cardRank: straightRes.cardRank,
      usedCards: straightRes.usedCards,
    }
  } else {
    return false
  }
}

export function checkStraight(cards: Card[]): HandScore | false {
  // Cards already arrive here in descending rank order, which helps a lot 
  // Set a flag that confirms if we have an Ace or not (will need later for wheel straights)
  const aceFlag = cards[0].rank === 14
  const wheelAce = cards[0]

  let count = 1
  let firstRank = cards[0].rank
  let straightCards = [cards[0]]
  for (let i = 1; i < cards.length; i++) {
    const card = cards[i]
    if (card.rank === cards[i - 1].rank - 1) {
      // Check if the card rank is one below the preceeding card
      // If so, the straight is continuing
      count++
      straightCards.push(cards[i])
    } else if (!(card.rank === cards[i - 1].rank)) {
      // Skip duplicates
      // if the next card isn't a duplicate or one-rank down, the straight is broken
      // in that case, reset the count and firstCard
      count = 1
      firstRank = card.rank
      straightCards = [cards[i]]
    }

    // Break out when we find a straight. 
    // Since we're working down, breaking early means breaking with the highest straight
    if (count === 5 || count === 4 && aceFlag && firstRank === 5) {
      break;
    }
  }

  if (count >= 5) {
    return {
      handRank: HandRanks.Straight,
      cardRank: [firstRank],
      usedCards: straightCards,
      leftovers: cards.filter(card => !straightCards.includes(card))
    }
  } else if (count === 4 && firstRank === 5 && aceFlag) {
    // special case for wheel straights
    return {
      handRank: HandRanks.Straight,
      cardRank: [firstRank],
      usedCards: [...straightCards, wheelAce],
      leftovers: cards.filter(card => ![...straightCards, wheelAce].includes(card))
    }
  } else {
    return false
  }
}

export function checkFlush(cards: Card[]): HandScore | false {
  const suitCounts = new Map<Suit, number>()
  let highestFlush = undefined
  let suitCards = undefined

  // get a count of how many cards of each suit we have
  for (const card of cards) {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) ?? 0) + 1)
  }

  // check for any cases where we have 5 or more cards of a single suit
  for (const [suit, count] of suitCounts) {
    if (count >= 5) {
      const highCardVal = cards.filter((card) => card.suit === suit)[0].rank
      if (highCardVal > (highestFlush ?? 0)) {
        highestFlush = highCardVal
        suitCards = cards.filter((card) => card.suit === suit).slice(0, 5)
      }
    }
  }

  if (highestFlush && suitCards) {
    return {
      handRank: HandRanks.Flush,
      cardRank: [highestFlush],
      usedCards: suitCards,
      leftovers: cards.filter(card => !suitCards.includes(card))
    }
  } else {
    return false
  }
}

// checkPair function can be configured to check for pairs, three-of-a-kind (threepair), or four-of-a-king (fourpair)
// default is pairs though
export function checkPair(cards: Card[], pairCount: 2 | 3 | 4 = 2): HandScore | false {
  let highestPair: Rank | undefined = undefined;

  // set the rank we're seeking based on the pairCount
  let seekingRank = [HandRanks.Pair, HandRanks.ThreePair, HandRanks.FourPair][pairCount - 2]

  const rankCounts = new Map<Rank, number>();

  // get a count of how many cards of each rank we're looking at 
  for (let card of cards) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1)
  }

  // check for the highest value pair of the size we're looking for
  for (const [rank, count] of rankCounts) {
    if (count >= pairCount && (rank > (highestPair ?? 0))) {
      highestPair = rank
    }
  }

  // list of cards we've used to create this hand
  // the first n cards with rank we're making a pair of
  const usedCards = cards.filter((card) => card.rank == highestPair).slice(0, pairCount)

  // return what we found, or nothing if we found nothing 
  if (highestPair) {
    return {
      handRank: seekingRank,
      cardRank: [highestPair],
      usedCards: cards.filter((card) => card.rank === highestPair).slice(0, pairCount),
      leftovers: cards.filter((card) => !usedCards.includes(card))
    }
  } else {
    return false;
  }
}

function checkHighCard(cards: Card[]): HandScore {
  // Every single hand will have a highcard, so we can always return a HandScore
  const handScore = {
    handRank: HandRanks.HighCard,
    cardRank: [cards[0].rank],
    usedCards: [cards[0]],
    leftovers: cards.slice(1)
  }
  return handScore
}