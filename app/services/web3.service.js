'use strict';

// Declare app level module which depends on views, and components
angular.module('web3', [])
  .factory('web3Service', function () {
    if (typeof web3 != 'undefined') {
      console.log("Using web3 detected from external source like Metamask")
      return new Web3(web3.currentProvider)
    } else {
      console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    }
  });