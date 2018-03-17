'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ui.router',
    'web3',
    'voteContract',
    'raffleContract',
    'lotteryContract',
    'diceContract',
    'dharmaContract'
  ])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {

    

    $stateProvider
      .state({
        name: 'home',
        url: '/home',
        abstract: true,
        views: {
          'main-ui-view': {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
          }
        }

      })
      .state({
        name: 'home.lobby',
        url: '/lobby',
        views: {
          'nav-view': {
            templateUrl: 'lobby/lobby.html',
            controller: 'LobbyCtrl'
          }

        }
      })
      .state({
        name: 'home.vote',
        url: '/vote',
        views: {
          'nav-view': {
            templateUrl: 'vote/vote.html',
            controller: 'VoteCtrl'
          }

        }
      })
      .state({
        name: 'home.raffle',
        url: '/raffle',
        views: {
          'nav-view': {
            templateUrl: 'raffle/raffle.html',
            controller: 'RaffleCtrl'
          }

        }
      })
      .state({
        name: 'home.lottery',
        url: '/lottery',
        views: {
          'nav-view': {
            templateUrl: 'lottery/lottery.html',
            controller: 'LotteryCtrl'
          }
        }
      })
      .state({
        name: 'home.dice',
        url: '/dice',
        views: {
          'nav-view': {
            templateUrl: 'dice/dice.html',
            controller: 'DiceCtrl'
          }
        }
      })
      .state({
        name: 'home.dharma',
        url: '/dharma',
        views: {
          'nav-view': {
            templateUrl: 'dharma/dharma.html',
            controller: 'DharmaCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/home/lobby');

  }]);