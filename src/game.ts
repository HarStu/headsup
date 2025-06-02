// Four suits, hearts diamonds clubs spades
type Suit = 'h' | 'd' | 'c' | 's'
// ranks from 2-14, with 11 being jack, 12 being queen, 13 being king, and 14 being ace
type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

// each card has a suit and a rank
type Card = {
  rank: Rank;
  suit: Suit;
}

// a deck is an array of cards
type Deck = Card[]

// Hole Cards are a player's two private cards
type HoleCards = [Card, Card]

// the board is the cards which are available to each player
type Board = [] | [Card, Card, Card] | [Card, Card, Card, Card] | [Card, Card, Card, Card, Card]

// the street refers to the current round of play. More cards are added to the board as play continues.
type Street = 'preflop' | 'flop' | 'turn' | 'river'

// a player is a participant in the game
type Player = {
  // the player's private hole cards
  holeCards: HoleCards
  // the amount of money the player has to gamble with
  stack: number
  // the amount of money the player has wagered on the current street
  wager: number
  // is the player currently the big blind? (if not, they're default the small blind, since this is heads-up poker)
  bigBlind: boolean
}

// type used to track the winner of a given hand (undetermined, tie, p1, or p2)
type Result = 'undetermined' | 'tie' | 'p1' | 'p2'

// a Hand is a complete round of play
type Hand = {
  // the cards that we're drawing from
  deck: Deck
  // the cards present on the table
  board: Board
  // the current round of play
  street: Street
  // the total amount bet on previous streets
  pot: number
  // player 1
  p1: Player
  // player 2
  p2: Player
  // who won this hand?
  winner: Result
}

// return a shuffled Deck
function generateDeck(): Deck {
  const validSuits: Suit[] = ['h', 'd', 'c', 's']
  const validRanks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

  // Create an unshuffledDeck
  let unshuffledDeck: Deck = []
  for (let cardSuit of validSuits) {
    for (let cardRank of validRanks) {
      unshuffledDeck.push({suit: cardSuit, rank: cardRank})
    }
  }

  // Shuffle the deck
  let shuffledDeck: Deck = []
  while (unshuffledDeck.length > 0) {
    // splice(index, n) removes n elements starting at index, and returns them as an array
    // so here we're grabbing 1 card from a random location in unshuffledDeck, 
    // then grabbing it from the array it's returned in
    const cardIndex = Math.floor(Math.random() * (unshuffledDeck.length));
    shuffledDeck.push(unshuffledDeck.splice(cardIndex, 1)[0]);
  }

  return shuffledDeck
}

