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
  // the total amount of money the player has wagered on the current street
  totalWager: number
  // is the player currently the big blind? (if not, they're default the small blind, since this is heads-up poker)
  bigBlind: boolean
}

// type used to track the winner of a given hand (undetermined, tie, p1, or p2)
type Result = 'undetermined' | 'tie' | 1 | 2

// categories of action which can be taken on a player's turn
export type Act = 'check' | 'call' | 'raise' | 'fold'

// possible illegal actions a player can attempt which the UI needs to respond to
export type illegalAct = 'na' | 'invalid wager'

// action the player is taking -- Action + a potential wager acount
type Action = {
  act: Act
  wager: number
}

// a recording of a previous action
type ActionLog = {
  player: ActionOn
  act: Act
  wager: number
  street: Street
}

// a Hand is a round of play
export type Hand = {
  // the cards that we're drawing from
  deck: Deck
  // the cards present on the table
  board: Board
  // the current round of play
  street: Street
  // the total amount bet on previous streets
  pot: number
  // the size of the previous Raise
  previousRaise: number
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
  // Feedback to use in response to illegal actions
  error: illegalAct
  // collection of ActionLogs which make up the hand
  history: ActionLog[]
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
    totalWager: 0,
    bigBlind: true
  }

  const player2: Player = {
    id: 2,
    holeCards: [card2, card4],
    stack: 100,
    totalWager: 0,
    bigBlind: false
  }

  const newHand: Hand = {
    deck: deck,
    board: [],
    street: "preflop",
    pot: 0,
    previousRaise: 0,
    p1: player1,
    p2: player2,
    actionOn: 2,
    winner: 'undetermined',
    context: 'New hand',
    error: 'na',
    history: []
  }

  return newHand
}


// Process a player's action and return the new state of the Hand
export function processAction(hand: Hand, action: Action): Hand {
  console.log('Making clone')
  let newHand: Hand = structuredClone(hand);

  // reset the error code, it should only re-appear if another illegal action is attempted
  newHand.error = 'na'

  // create shorthand pointer to the 'live player' vs the 'other player', based on who the action is on
  let livePlayer: Player;
  let otherPlayer: Player;
  if (newHand.actionOn === 1) {
    console.log('Live player is 1')
    livePlayer = newHand.p1;
    otherPlayer = newHand.p2;
  } else {
    console.log('Live player is 2')
    livePlayer = newHand.p2;
    otherPlayer = newHand.p1;
  }

  // resolve the action
  if (action.act === 'fold') {
    return processFold(newHand, livePlayer, otherPlayer)
  } else if (action.act === 'raise') {
    return processRaise(newHand, action.wager, livePlayer, otherPlayer)
  }
  /*   
  else if (action.act === 'check') {
    // in the case of a check, the hand ALWAYS advances to the next street
    // *********************************************
    // THIS IS NOT ACCURATE! I'M THINKING OF A CALL!
    // *********************************************
    // this is a little shortcut because we're just playing heads up
    console.log('Action is check')
    if (livePlayer.wager === otherPlayer.wager) {
      newHand.context = `Player ${livePlayer.id} has checked at the ${newHand.street}`
      return advanceStreet(newHand)
    } else {
      newHand.context = `The other player has wagered more than you. Check not allowed.`
      return newHand
    }
  } else if (action.act === 'call') {
    // in the case of a call, the hand also ALWAYS advances EXCEPT during the case where the 
    // little blind calls the big blind preflop
  } else if (action.act === 'raise') {
    // 
  }
  */

  return newHand
}

function swapAction(hand: Hand): Hand {
  hand.actionOn == 1 ? hand.actionOn = 2 : hand.actionOn = 1
  return hand
}

function processFold(hand: Hand, livePlayer: Player, otherPlayer: Player): Hand {
  // In the case of a fold:
  // Check: 
  // - nothing
  // Do:
  // - set winner to otherPlayer
  // - set context
  // - return hand

  otherPlayer.stack += livePlayer.totalWager
  livePlayer.totalWager
  hand.winner = otherPlayer.id
  hand.context = `Player ${livePlayer.id} has folded at ${hand.street}`
  return hand;
}

