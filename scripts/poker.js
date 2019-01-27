Vue.component('card', {
    methods: {
        clickCard: function(){
            this.isSelected = !this.isSelected;
        }
    },
    props: ['color', 'face', 'isSelected'],
    template: `<div class="card center-align valign-wrapper"
        v-on:click="isSelected = !isSelected"
        v-bind:class="{ selected : isSelected }">
        <div class="card-body"
            v-bind:class="[color]">
            {{ face }}
        </div>
    </div>`
})

const cardFaces = [
    { face: "2", faceValue: 2 },
    { face: "3", faceValue: 3 },
    { face: "4", faceValue: 4 },
    { face: "5", faceValue: 5 },
    { face: "6", faceValue: 6 },
    { face: "7", faceValue: 7 },
    { face: "8", faceValue: 8 },
    { face: "9", faceValue: 9 },
    { face: "10", faceValue: 10 },
    { face: "J", faceValue: 11 },
    { face: "Q", faceValue: 12 },
    { face: "K", faceValue: 13 },
    { face: "A", faceValue: 1 }
];

const suits = ["clubs", "hearts", "diamonds", "spades"];

var cards = [];

function colorCard(suit){
    switch(suit){
        case 'hearts':
            return "blue lighten-2";
        case 'diamonds':
            return "orange lighten-2";
        case 'spades':
            return "teal lighten-3";
        case 'clubs':
            return "purple lighten-2";
    }
};

var cards = [];

// create a card based on each card-face combination and add it to cards
suits.forEach(function(suit){
    cardFaces.forEach(function(cardFace){
        cards.push({
            color: colorCard(suit),
            face: cardFace.face, 
            faceValue: cardFace.faceValue,
            isSelected: false
        });
    });
});

var testCard = {
    suit: "spades",
    color: colorCard("spades"),
    face: "Q",
    faceValue: "12",
    isSelected: false
};

var newDeck = cards;

var poker = new Vue({
    el: "#poker",
    data: {
        bet: 1,
        chips: 1000,
        deck: newDeck,
        hand: new Array(),
        handComplete: true,
        handResult: {},
        handsPlayed: 0
    },
    methods: {
        clickBetIncrease: function(){
            if (this.bet <= this.chips && this.handComplete){
                this.bet++;
            }
        },
        clickBetDecrease: function(){
            if (this.bet > 1 && this.handComplete){
                this.bet--;
            }
        },
        clickDeal: function(){
            // if this is the initial deal, deal 5 cards.
            if (this.handComplete){
                this.hand = this.dealCards(5);
                
                var result = this.scoreHand();
                this.payout(this.bet, result.payoutMultiplier);
            }
            else {
                // then, we need to know how many cards to deal
                var heldCards = _.filter(this.hand, function(card){ return card.isSelected; });
                var discardedCards = _.filter(this.hand, function(card){ return card.isSelected == false; });
                var cardsToDeal = discardedCards.length;

                var indexes = [];
                var hand = this.hand;
                _.each(discardedCards, function(card){
                    var index = hand.indexOf(card);
                    indexes.push(index);
                });
                
                // then, we need new cards to replace the cards not held.
                var newCards = this.dealCards(cardsToDeal);
                console.log(newCards);

                // replace discarded cards with new ones.
                var newCardIndex = 0;
                indexes.forEach(function(index){
                    hand[index] = newCards[newCardIndex];
                });
                this.hand = hand;
            }
            this.handsPlayed++;
            this.toggleHandComplete();
        },
        dealCards: function(numberOfCards){
            console.log('dealCards deck length', this.deck.length);
            // pick new cards from the deck
            var newCards = _.sample(this.deck, numberOfCards);
            
            // remove those cards from the deck
            var deck = this.deck;
            this.deck = _.filter(deck, function(card){ _.contains(this.hand, card) == false; });
            this.deck = deck;

            return newCards;
        },
        payout: function(bet, handscore){
            if (bet == null || bet == undefined){
                throw 'bet error';
            }
            if (handscore == null || handscore == undefined){
                throw 'hand error'
            }

            this.chips = this.chips + (bet * handscore);
        },
        scoreHand: function(){
            var faces = _.pluck(this.hand, 'face');

            var countFace = function(face){
                return _.filter(this.hand, function(card){ return card.face == face; }).length;
            }

            // flushes and straights
            if (faces.length === 5){
                var faceValues = _.pluck(this.hand, function(card){ return card.faceValue; });
                var sortedFaceValues = _.sortBy(faceValues, function(faceValue){ return faceValue });

                var isFlush = function(){
                    var colors = _.pluck(this.hand, 'color');
                    if (colors.length === 1){
                        return true;
                    }
                    return false;
                };

                var isStraight = function(){
                    var possibleStraights = [
                        [1,2,3,4,5],
                        [2,3,4,5,6],
                        [3,4,5,6,7],
                        [4,5,6,7,8],
                        [5,6,7,8,9],
                        [6,7,8,9,10],
                        [7,8,9,10,11],
                        [8,9,10,11,12],
                        [9,10,11,12,13],
                        [1,10,11,12,13]
                    ];

                    if (_.contains(possibleStraights, sortedFaceValues)){
                        return true;
                    }
                    return false;
                };

                if (isFlush){
                    // royal flush pays 800
                    if (sortedFaceValues === [1,10,11,12,13]){
                        return {
                            label: 'Royal Flush',
                            payoutMultiplier: 800
                        };
                    }

                    // straight flush pays 50
                    if (isStraight)
                    {
                        return {
                            label: 'Straight Flush',
                            payoutMultiplier: 50
                        };
                    }
                   
                    // flush pays 6
                    return {
                        label: 'Flush',
                        payoutMultiplier: 6
                    }
                }

                // straight pays 4
                if (isStraight){
                    return {
                        label: 'Straight',
                        payoutMultiplier: 4
                    }
                }
                return {
                    label: 'Nothing',
                    payoutMultiplier: 0
                };
            }

            // jacks or better pays 1
            if (faces.length == 4){
                var valuableFaces = ["J", "Q", "K", "A"];
                valuableFaces.forEach(function(face){
                    if (countFace(face) == 2){
                        return {
                            label: 'Jacks or Better',
                            payoutMultiplier: 1
                        };
                    }
                });
            }

            // three of a kind pays 3 and two pair pays 2
            if (faces.length == 3){
                faces.forEach(function(face){
                    if (countFace(face) === 3){
                        return {
                            label: 'Three of a Kind',
                            payoutMultiplier: 3
                        }
                    }
                });

                return {
                    label: 'Two Pair',
                    payoutMultiplier: 4
                };
            }

            // four of a kind and full house
            if (faces.length == 2){
                faces.forEach(function(face){
                    if (countFace(face) === 4){
                        return {
                            label: 'Four of a Kind',
                            payoutMultiplier: 25
                        }
                    }
                });
                return {
                    label: 'Full House',
                    payoutMultiplier: 9
                }
            }
            return {
                label: 'Nothing',
                payoutMultiplier: 0
            }
        },
        toggleHandComplete: function(){
            this.handComplete = !this.handComplete;
        }
    }
});