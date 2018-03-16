'use strict';
app.controller('RaffleCtrl', ['$scope', 'web3Service','raffleContractService', function ($scope, web3Service, raffleContractService) {

    $scope.contractHandle = null;
    
    $scope.numberOfBets = null;
    $scope.totalBet = null;
    $scope.minimumBet = null;
    $scope.payouts = [];
    $scope.players = [];

    $scope.walletAddress = null;
    $scope.bet = null;

    $scope.updateContractStatus = function () {
        $scope.contractHandle.contractInst.getPlayersCount(function (err, result) {
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

        
        $scope.contractHandle.contractInst.getPayoutsCount(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    var count = parseInt(result);
                    $scope.payouts = Array.apply(null, Array(count));
                    $scope.payouts.forEach(function (n, idx) {
                        $scope.contractHandle.contractInst.payouts(idx, function (err, payout) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.payouts[idx] = {
                                    winner: payout[0],
                                    prize: parseFloat(web3Service.web3.fromWei(payout[1], 'ether'))
                                };
                            });
                        });
                    });
                });
            }
        });

        $scope.contractHandle.contractInst.getPlayersCount(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    var count = parseInt(result);
                    $scope.players = Array.apply(0, Array(count)).map(function(){
                        return {};
                    });
                    $scope.players.forEach(function (n, idx) {
                        $scope.contractHandle.contractInst.players(idx, function (err, address) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.players[idx].address = address;
                            });
                        });

                        $scope.contractHandle.contractInst.bets(idx, function (err, bet) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.players[idx].bet = parseFloat(web3Service.web3.fromWei(bet, 'ether'));
                            });
                        });
                    });
                });
            }
        });


        setTimeout(function(){
            console.log('Will refresh status...');
            $scope.updateContractStatus();
        },15000);


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
        
        $scope.contractHandle.bet($scope.bet, $scope.walletAddress, function (err, result) {
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

    $scope.init = function () {
        
        if (web3Service.web3.eth && web3Service.web3.eth.accounts && web3Service.web3.eth.accounts.length > 0) {
            // current user's address can be injected by Metamask
            $scope.walletAddress = web3Service.web3.eth.accounts[0];
        }


        raffleContractService.fetchContractHandle().then(function (result) {
            $scope.contractHandle = result;
            $scope.updateContractStatus();

            

        }, function (err) {
            console.error(err);
        });




    };
    $scope.init();

}]);