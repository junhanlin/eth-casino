'use strict';

// Declare app level module which depends on views, and components
angular.module('voteContract', ['web3'])
    .factory('voteContractService', function ($http, $q, web3Service) {
        var retVal = {};
        retVal.fetchContractInstance = function () {
            return $q(function (resolve, reject) {
                $http.get("contracts/Vote.json")
                    .success(function (data) {
                        var json = data;
                        var contract = web3.eth.contract(json.abi);
                        var contractInst = contract.at(json.networks['3'].address);
                        resolve(contractInst);
                    })
                    .error(function (err) {
                        reject(data);
                    });

            });
        };

        return retVal;


    });