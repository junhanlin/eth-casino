pragma solidity ^0.4.17;
contract Lottery {
    address public owner;
    uint public minimumBet = 100 finney; // 0.1 eth
    uint public totalBet;
    uint public minNumberOfBets = 1000;
    address[] public players;
    uint[6][] public bets;
    uint timeEachRound = 2; // 8064 is two weeks
    uint startBlock;
    uint[6] public winningNumbers;
    
    // number of matches
    uint[] matches;
    address[] threeMatches; // 15%
    address[] fourMatches; // 35%
    address[] fiveMatches; // 50%

    Payout[] public payouts;
    struct Payout {
        address winner;
        uint256 prize;
        uint matches;
    }

    function Lottery() public {
        owner = msg.sender;
        startBlock = block.number;
    }
/*    function kill() public { // do we want this private?
        if(msg.sender == owner) {
            // return each bet to each player before destroying the contract
            for (uint i=0; i < players.length; i++) {
                players[i].transfer(bets[i]);
            }
            selfdestruct(owner);
        }
    } */
    /*function checkPlayerExists(address player) public constant returns(bool){
       if (!playerInfo[player].isIn) {
           return false;
       }
       return true;
   }*/

    function getPlayersCount() public constant returns(uint256) {
        return players.length;
    }
    function getPayoutsCount() public constant returns(uint256) {
        return payouts.length;
    }
    function bet(uint[6] bettingNumbers) public payable {
        require(msg.value >= minimumBet);
        players.push(msg.sender);
        bets.push(bettingNumbers);
        totalBet += msg.value;
    }
    // reset totalBet/players/bets after each round
    function reset() private {
        delete players;
        delete bets;
    }
    function insert(uint loc, uint val) private {
        if (winningNumbers[loc] == 0){
            winningNumbers[loc] = val;
        } else {
            for (uint i = 1; i < loc; i++){
                winningNumbers[i - 1] = winningNumbers[i];
            }
            winningNumbers[loc] = val;
        }
    }
    function match_num(uint[6] ticket, uint c) private view returns (uint) {
        uint index1 = 0;
        uint index2 = 0;
        uint result = 0;
        for (uint k = 0; k < 2 * c; k ++) {
            if (index1 == c || (index2 != c && winningNumbers[index1] >= ticket[index2])) {
                if (index1 < c && index2 < c && winningNumbers[index1] == ticket[index2]) { 
                    result++; 
                }
                index2 += 1;
            } else {
                index1 += 1;
            }
        }
        return(result);
    }
    function generateWinningNumbers() private {
        uint hashVal = uint(block.blockhash(block.number));
        uint powerball = hashVal % 26;
        hashVal /= 26;
        uint c = 0;
        uint i = 0;
        uint j = 0;
        uint thisNum = hashVal % 69;
        for (i = 0; i < winningNumbers.length; i++) {
            if (winningNumbers[i] == thisNum) {
                break;
            } else {
                j = 0;
                while (winningNumbers[j] < thisNum && j < 5) {
                    j++;
                }
                insert(j, thisNum);
            }
        }
            // previous for loop passed without a problem
        if (i == winningNumbers.length) {
            winningNumbers[c] = thisNum;
            hashVal /= 69;
            c++;
        }
        // c == 5
        winningNumbers[c] = powerball;
    }
    // Pick a winner with probability proportional to each player's betting amount
    function generateWinner(uint[6] testWinningNumbers) public {
        require(msg.sender == owner);
        
        delete payouts;
        if (testWinningNumbers.length != 6) {
            generateWinningNumbers();
        } else {
            winningNumbers = testWinningNumbers;
        }
        
        for (uint i = 0; i < bets.length; i++) {
            matches.push(match_num(bets[i], 5));
        }
        for (uint j = 0; j < matches.length; j++) {
            if (matches[j] == 3) threeMatches.push(players[j]);
            else if (matches[j] == 4) fourMatches.push(players[j]);
            else if (matches[j] == 5) fiveMatches.push(players[j]);
        }
        for (i = 0; i < threeMatches.length; i++) {
            uint256 prize = totalBet * 15 / 100 / threeMatches.length;
            threeMatches[i].transfer(prize);
            totalBet -= prize;
            payouts.push(Payout(threeMatches[i],prize,3));

        }
        for (i = 0; i < fourMatches.length; i++) {
            prize = totalBet * 35 / 100 / fourMatches.length;
            fourMatches[i].transfer(prize);
            totalBet -= prize;
            payouts.push(Payout(fourMatches[i],prize,4));
        }
        for (i = 0; i < fiveMatches.length; i++) {
            prize = totalBet * 50 / 100 / fiveMatches.length;
            fiveMatches[i].transfer(prize);
            totalBet -= prize;
            payouts.push(Payout(fiveMatches[i],prize,5));
        }
        reset();
        // Maybe consider pay the player triggering the winner selecting function the extra gas
        // distributePrizes(winner);
    }
}