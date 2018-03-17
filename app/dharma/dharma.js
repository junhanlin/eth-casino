'use strict';
app.controller('Dharmatrl', ['$scope', 'web3Service', 'dharmaContractService', function ($scope, web3Service, dharmaContractService) {

    $scope.contractHandle = null;
    $scope.loanAmount = 0;
    $scope.depositAmount = 0; 
   

    $scope.walletAddress = null;
  
    

    $scope.submitDeposit = function () {
        if (!$scope.walletAddress) {
            alert('Wallet address is required');
            return;
        }
        if ($scope.depositAmount == null) {
            alert('Deposit amount is required');
            return;
        }
        

        $scope.contractHandle.makeDeposit($scope.depositAmount, $scope.walletAddress, function (err, result) {
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

        $scope.contractHandle.makeLoan($scope.loanAmount, $scope.walletAddress, function (err, result) {
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


        dharmaContractService.fetchContractHandle().then(function (result) {
            $scope.contractHandle = result;
            $scope.updateContractStatus();

        }, function (err) {
            console.error(err);
        });




    };
    $scope.init();


}]);