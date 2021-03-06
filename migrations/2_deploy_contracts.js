var Vote = artifacts.require("./Vote.sol");
var Raffle = artifacts.require("./Raffle.sol");
var Lottery = artifacts.require("./Lottery.sol");
var Dice = artifacts.require("./Dice.sol");
var Dharma = artifacts.require("./Dharma.sol");
module.exports = function (deployer) {
    deployer.deploy(Vote, {
        gas: 3000000
    });
    deployer.deploy(Raffle, {
        gas: 3000000
    });
    deployer.deploy(Lottery, {
        gas: 3000000
    });
    deployer.deploy(Dice, {
        gas: 3000000
    });
    deployer.deploy(Dharma, {
        gas: 3000000
    });
};