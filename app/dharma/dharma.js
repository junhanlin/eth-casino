'use strict';
app.controller('DharmaCtrl', ['$scope', 'web3Service', 'dharmaContractService', function ($scope, web3Service, dharmaContractService) {

    $scope.contractHandle = null;
    $scope.loanAmount = 0;
    $scope.depositAmount = 0; 
   

    $scope.walletAddress = null;
  
    

    $scope.deposit = function () {
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

        





    }
    $scope.loan = function () {
        if (!$scope.walletAddress) {
            alert('Wallet address is required');
            return;
        }
        if ($scope.loanAmount == null) {
            alert('Deposit amount is required');
            return;
        }
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
    };

    $scope.init = function () {
        

        if (web3Service.web3.eth && web3Service.web3.eth.accounts && web3Service.web3.eth.accounts.length > 0) {
            // current user's address can be injected by Metamask
            $scope.walletAddress = web3Service.web3.eth.accounts[0];
        }


        dharmaContractService.fetchContractHandle().then(function (result) {
            $scope.contractHandle = result;
            

        }, function (err) {
            console.error(err);
        });




    };
    $scope.init();


}]);