'use strict';
app.controller('DiceCtrl', ['$scope', 'web3Service', 'diceContractService', function ($scope, web3Service, diceContractService) {

    $scope.contractHandle = null;
    $scope.player1 = {

    };
    $scope.player2 = {

    }
    $scope.thisTurn;
    $scope.howMuchToBet;
    $scope.publicSeq = [];
    $scope.roundNumber;
    $scope.totalBets;
    $scope.verified;
    $scope.confirmed;
    $scope.roundEnded;
    $scope.gameEnded;
    $scope.justConfirmed;


    /*
    address public owner;
    Player public player1;
    Player public player2;
    address public thisTurn;
    uint public numOfPlayers;
    uint public howMuchToBet = 0;
    uint[] publicSeq;
    uint public roundNumber = 0;
    uint public totalBets = 0;
    uint public startTime;
    uint public timeToWait = 2;
    uint public verified = 0;
    uint public confirmed = 0;
    bool public roundEnded = false;
    bool public gameEnded = false;
    bool public justConfirmed = false;
    uint[] privateSeqP1;
    uint[] privateSeqP2;
    struct Player {
        address addr;
        uint hash;
        uint[] diceFromPlayer;
        uint betMadeThisRound;
        uint[] betsMade; // each round
        bool lied;
    }
    */

    
    $scope.walletAddress = null;
    $scope.updateContractStatus = function () {
        $scope.contractHandle.contractInst.player1(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.player1 = {
                        addr: result.addr,
                        hash: result.hash,
                        diceFromPlayer: result.diceFromPlayer,
                    };
                });
            }
        });
        $scope.contractHandle.contractInst.player2(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.player2 = {
                        addr: result.addr,
                        hash: result.hash,
                        diceFromPlayer: result.diceFromPlayer,
                    };
                });
            }
        });
        // $scope.contractHandle.contractInst.totalBet(function (err, result) {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     if (result != null) {
        //         $scope.$apply(function () {
        //             $scope.totalBet = parseFloat(web3Service.web3.fromWei(result, 'ether'));
        //         });
        //     }
        // });
        // $scope.contractHandle.contractInst.minimumBet(function (err, result) {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     if (result != null) {
        //         $scope.$apply(function () {
        //             $scope.minimumBet = parseFloat(web3Service.web3.fromWei(result, 'ether'));
        //         });
        //     }
        // });


        // $scope.contractHandle.contractInst.getPayoutsCount(function (err, result) {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     if (result != null) {
        //         $scope.$apply(function () {
        //             var count = parseInt(result);
        //             $scope.payouts = Array.apply(null, Array(count));
        //             $scope.payouts.forEach(function (n, idx) {
        //                 $scope.contractHandle.contractInst.payouts(idx, function (err, payout) {
        //                     if (err) {
        //                         console.error(err);
        //                         return;
        //                     }
        //                     $scope.$apply(function () {
        //                         $scope.payouts[idx] = {
        //                             winner: payout[0],
        //                             prize: parseFloat(web3Service.web3.fromWei(payout[1], 'ether'))
        //                         };
        //                     });
        //                 });
        //             });
        //         });
        //     }
        // });

        // $scope.contractHandle.contractInst.getPlayersCount(function (err, result) {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     if (result != null) {
        //         $scope.$apply(function () {
        //             var count = parseInt(result);
        //             $scope.players = Array.apply(0, Array(count)).map(function () {
        //                 return {
        //                     numbers: []
        //                 };
        //             });
        //             $scope.players.forEach(function (n, idx) {
        //                 $scope.contractHandle.contractInst.players(idx, function (err, address) {
        //                     if (err) {
        //                         console.error(err);
        //                         return;
        //                     }
        //                     $scope.$apply(function () {
        //                         $scope.players[idx].address = address;
        //                     });
        //                 });

        //                 Array.apply(0, Array(6)).forEach(function (x, numOrder) {
        //                     $scope.contractHandle.contractInst.bets(idx, numOrder, function (err, number) {
        //                         if (err) {
        //                             console.error(err);
        //                             return;
        //                         }
        //                         $scope.$apply(function () {
        //                             $scope.players[idx].numbers[numOrder] = parseInt(number);
        //                         });
        //                     });
        //                 });




        //             });
        //         });
        //     }
        // });


    };

    $scope.getSelection = function () {
        var retVal = Array.apply(0, Array(6)).map(function (n, idx) {
            return null;
        });
        if ($scope.selectedWhiteNumbers) {
            $scope.selectedWhiteNumbers.forEach(function (n, idx) {
                retVal[idx] = parseInt(n);
            });
        }
        if ($scope.selectedPowerNumber) {
            retVal[5] = parseInt($scope.selectedPowerNumber);
        }
        return retVal;

    };

    $scope.submit = function () {
        if (!$scope.walletAddress) {
            alert('Wallet address is required');
            return;
        }

        if (!$scope.selectedWhiteNumbers || $scope.selectedWhiteNumbers.length != 5) {
            alert('You must select 5 white number');
            return;
        }

        if (!$scope.selectedPowerNumber) {
            alert('You must select a power number');
            return;
        }


        $scope.contractHandle.bet($scope.getSelection(), $scope.walletAddress, function (err, result) {
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
        $scope.allWhiteNumbers = Array.apply(0, Array(69)).map(function (n, idx) {
            return idx + 1;
        });
        $scope.allPowerNumbers = Array.apply(0, Array(26)).map(function (n, idx) {
            return idx + 1;
        });

        if (web3Service.web3.eth && web3Service.web3.eth.accounts && web3Service.web3.eth.accounts.length > 0) {
            // current user's address can be injected by Metamask
            $scope.walletAddress = web3Service.web3.eth.accounts[0];
        }


        diceContractService.fetchContractHandle().then(function (result) {
            $scope.contractHandle = result;
            $scope.updateContractStatus();

        }, function (err) {
            console.error(err);
        });




    };
    $scope.init();


}]);