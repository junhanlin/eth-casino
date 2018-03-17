var Vote = artifacts.require("./Vote.sol");
var Raffle = artifacts.require("./Raffle.sol");
var Lottery = artifacts.require("./Lottery.sol");
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
};