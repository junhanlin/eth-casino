var Casino = artifacts.require("./Vote.sol");
module.exports = function (deployer) {
    deployer.deploy(Casino,web3.toWei(0.1, 'ether'), {
        gas: 3000000
    });
};