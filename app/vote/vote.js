'use strict';
app.controller('VoteCtrl', ['$scope', 'web3Service', 'voteContractService', function ($scope, web3Service, voteContractService) {

    $scope.contractInst = null;
    $scope.numbers = [];
    $scope.numberOfBets = null;
    $scope.totalBet = null;
    $scope.minimumBet = null;
    $scope.maxAmountOfBets = null;

    $scope.walletAddress = null;
    $scope.bet = null;
    $scope.selectedNumber = null;

    $scope.updateContractStatus = function () {
        $scope.contractInst.numberOfBets(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.numberOfBets = parseInt(result);
                });
            }
        });
        $scope.contractInst.totalBet(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.totalBet = parseFloat(web3Service.fromWei(result, 'ether'));
                });
            }
        });
        $scope.contractInst.minimumBet(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.minimumBet = parseFloat(web3Service.fromWei(result, 'ether'));
                });
            }
        });
        $scope.contractInst.maxAmountOfBets(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.maxAmountOfBets = parseInt(result);
                });
            }
        });
        
    };

    $scope.submit = function(){
        if(!$scope.walletAddress){
            alert('Wallet address is required');
            return;
        }
        if($scope.bet == null){
            alert('Bet is required');
            return;
        }
        if($scope.bet < $scope.minimumBet){
            alert('You must bet more than the minimum');
        }
        if($scope.selectedNumber == null){
            alert('Number not selected');
            return;
        }

        $scope.contractInst.bet($scope.selectedNumber, {
            gas: 300000,
            from: $scope.walletAddress,
            value: web3Service.toWei($scope.bet, 'ether')
         }, function(err, result) {
            if (err) {
                alert('Transaction failed!');
                console.error(err);
                return;
            }
            if(result){
                alert('Transaction done!');
                console.log(result);
                
            }
         })



    }

    $scope.init = function () {
        $scope.numbers = Array.apply(0, Array(10)).map(function (n, idx) {
            return idx + 1;
        });

        if(web3Service.eth && web3Service.eth.accounts && web3Service.eth.accounts.length > 0){
            // current user's address can be injected by Metamask
            $scope.walletAddress = web3Service.eth.accounts[0];
        }
        

        voteContractService.fetchContractInstance().then(function (result) {
            $scope.contractInst = result;
            $scope.updateContractStatus();

        }, function (err) {
            console.error(err);
        });




    };
    $scope.init();


}]);