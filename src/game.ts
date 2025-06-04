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

// the board is the cards which are available to both players
type Board = Card[]

// the street refers to the current round of play. More cards are added to the board as play continues.
type Street = 'preflop' | 'flop' | 'turn' | 'river'

// type used to track the state of the action (whose turn it is to act)
type ActionOn = 1 | 2

// a player is a participant in the game
type Player = {
  // id of the player
  id: ActionOn
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
type Result = 'undetermined' | 'tie' | 1 | 2

// categories of action which can be taken on a player's turn
type Act = 'check' | 'call' | 'raise' | 'fold'

// action the player is taking -- Action + a potential wager acount
type Action = {
  act: Act
  wager: number
}

// a Hand is a round of play
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
  // the number of the player whose turn it is to act
  actionOn: ActionOn
  // who won this hand?
  winner: Result
  // Contextual information describing what the last action taken was
  context: String
}

// return a shuffled Deck
function generateDeck(): Deck {
  const validSuits: Suit[] = ['h', 'd', 'c', 's']
  const validRanks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

  // Create an unshuffledDeck
  let unshuffledDeck: Deck = []
  for (let cardSuit of validSuits) {
    for (let cardRank of validRanks) {
      unshuffledDeck.push({ suit: cardSuit, rank: cardRank })
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

// Return a new hand
// TODO -- OPTIONALLY PASS PLAYERS TO THE HAND RATHER THAN CREATING THEM IN THE HAND
export function generateHand(): Hand {
  const deck: Deck = generateDeck();

  // Pop the first four cards from the deck
  // These will be distributed as the player's hole cards, in alternating order
  const card1: Card = deck.pop()!;
  const card2: Card = deck.pop()!;
  const card3: Card = deck.pop()!;
  const card4: Card = deck.pop()!;

  // Define player1, who will be the initial Big Blind
  const player1: Player = {
    id: 1,
    holeCards: [card1, card3],
    stack: 100,
    wager: 0,
    bigBlind: true
  }

  const player2: Player = {
    id: 2,
    holeCards: [card2, card4],
    stack: 100,
    wager: 0,
    bigBlind: true
  }

  const newHand: Hand = {
    deck: deck,
    board: [],
    street: "preflop",
    pot: 0,
    p1: player1,
    p2: player2,
    actionOn: 2,
    winner: 'undetermined',
    context: 'New hand'
  }

  return newHand
}

// Process a player's action and return the new state of the Hand
function processAction(hand: Hand, action: Action): Hand {
  let newHand: Hand = structuredClone(hand);

  // create shorthand pointer to the 'live player' vs the 'other player', based on who the action is on
  let livePlayer: Player;
  let otherPlayer: Player;
  if (newHand.actionOn === 1) {
    livePlayer = newHand.p1;
    otherPlayer = newHand.p2;
  } else {
    livePlayer = newHand.p2;
    otherPlayer = newHand.p1;
  }

  if (action.act === 'fold') {
    // in the case of a fold, the other player immediately wins the hand
    newHand.winner = otherPlayer.id
    newHand.context = `Player ${livePlayer} has folded. Player ${otherPlayer.id} wins`
    return newHand;
  } else if (action.act === 'check') {
    // in the case of a check, the hand ALWAYS advances to the next street
    if (livePlayer.wager === otherPlayer.wager) {

    } else {
      newHand.context = `Check not allowed here`
      return newHand
    }
  }

  return newHand
}

// Advance the street -- preflop/flop/turn advance, river move onto the showdown
function advanceStreet(hand: Hand): Hand {
  let newHand: Hand = structuredClone(hand);

  // Move both player's money into the pot 
  newHand.pot += newHand.p1.wager;
  newHand.p1.wager = 0;
  newHand.pot += newHand.p2.wager;
  newHand.p2.wager = 0;

  // Set who's first to act next street based on who's the big blind
  // After the preflop, the (former) big blind is always the first to act
  newHand.p1.bigBlind ? newHand.actionOn = 1 : newHand.actionOn = 2;

  // draw new cards/advance to the 
  if (newHand.street === 'preflop') {
    newHand.board = [newHand.deck.pop()!, newHand.deck.pop()!, newHand.deck.pop()!]
    newHand.street = 'flop';
  } else if (newHand.street === 'flop' || newHand.street === 'turn') {
    newHand.board.push(newHand.deck.pop()!)
    newHand.street === 'flop' ? newHand.street = 'turn' : newHand.street = 'river';
  } else if (newHand.street === 'river') {
    // PLACEHOLDER
    console.log('showdown placeholder')
  }

  return newHand
}

// calculate a showdown
function showdown(hand: Hand): Hand {
  let newHand = structuredClone(hand)

  newHand.winner = 'tie'
  newHand.context = 'tie -- this is just a placeholder right now!'

  return newHand
}
