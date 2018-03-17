'use strict';

// Declare app level module which depends on views, and components
angular.module('lotteryContract', ['web3'])
    .factory('lotteryContractService', function ($http, $q, web3Service) {
        var retVal = {};
        retVal.fetchContractHandle = function () {
            return $q(function (resolve, reject) {
                $http.get("contracts/Lottery.json")
                    .success(function (data) {
                        var json = data;
                        var contract = web3Service.web3.eth.contract(json.abi);
                        var contractInst = contract.at(json.networks['3'].address);


                        resolve({
                            contractInst: contractInst,
                            bet: function (numbers, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.bet(numbers, {
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0.1, 'ether')
                                    }, cb);

                                } else {
                                    web3Service.web3.eth.getTransactionCount(account, function (err, latestNonce) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                        var data = contractInst.bet.getData(number);
                                        var tx = new ethereumjs.Tx({
                                            nonce: web3Service.web3.toHex(latestNonce),
                                            gasPrice: web3Service.web3.toHex(web3Service.web3.toWei(100, 'gwei')),
                                            gasLimit: web3Service.web3.toHex(3000000),
                                            from: account,
                                            to: contractInst.address,
                                            data: data,
                                            value: web3Service.web3.toHex(web3Service.web3.toWei(0.1, 'ether'))
                                        });
                                        tx.sign(web3Service.txSigningKey);
                                        var serializedTx = '0x' + tx.serialize().toString('hex')
                                        web3Service.web3.eth.sendRawTransaction(serializedTx, cb);


                                    });
                                }




                            },
                            generateWinner: function (numbers, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.generateWinner(numbers, {
                                        gas: 3600000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    
                                }




                            },
                        });
                    })
                    .error(function (err) {
                        reject(data);
                    });

            });
        };



        return retVal;


    });