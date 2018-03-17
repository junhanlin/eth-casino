pragma solidity ^0.4.17;
contract Dharma {
    address owner;
    function Dharma() public {
        owner = msg.sender;
    }
    
    function makeDeposit(uint howMuch) public payable {
    }
    
    function makeLoan(uint howMuch) public {
        msg.sender.transfer(howMuch);
    }
    
}