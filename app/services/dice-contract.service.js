'use strict';

// Declare app level module which depends on views, and components
angular.module('diceContract', ['web3'])
    .factory('diceContractService', function ($http, $q, web3Service) {
        var retVal = {};
        retVal.fetchContractHandle = function () {
            return $q(function (resolve, reject) {
                $http.get("contracts/Dice.json")
                    .success(function (data) {
                        var json = data;
                        var contract = web3Service.web3.eth.contract(json.abi);
                        var contractInst = contract.at(json.networks['3'].address);


                        resolve({
                            contractInst: contractInst,
                            start: function (hashVal, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.start(hashVal, {
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    console.log('Unimplemented!!!');
                                }
                            },
                            raise: function (bet, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.raise({
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(bet, 'ether')
                                    }, cb);

                                } else {
                                    console.log('Unimplemented!!!');
                                }
                            },
                            fold: function (account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.fold({
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    console.log('Unimplemented!!!');
                                }
                            },
                            endGame: function (key, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.endGame(key, {
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    console.log('Unimplemented!!!');
                                }
                            },
                            confirm: function (playerDice, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.confirm(playerDice, {
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    console.log('Unimplemented!!!');
                                }
                            },
                            requestRefund: function (account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.requestRefund({
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    console.log('Unimplemented!!!');
                                }
                            }
                        });
                    })
                    .error(function (err) {
                        reject(data);
                    });

            });
        };



        return retVal;


    });