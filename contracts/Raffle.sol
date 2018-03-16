pragma solidity ^0.4.17;
contract Raffle {
    address public owner;
    uint256 public minimumBet = 100 finney; // 0.1 eth
    uint256 public totalBet;

    uint256 public maxNumberOfBets = 1000;
    address[] public players;
    uint256[] public bets;
    uint256 timeEachRound = 60; // secs
    uint256 startTime;
    Payout[] public payouts;

    struct Payout {
        address winner;
        uint256 prize;
    }

    function Raffle() public {
        owner = msg.sender;
    }
    function kill() public { // do we want this private?
        if (msg.sender == owner) {
            // return each bet to each player before destroying the contract
            for (uint i = 0; i < players.length; i++) {
                players[i].transfer(bets[i]);
            }  
            selfdestruct(owner);
        }
    }

    function bet() public payable {
        require(msg.value >= minimumBet);
        
        players.push(msg.sender);
        bets.push(msg.value);
        totalBet += msg.value;

        if (players.length == 1) {
            startTime = now;
        }

        if (startTime + timeEachRound <= now || 
            players.length >= maxNumberOfBets){
            generateNumberWinner();
        }
    }

    // reset totalBet/players/bets after each round
    function reset() private {
        totalBet = 0;
        delete players;
        delete bets;
    }
    
    function getPlayersCount() public constant returns(uint256) {
        return players.length;
    }
    function getPayoutsCount() public constant returns(uint256) {
        return payouts.length;
    }

    // Pick a winner with probability proportional to each player's betting amount
    function generateNumberWinner() private {
        uint256 numberGenerated = uint256(block.blockhash(block.number)) % totalBet + 1; // This isn't secure
        uint256 cumulativeBet = 0;
        for (uint i = 0; i < players.length; i++) {
            if (numberGenerated <= bets[i] + cumulativeBet && numberGenerated > cumulativeBet) {
                address winner = players[i];
                break;
            }
            cumulativeBet += bets[i];
        }
        winner.transfer(totalBet);
        payouts.push(Payout(winner,totalBet));
        reset();
        // Maybe consider pay the player triggering the winner selecting function the extra gas
        // distributePrizes(winner);
    }
    
    
}