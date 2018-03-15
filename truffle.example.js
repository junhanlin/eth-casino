var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "FILL IN YOUR MNEMONIC WORDS HERE!!!";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/<YOUR INFURA API KEY>");
      },
      network_id: '3',
      gas: 2900000
    },
  }
};