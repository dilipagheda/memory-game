/*
 * Global variables and initial function calls
 */
let cardPair = []; //cardPair will hold a pair of cards that user is handling for a given turn
let totalMoves = 0; //total number of moves in the current game
let totalStars = 5; //initially, user has 5 stars
let totalSeconds=0; // to keep track of seconds
let totalMinutes=0; //to keep track of minutes
let totalHours =0; //to keep track of hours
let interval = setInterval(displayTimer,1000); //set timer here and get the reference in interval variable to clear the timer later on.
//Call shuffleAndDisplay() on the first page load.
shuffleAndDisplay();

//A function to restart game that resets game data and re-shuffles card
function restartGame(){
    //clear the cardPair array and get it ready for the next move
    while (cardPair.length) { cardPair.pop(); }

    //reset global variables
    totalMoves = -1;
    totalStars = 5;
    totalSeconds=0;
    totalMinutes=0;
    totalHours =0;

    //display moves and stars
    incrementMove();

    //shuffle cards
    shuffleAndDisplay();

    //display timer as intial call
    displayTimer();

    //start the timer
    clearInterval(interval);
    interval = setInterval(displayTimer,1000);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function shuffleAndDisplay(){
    //get an array of cards using jquery selector
    let cards = $('.deck .card');
    //reset classes from previous game
    cards.removeClass();
    cards.addClass('card');
    
    //pass that array to shuffle method to shuffle it
    cards = shuffle(cards);

    //pass the shuffled array to renderHTML method to render it on screen
    renderHTML(cards);
}

//A function that takes an array of card elements and render it on screen
function renderHTML(cards){
    //remove existing li elements from deck
    $('.deck').empty();

    //add each elements from shuffled array back to the deck
    cards.each((index, element) => {
        $('.deck').append(element);
    });

}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 //A click listener for a card
$('.deck').on('click',function(event){
    let target = event.target;
    if(target.tagName !== 'LI'){
        return;
    }
    //if animation is on then do not process the click for better user experience
    if($('.deck .card.animated').length > 0){
        return;
    }
    console.log("clicked");

    let cardClicked = $(target);
    if(cardClicked.hasClass('match')){
        return;
    }
    if(processCard(cardClicked)){
        checkForMatch(cardClicked);
    }

    //check if player has won and if so display a modal with Congratulations message
    if(checkIfWon()){
        //clear timer
        clearInterval(interval);
        //display modal
        displayCongratulateMessage();
    }
});

//A function to keep track of time and also to display timer on screen
displayTimer();
function displayTimer(){
    totalSeconds++;
    if(totalSeconds>=60){
        totalMinutes++;
        totalSeconds=0;
    }
    if(totalMinutes>=60){
        totalHours++;
        totalMinutes=0;
    }

    //Update screen elements with values
    $('.timer span.second').text(totalSeconds);
    $('.timer span.minute').text(totalMinutes);
    $('.timer span.hour').text(totalHours);
}

/*
A function to increment move counter and display it on the page
A move is considered when user reveals a pair (2 cards) and not when user has revealed just the first card of a pair.
*/
function incrementMove(){
    totalMoves++;
    $('span.moves').text(`${totalMoves} Moves`);
    updateStars();
}

/*
 A function to update the starts based on total number of moves
 
 In best case, user will only take 8 moves to reveal all 8 pairs. However, that is not realistic so let's double that
 for 5 star rating. (16 moves or less is 5 stars)

 thereafter, every 8 moves, user will lose one star
 so, 4 star : >16 moves
     3 star: >24 moves
     2 star: >32 moves
     1 star: >40 moves
 
*/
function updateStars(){
    if(totalStars === 5 && totalMoves > 16){
        totalStars--;
    }
    if(totalStars === 4 && totalMoves > 24){
        totalStars--;
    }
    if(totalStars === 3 && totalMoves > 32){
        totalStars--;
    }
    if(totalStars === 2 && totalMoves > 40){
        totalStars--;
    }

    //render on screen
    $('ul.stars').empty();
    for(let i=0;i<totalStars;i++){
        let starElement = $('<li><i class="fa fa-star"></i></li>');
        $('ul.stars').append(starElement);
    }

}

//A function to process the card that was clicked
function processCard(card){
    console.log(card.prop('class'));

    //if card has any of the following classes then do not process the selection
    if(card.hasClass('open') ||  card.hasClass('show') || card.hasClass('no-match') || card.hasClass('animated')){
        return false; 
    }else{
        showCard(card);
        return true;
    }
}

//A function to show card with animation
function showCard(card){
    setNotAllowedOnCards();
    card.addClass('open show animated swing');
    //remove animated classes after 1 sec
    setTimeout(function(){
        removeNotAllowedOnCards();
        card.removeClass('animated swing');  
    },1000);
}

/*
 A function to set cursor to not allowed on all card elements. This is needed to indicate user that
 new card can not be clicked as animation is in progress.
 This is to avoid too many clicks and so prevent the screen in resulting too many animations at the same time.
 Assuming that app consumers will be children, its good to add such logic to prevent too many random clicks
*/
function setNotAllowedOnCards(){
  $('.deck .card').addClass('not-allowed');
}

/*
 A function to remove cursor - not allowed on all card elements. 
*/
function removeNotAllowedOnCards(){
    $('.deck .card').removeClass('not-allowed');
}

//A function to hide cards 
function hideCards(card1,card2){
    card1.removeClass();
    card2.removeClass();
    setNotAllowedOnCards();
    card1.addClass('card animated bounce');
    card2.addClass('card animated bounce');
    setTimeout(function(){
        card1.removeClass();
        card2.removeClass();
        card1.addClass('card');
        card2.addClass('card');    
        removeNotAllowedOnCards();
    },1000);
}

//A function to mark a card as matched
function matchCards(card1,card2){
    card1.removeClass('open show animated swing');
    card2.removeClass('open show animated swing');
    setNotAllowedOnCards();

    card1.addClass('match animated rubberBand');
    card2.addClass('match animated rubberBand');

    //remove animation classes after 1 sec
    setTimeout(function(){
        card2.removeClass('animated rubberBand');
        card1.removeClass('animated rubberBand');
        removeNotAllowedOnCards();
    },1000);

}

//A function to change background color to red and do no match animation
function unmatchCards(card1,card2){
    card1.removeClass('open show animated swing');
    card2.removeClass('open show animated swing');

    setNotAllowedOnCards();

    card1.addClass('no-match show animated shake');
    card2.addClass('no-match show animated shake');

    setTimeout(function(){
        hideCards(card1,card2);
        removeNotAllowedOnCards();
    },1000);
}

//A function to check if a card was matched or not
function checkForMatch(card){
    if(cardPair.length === 0){
        cardPair.push(card);
    }else if(cardPair.length > 0){
         let totalClassesMatched=0;
         let firstCard = cardPair[0];
         let secondCard = card;
         let firstCardClassListValues = firstCard.find('i').prop("classList").values();
       
         for(let value1 of firstCardClassListValues){
                let secondCardClassListValues = secondCard.find('i').prop("classList").values();
                for(let value2 of secondCardClassListValues)
                {
                    if(value1 === value2){
                     totalClassesMatched++;
                    }
                 }
         }

         if(totalClassesMatched===2){
             matchCards(firstCard,secondCard);
         }else{
            unmatchCards(firstCard,secondCard);

         }
         //a move (or turn) is done here so increment the move counter
         incrementMove();
         //clear the cardPair array and get it ready for the next move
         while (cardPair.length) { cardPair.pop(); }
    }
}


//A function to check if the player has won or not
function checkIfWon(){
    //get the total of card elements 
    let total = $('.deck .card').length;

    //get the total of card elements that also has a match class
    let totalMatched = $('.deck .card.match').length;

    //check if they are equal and if so then game is won
    if(total===totalMatched){
        return true;
    }else{
        return false;
    }
}

//A function to display congratulate message
function displayCongratulateMessage(){
    //prepare the message variables with values
    let message1 = `With ${totalMoves} Moves and ${totalStars} Stars!`;
    let message2 = `Total time taken was ${totalHours} hours, ${totalMinutes} minutes and ${totalSeconds} seconds.`;              
    let message3 = `Woooooo!`;
    //display values to screen elements
    $('.result-msg-1').text(message1);
    $('.result-msg-2').text(message2);
    $('.result-msg-3').text(message3);

    $('.modal').css('display','block');
}

//A click listener for play again button on modal screen and refresh button on screen
$('.restart').on('click',function(){
    console.log('restart');
    restartGame();
    //close the modal
    $('.modal').css('display','none');
});