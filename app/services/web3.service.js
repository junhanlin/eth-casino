'use strict';
// Declare app level module which depends on views, and components
angular.module('web3', [])
  .factory('web3Service', function () {
    var retVal = {
      txSigningKey: ethereumjs.Buffer.Buffer.from('FILL IN YOUR PRIVATE KEY HERE!!!', 'hex')
    };
    if (typeof web3 != 'undefined') {
      console.log("Development: Using web3 detected from external source like Metamask")
      retVal.web3 = new Web3(web3.currentProvider)
    } else {
      var providerEndpoint = 'https://ropsten.infura.io/zhZ3bhWIemP48zPyEE3W';
      console.log("Using web3 http provider " + providerEndpoint + ". Consider switching to Metamask for development.");
      retVal.web3 = new Web3(new Web3.providers.HttpProvider(providerEndpoint))
    }
    return retVal;
  });