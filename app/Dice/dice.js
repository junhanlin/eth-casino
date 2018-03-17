'use strict';
app.controller('DiceCtrl', ['$scope', 'web3Service', 'diceContractService', function ($scope, web3Service, diceContractService) {


    $scope.contractHandle = null;
    $scope.privateKey = 'hello world';
    $scope.player1 = {

    };
    $scope.player2 = {

    }
    $scope.thisTurn;
    $scope.numOfPlayers;
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
    $scope.raiseAmount = 0.3;
    $scope.diceNumber = null;

    $scope.isPlayer = function () {
        return ($scope.player1 && $scope.player1.addr == $scope.walletAddress) || ($scope.player2 && $scope.player2.addr == $scope.walletAddress);
    }
    $scope.isBystander = function () {
        return !$scope.canStartGame() && !$scope.isPlayer();
    }

    $scope.canStartGame = function () {
        return $scope.numOfPlayers < 2 && !$scope.isPlayer();
    };
    $scope.canRaise = function () {
        return !$scope.shouldWait() && !$scope.roundEnded && $scope.thisTurn == $scope.walletAddress;
    };
    $scope.canConfirm = function () {
        return !$scope.shouldWait() && $scope.roundEnded && !$scope.justConfirmed && $scope.thisTurn == $scope.walletAddress;
    };

    $scope.mustEndGame = function(){
        return !$scope.shouldWait() && $scope.gameEnded && $scope.verified == 1;
    };


    $scope.shouldWait = function () {
        if ($scope.canStartGame()) {
            return false;
        }
        return ($scope.isPlayer() && $scope.numOfPlayers == 1) || // wait join
            (!$scope.roundEnded && $scope.thisTurn != $scope.walletAddress) || // wait raising
            ($scope.roundEnded && !$scope.justConfirmed && $scope.thisTurn != $scope.walletAddress) || // wait confirm
            ($scope.gameEnded && $scope.verified == 1 && $scope.player1.addr == $scope.walletAddress) // wait end game
        ;
    };



    $scope.join = function () {
        var hashKey = "0x" + CryptoJS.SHA256($scope.privateKey).toString();
        $scope.contractHandle.start(hashKey, $scope.walletAddress, function (err, result) {
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

    $scope.raise = function () {

        $scope.contractHandle.raise($scope.raiseAmount, $scope.walletAddress, function (err, result) {
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

    $scope.updateContractStatus = function () {
        $scope.contractHandle.contractInst.numOfPlayers(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.numOfPlayers = parseInt(result);
                });
            }
        });
        $scope.contractHandle.contractInst.player1(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.player1 = {
                        addr: result[0],
                        hash: result[1],
                        diceFromPlayer: [],
                    };

                    $scope.contractHandle.contractInst.getDiceFromPlayer1Length(function (err, result) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        if (result != null) {
                            $scope.$apply(function () {
                                var count = parseInt(result);
                                $scope.player1.diceFromPlayer = Array.apply(null, Array(count));
                                $scope.player1.diceFromPlayer.forEach(function (n, idx) {
                                    $scope.contractHandle.contractInst.getDiceFromPlayer1(idx, function (err, diceFromPlayer1) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                        $scope.$apply(function () {
                                            $scope.player1.diceFromPlayer[idx] = diceFromPlayer1;
                                        });
                                    });
                                });
                            });
                        }
                    });
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
                        addr: result[0],
                        hash: result[1],
                        diceFromPlayer: [],
                    };

                    $scope.contractHandle.contractInst.getDiceFromPlayer2Length(function (err, result) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        if (result != null) {
                            $scope.$apply(function () {
                                var count = parseInt(result);
                                $scope.player2.diceFromPlayer = Array.apply(null, Array(count));
                                $scope.player2.diceFromPlayer.forEach(function (n, idx) {
                                    $scope.contractHandle.contractInst.getDiceFromPlayer2(idx, function (err, diceFromPlayer2) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                        $scope.$apply(function () {
                                            $scope.player2.diceFromPlayer[idx] = diceFromPlayer2;
                                        });
                                    });
                                });
                            });
                        }
                    });

                });
            }
        });
        $scope.contractHandle.contractInst.roundEnded(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.roundEnded = result;
                });
            }
        });
        $scope.contractHandle.contractInst.thisTurn(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.thisTurn = result;
                });
            }
        });
        $scope.contractHandle.contractInst.justConfirmed(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.justConfirmed = result;
                });
            }
        });
        $scope.contractHandle.contractInst.roundNumber(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.roundNumber = parseInt(result);
                });
            }
        });


        $scope.contractHandle.contractInst.getPublicSeqLength(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    var count = parseInt(result);
                    $scope.publicSeq = Array.apply(null, Array(count));
                    $scope.publicSeq.forEach(function (n, idx) {
                        $scope.contractHandle.contractInst.publicSeq(idx, function (err, element) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            $scope.$apply(function () {
                                $scope.publicSeq[idx] = element;
                            });
                        });
                    });
                });
            }
        });
        $scope.contractHandle.contractInst.howMuchToBet(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            if (result != null) {
                $scope.$apply(function () {
                    $scope.howMuchToBet = parseFloat(web3Service.web3.fromWei(result, 'ether'))
                });
            }
        });




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

    $scope.calcPrivateSeq = function (cb) {

        $scope.contractHandle.contractInst.sha256ToUInt($scope.privateKey, function (err, N) {
            if (err) {
                console.error(err);
                return;
            }
            if (N != null) {
                var privateSeq = Array.apply(0, Array($scope.roundNumber));
                var l = $scope.publicSeq.length;
                var n = parseInt(N)
                for (var i = 0; i < 50; i++) {
                    privateSeq[i] = $scope.publicSeq[n % l];
                    n /= l;
                }
                cb(privateSeq);
            }
        });
    };
    $scope.showCurrRoundDiceNum = function () {
        $scope.calcPrivateSeq(function (privateSeq) {
            alert(privateSeq[$scope.roundNumber]);
        });

    };
    $scope.confirm = function () {
        $scope.calcPrivateSeq(function (privateSeq) {
            var diceNum = parseInt(privateSeq[$scope.roundNumber]);
            $scope.contractHandle.confirm(diceNum, $scope.walletAddress, function (err, result) {
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
        });

    };

    $scope.fold = function () {
        $scope.contractHandle.fold($scope.walletAddress, function (err, result) {
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
    $scope.endGame = function () {
        $scope.contractHandle.endGame($scope.privateKey,$scope.walletAddress, function (err, result) {
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