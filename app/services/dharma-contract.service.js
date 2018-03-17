'use strict';

// Declare app level module which depends on views, and components
angular.module('dharmaContract', ['web3'])
    .factory('dharmaContractService', function ($http, $q, web3Service) {
        var retVal = {};
        retVal.fetchContractHandle = function () {
            return $q(function (resolve, reject) {
                $http.get("contracts/Dharma.json")
                    .success(function (data) {
                        var json = data;
                        var contract = web3Service.web3.eth.contract(json.abi);
                        var contractInst = contract.at(json.networks['3'].address);


                        resolve({
                            contractInst: contractInst,
                            makeDeposit: function (amount, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.makeDeposit(amount, {
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {
                                    
                                }




                            },
                            makeDeposit: function (amount, account, cb) {

                                if (typeof web3 != 'undefined') {
                                    contractInst.makeDeposit(amount, {
                                        gas: 300000,
                                        from: account,
                                        value: web3Service.web3.toWei(0, 'ether')
                                    }, cb);

                                } else {

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