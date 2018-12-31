# Memory Game Project

## About the project
This project is a browser based card matching game that has cool animations, game logic and engaging interactions. It is done using jQuery and JavaScript with bit of help from Bootstrap, Animate.css and FontAwesome library. It also supports mobile first responsive design where layout adapts based on screensize. It achieves this through Grid layout and media queries.

### How the Game Works
The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

### Each turn:

The player flips one card over to reveal its underlying symbol.
The player then turns over a second card, trying to find the corresponding card with the same symbol.
If the cards match, both cards stay flipped over.
If the cards do not match, both cards are flipped face down.
The game ends once all cards have been correctly matched.

### Game Functionality
The game has following interactions purely implemented using jQuery and JavaScript. Game also has very nice animations that is triggered when any of the following events happen.

Flipping cards
cards match
cards do not match
When the game finishes by matching all cards

### Cool features
Game has following cool features.
- Game keeps track of time
- Game keeps track of total number of moves
- Game has the logic to give stars based on total number of moves player made before winning. lesser number of moves result in higher stars.
- Game has some validations where user can not click on cards when animation is on.
- User gets nice and engaging modal screen with message "Congratulations! You won!" with some vital game stats.

# Dependancies
This project uses following libraries.
- jQuery
- Bootstrap
- Animate.css (http://daneden.me/animate)
- Font Awesome

# Project Specifications
## Memory Game Logic

The game randomly shuffles the cards. A user wins once all cards have successfully been matched.

## Congratulations Popup

When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It should also tell the user how much time it took to win the game, and what the star rating was.

## Restart Button

A restart button allows the player to reset the game board, the timer, and the star rating.

## Star Rating

The game displays a star rating (from 1 to at least 3) that reflects the player's performance. At the beginning of a game, it should display at least 3 stars. After some number of moves, it should change to a lower star rating. After a few more moves, it should change to a even lower star rating (down to 1).

The number of moves needed to change the rating is up to you, but it should happen at some point.

## Timer

When the player starts a game, a displayed timer should also start. Once the player wins the game, the timer stops.

## Move Counter

Game displays the current number of moves a user has made.

## Styling

Application uses CSS to style components for the game.

## Usability

All application components are usable across modern desktop, tablet, and phone browsers.


