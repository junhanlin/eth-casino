pragma solidity ^0.4.17;
contract Dice {
    address public owner;
    Player public player1;
    Player public player2;
    address public thisTurn;
    uint public numOfPlayers;
    uint public howMuchToBet = 0;
    uint[] public publicSeq;
    uint public roundNumber = 0;
    uint public totalBets = 0;
    uint public startTime;
    uint public timeToWait = 2;
    uint public verified = 0;
    uint public confirmed = 0;
    bool public roundEnded = false;
    bool public gameEnded = false;
    bool public justConfirmed = false;
    uint[] privateSeqP1;
    uint[] privateSeqP2;
    
    struct Player {
        address addr;
        uint hash;
        uint[] diceFromPlayer;
        uint betMadeThisRound;
        uint[] betsMade; // each round
        bool lied;
    }
    function Dice() public {
        owner = msg.sender;
    }
    function generatePublicSeq() private {
        uint n = player1.hash + player2.hash;
        uint count = 0;
        while (count < 20) {
            publicSeq.push(n % 6 + 1);
            n /= 6;
            count++;
        }
    }
    function start(uint256 hashVal) public {
        require(numOfPlayers < 2);
        if (numOfPlayers == 0) {
            player1.addr = msg.sender;
            player1.hash = hashVal;
            player1.lied = false;
            thisTurn = player1.addr;
        } else if (numOfPlayers == 1) {
            player2.addr = msg.sender;
            player2.hash = hashVal;
            player2.lied = false;
            generatePublicSeq();
        }
        numOfPlayers++;
    }
    function changeTurn() private {
        if (thisTurn == player1.addr) thisTurn = player2.addr;
        else thisTurn = player1.addr;
    }
    function generateDiceNumber(string key) private view returns (uint[]) {
        uint[] memory privateSeq = new uint[](roundNumber);
        uint l = publicSeq.length;
        uint n = uint(sha256(key));
        for (uint i = 0; i < roundNumber; i++) {
            privateSeq[i] = publicSeq[n % l];
            n /= l;
        }
        return privateSeq;
    }
    function verify(string key) private {
        require(numOfPlayers == 2);
        require(gameEnded == true);
        if (msg.sender == player1.addr) {
            privateSeqP1 = generateDiceNumber(key);
        } else {
            privateSeqP2 = generateDiceNumber(key);
        }
        verified++;
        
        if (verified == 2) {
            verifyGame();
        }
    }
    // front-end calls this function if both players have verified
    function verifyGame() private {
        require(verified == 2);
        for (uint i = 0; i < roundNumber; i++) {
            if (player1.diceFromPlayer[i] > 0) {
                if (player1.diceFromPlayer[i] != privateSeqP1[i]) {
                    player1.lied = true;
                }
            }
            if (player2.diceFromPlayer[i] > 0) {
                if (player2.diceFromPlayer[i] != privateSeqP2[i]) {
                    player2.lied = true;
                }
            }
        }
        if (player1.lied && player2.lied) selfdestruct(owner);
        else if (player1.lied) player2.addr.transfer(totalBets);
        else if (player2.lied) player1.addr.transfer(totalBets);
        else {
            for (i = 0; i < roundNumber; i++) {
                if (privateSeqP1[i] > privateSeqP2[i]) {
                    player1.addr.transfer(player1.betsMade[i] + player2.betsMade[i]);
                } else if (privateSeqP1[i] < privateSeqP2[i]) {
                    player2.addr.transfer(player2.betsMade[i] + player2.betsMade[i]);
                } else { // tie
                    player1.addr.transfer(player1.betsMade[i]);
                    player2.addr.transfer(player2.betsMade[i]);
                }
            }
        }
        reset();
    }
    function reset() private {
        delete player1;
        delete player2;
        delete publicSeq;
        thisTurn = 0;
        numOfPlayers = 0;
        howMuchToBet = 0;
        roundNumber = 0;
        totalBets = 0;
        roundEnded = false;
        gameEnded = false;
        justConfirmed = false;
        
        confirmed = 0;
        verified = 0;
    }
    function raise() public payable {
        require(numOfPlayers == 2);
        require(msg.sender == thisTurn);
        require(msg.value >= howMuchToBet);
        require(roundEnded == false);
        require(gameEnded == false);
        if (justConfirmed) {
            justConfirmed = false;
            startTime = block.number;
        }
        if (player1.addr == msg.sender) { // player1's turn
            player1.betMadeThisRound += msg.value;
            howMuchToBet = player1.betMadeThisRound - player2.betMadeThisRound;
        } else { // player2's turn
            player2.betMadeThisRound += msg.value;
            howMuchToBet = player2.betMadeThisRound - player1.betMadeThisRound;
        }
        if (howMuchToBet == 0) { // call situation
            roundEnded = true;
            player1.betsMade.push(player1.betMadeThisRound);
            player2.betsMade.push(player2.betMadeThisRound);
        }
        totalBets += msg.value;
        changeTurn();
    }
    function reset_round() private {
        require(roundEnded == true);
        player1.betMadeThisRound = 0;
        player2.betMadeThisRound = 0;
        roundEnded = false;
        roundNumber++;
        confirmed = 0;
    }
    function fold() public {
        require(numOfPlayers == 2);
        require(roundEnded == false);
        require(gameEnded == false);
        require(msg.sender == thisTurn);
        if (thisTurn == player1.addr) {
            player2.addr.transfer(player1.betMadeThisRound + player2.betMadeThisRound);
        } else {
            player1.addr.transfer(player1.betMadeThisRound + player2.betMadeThisRound);
        }
        roundEnded = true;
        reset_round();
    }
    // single-hash value of privateKey of each player, and their accliamed inputs
    function confirm(uint playerDice) public {
        require(numOfPlayers == 2);
        require(roundEnded == true);
        require(justConfirmed == false);
        require(msg.sender == thisTurn);
        if (msg.sender == player1.addr) {
            player1.diceFromPlayer.push(playerDice);
            changeTurn();
        } else {
            player2.diceFromPlayer.push(playerDice);
            changeTurn();
        }
        confirmed++;
        if (confirmed == 2) {
            reset_round();
            justConfirmed = true;
        }
    }
    function endGame(string key) public {
        require(numOfPlayers == 2);
        require(justConfirmed == true);
        gameEnded = true;
        verify(key);
    }
    // call this function if second player is not confirming
    function requestRefund() public {
        require(confirmed == 1);
        require(block.number - startTime > timeToWait);
        
        if (thisTurn == player1.addr) {
            player2.addr.transfer(totalBets);
        } else {
            player1.addr.transfer(totalBets);
        }
    }

    function getDiceFromPlayer1Length() public constant returns (uint256) {
        return player1.diceFromPlayer.length;
    }
    function getDiceFromPlayer1(uint idx) public constant returns (uint) {
        return player1.diceFromPlayer[idx];
    }
    function getDiceFromPlayer2Length() public constant returns (uint256) {
        return player2.diceFromPlayer.length;
    }
    function getDiceFromPlayer2(uint idx) public constant returns (uint) {
        return player2.diceFromPlayer[idx];
    }
    function getPublicSeqLength() public constant returns (uint256) {
        return publicSeq.length;
    }
    function sha256ToUInt(string key) public constant returns (uint) {
        return uint(sha256(key));
    }

}