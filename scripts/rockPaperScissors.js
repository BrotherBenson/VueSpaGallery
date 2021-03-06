var rockPaperScissors = new Vue({
    el: '#rock-paper-scissors',
    data: {
        computerHistory: {
            paper: 0,
            scissors: 0,
            rock: 0
        },
        lastGameResult: '',
        userHistory: {
            paper: 0,
            scissors: 0,
            rock: 0
        },
        userRecord: {
            draws: 0,
            losses: 0,
            wins: 0
        }
    },
    methods: {
        clickChoice: function(userChoice){
            // null-checking.
            if (userChoice == null || userChoice == undefined){
                throw 'Missing user input.';
            }
            // create a computer choice.
            var computerChoice = this.generateComputerChoice();
            // play the game.
            this.lastGameResult = this.getGameResult(userChoice, computerChoice);
            // add to the history.
            this.recordOutcome(userChoice, computerChoice, this.lastGameResult);
        },
        generateComputerChoice: function(){
            // a random number based selection.
            var randomValue = Math.random();

            if (randomValue < 1/3) {
                return 'rock';
            }
            else if (randomValue < 2/3) {
                return 'paper';
            }
            else{
                return 'scissors';
            }
        },
        getGameResult: function(userChoice, computerChoice){
            // null-checking.
            if (userChoice == null || userChoice == undefined){
                throw 'Missing user input.';
            }
            if (computerChoice == null || computerChoice == undefined){
                throw 'Missing computer input.';
            }

            // comparison logic for the game.
            if (userChoice === computerChoice){
                return 'draw';
            }
            else if (userChoice === 'rock' && computerChoice === 'scissors'
                || userChoice === 'scissors' && computerChoice === 'paper'
                || userChoice === 'paper' && computerChoice === 'rock') {
                return 'user';
            }
            else {
                return 'computer';
            }
        },
        recordChoice: function(historyObject, choice){
            if (historyObject == null || historyObject == undefined){
                throw 'Missing historyObject.'
            }
            
            // record the choice.
            switch(choice){
                case 'rock':
                    historyObject.rock++;
                    break;
                case 'paper':
                    historyObject.paper++;
                    break;
                case 'scissors':
                    historyObject.scissors++;
                    break;
                default:
                    throw 'Missing choice input.'; 
            }
        },
        recordOutcome: function(userChoice, computerChoice, gameOutcome){
            // null-checking.
            if (userChoice == null || userChoice == undefined){
                throw 'Missing user input.';
            }
            if (computerChoice == null || computerChoice == undefined){
                throw 'Missing computer input.';
            }
            if (gameOutcome == null || gameOutcome == undefined){
                throw 'Missing game outcome.';
            }
            
            // record the user choice.
            this.recordChoice(this.userHistory, userChoice);
            // record the computer choice.
            this.recordChoice(this.computerHistory, computerChoice);

            // add the outcome to the userRecord.
            switch(gameOutcome){
                case 'draw':
                    this.userRecord.draws++;
                    break;
                case 'user':
                    this.userRecord.wins++;
                    break;
                case 'computer':
                    this.userRecord.losses++;
                    break;
                default:
                    throw 'Missing game outcome.';
            }
        }
    }
}); 