function processRaise(hand: Hand, wager: number, livePlayer: Player, otherPlayer: Player): Hand {
  console.log(`entering processRaise with: wager: ${wager}`)
  // In the case of a raise:
  // Check:
  // - that livePlayer has a stack left to raise with at all
  // - that the wager is greater than or equal to 1
  // - that the wager does not surpass livePlayer's stack size
  // - that the raise is greater than or equal to the minimum raise possible
  //    - raising means wagering above the call amount
  //    - the amount you wager above the call amount (difference between your stack and the other player's stack)
  //    - must be at least as much as the previous amount wagered above the call amount (hand.previousRaise)
  // - that the wager + currentPlayer's totalWager does not surpass the size of otherPlayer's totalWager+stack
  //    - There's no point in overbetting in headsup, so we just won't allow it
  //    - actually we'll change this to 
  // Do:
  // - increase livePlayer's totalWager by the wager amount
  // - decrease livePlayer's stack by the wager amount
  // - change the action
  // - return the hand
  const callPrice = otherPlayer.totalWager - livePlayer.totalWager
  if (livePlayer.stack <= 0) {
    hand.error = 'invalid wager'
    hand.context = 'you cannot raise if your stack is empty'
    return hand
  }
  if (wager <= 0) {
    hand.error = 'invalid wager'
    hand.context = 'to raise, you need to wager something!'
    return hand
  } else if (wager > livePlayer.stack) {
    hand.error = 'invalid wager'
    hand.context = 'you cannot raise with more chips than you have in your stack!'
    return hand
  } else if (wager < callPrice + hand.previousRaise) {
    // TODO -- ACCOUNT FOR THE ABILITY TO GO ALL-IN HERE W/ REMAINING CHIPS
    // probably fine to ignore this for now while getting basic behavior working
    // - It might actually be fully satified by the calling logic? idk I'll figure that out once i get there
    hand.error = 'invalid wager'
    hand.context = `to raise here, you must bet at least ${(callPrice) + hand.previousRaise}, because the previous raise was ${hand.previousRaise}`
    return hand
  } else {
    if (wager + livePlayer.totalWager > otherPlayer.totalWager + otherPlayer.stack) {
      // The livePlayer cannot actually wager more chips than the otherPlayer has; the excess will simply be returned to them
      // in this case, change the wager
      console.log(`Adjusting overbet from ${wager} to ${otherPlayer.totalWager + otherPlayer.stack}`)
      wager = otherPlayer.totalWager + otherPlayer.stack
    }
    // Adjust previousRaise to match this raise
    hand.previousRaise = wager - callPrice
    // adjust totalWager and stack
    livePlayer.totalWager += wager
    livePlayer.stack -= wager
    hand.context = `Player ${livePlayer.id} raises ${wager - callPrice} to ${livePlayer.totalWager}`
    return swapAction(hand)
  }
}

// Advance the street -- preflop/flop/turn advance, river move onto the showdown
function advanceStreet(hand: Hand): Hand {
  let newHand: Hand = structuredClone(hand);

  // Move both player's money into the pot 
  newHand.pot += newHand.p1.totalWager;
  newHand.p1.totalWager = 0;
  newHand.pot += newHand.p2.totalWager;
  newHand.p2.totalWager = 0;

  // Set who's first to act next street based on who's the big blind
  // After the preflop, the (former) big blind is always the first to act
  newHand.p1.bigBlind ? newHand.actionOn = 1 : newHand.actionOn = 2;

  // draw new cards/advance to the next street
  if (newHand.street === 'preflop') {
    newHand.board = [newHand.deck.pop()!, newHand.deck.pop()!, newHand.deck.pop()!]
    newHand.street = 'flop';
  } else if (newHand.street === 'flop' || newHand.street === 'turn') {
    newHand.board.push(newHand.deck.pop()!)
    newHand.street === 'flop' ? newHand.street = 'turn' : newHand.street = 'river';
  } else if (newHand.street === 'river') {
    return showdown(newHand)
  }

  return newHand
}

// calculate a showdown
function showdown(hand: Hand): Hand {
  let newHand = structuredClone(hand)

  newHand.winner = 'tie'
  newHand.context = 'SHOWDOWN RESULT PLACEHOLDER!'

  return newHand
}
