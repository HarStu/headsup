Heads-Up No Limit Hold 'Em

TODO
- Finish showdown
- At some point, it might be nice if HandScore included the cards which made up the hand instead of just the kickers which don't?
  - useful for gui stuff, showing the cards the player won with
  - actually this is gonna be super important for figuring out straight flushes
  - this creates a more important distinction between kickers and leftovers i'd rather not deal with right now 

  I guess a part of the conumdrum I've in re: returning extra cards is i have a choice
  - i can have functions that take an arbitrary amount of cards, and return the minimum nessesary cards to make a hand
  - i can have functions that takes exactly 7 cards, and returns exactly 5 as the hand that's being scored
  i can also build the latter from the former probably. 
  - a 'make best hand' function or something like that. 
  - eith way i should probably be returning the cards i'm scoring, it's a good practice.