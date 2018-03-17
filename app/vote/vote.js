'use strict';
app.controller('VoteCtrl', ['$scope', 'web3Service', 'voteContractService', function ($scope, web3Service, voteContractService) {

    $scope.contractHandle = null;
    $scope.numbers = [];
    $scope.numberOfBets = null;
    $scope.totalBet = null;
    $scope.minimumBet = null;
    $scope.maxAmountOfBets = null;
    $scope.lastBetWinners = [];
    $scope.lastBetPrize = null;

    $scope.walletAddress = null;
    $scope.bet = null;
    $scope.selectedNumber = null;
    $scope.selectedWinningNumber = null;

    $scope.updateContractStatus = function () {
        $scope.contractHandle.contractInst.numberOfBets(function (err, result) {
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
        $scope.contractHandle.contractInst.totalBet(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.totalBet = parseFloat(web3Service.web3.fromWei(result, 'ether'));
                });
            }
        });
        $scope.contractHandle.contractInst.minimumBet(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.minimumBet = parseFloat(web3Service.web3.fromWei(result, 'ether'));
                });
            }
        });

        $scope.contractHandle.contractInst.lastBetPrize(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.lastBetPrize = parseFloat(web3Service.web3.fromWei(result, 'ether'));
                });
            }
        });
        $scope.contractHandle.contractInst.getLastBetWinnerCount(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    var count = parseInt(result);
                    $scope.lastBetWinners = Array.apply(0, Array(count));
                    $scope.lastBetWinners.forEach(function (n, idx) {
                        $scope.contractHandle.contractInst.lastBetWinners(idx, function (err, winner) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.lastBetWinners[idx] = winner;
                            });
                        });
                    });
                });
            }
        });


    };

    $scope.submit = function () {
        if (!$scope.walletAddress) {
            alert('Wallet address is required');
            return;
        }
        if ($scope.bet == null) {
            alert('Bet is required');
            return;
        }
        if ($scope.bet < $scope.minimumBet) {
            alert('You must bet more than the minimum');
        }
        if ($scope.selectedNumber == null) {
            alert('Number not selected');
            return;
        }

        $scope.contractHandle.bet($scope.selectedNumber, $scope.bet, $scope.walletAddress, function (err, result) {
            if (err) {
                alert('Transaction failed!');
                console.error(err);
                return;
            }
            if (result) {
                alert('Transaction done!');
                console.log(result);

            }
        });





    }
    $scope.distributePrizes = function () {
        if ($scope.selectedWinningNumber == null) {
            alert('Winning number not selected');
            return;
        }
        $scope.contractHandle.distributePrizes(parseInt($scope.selectedWinningNumber), $scope.walletAddress, function (err, result) {
            if (err) {
                alert('Transaction failed!');
                console.error(err);
                return;
            }
            if (result) {
                alert('Transaction done!');
                console.log(result);

            }
        });
    };

    $scope.init = function () {
        $scope.numbers = Array.apply(0, Array(10)).map(function (n, idx) {
            return idx + 1;
        });

        if (web3Service.web3.eth && web3Service.web3.eth.accounts && web3Service.web3.eth.accounts.length > 0) {
            // current user's address can be injected by Metamask
            $scope.walletAddress = web3Service.web3.eth.accounts[0];
        }


        voteContractService.fetchContractHandle().then(function (result) {
            $scope.contractHandle = result;
            $scope.updateContractStatus();

        }, function (err) {
            console.error(err);
        });




    };
    $scope.init();


}]);