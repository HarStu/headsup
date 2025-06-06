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
export const HandRank = {
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
export type HandRank = typeof HandRank[keyof typeof HandRank]

// handScore
export type HandScore = {
  handRank: HandRank
  cardRank: Rank[]
  kickers?: Rank[]
}

function scoreHand(board: Board, holeCards: HoleCards): HandScore {
  // Check each possible HandRank, starting with a StraightFlush
  // If a match is found, return it
  // If not, proceed to the next one 
  const cards: Card[] = [...board, ...holeCards].sort((a, b) => a.rank - b.rank)

  if (false) {

  } else {
    return checkHighCard(cards)
  }
}

function checkHighCard(cards: Card[]): HandScore {
  // Every single hand will have a highcard, so we can always return a HandScore
  const handScore = {
    handRank: HandRank.HighCard,
    cardRank: [cards[0].rank],
    kickers: cards.slice(1).map((card) => card.rank)
  }
  return handScore
}