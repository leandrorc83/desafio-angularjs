'use strict';

angular.module('myApp.home', [])

	.config(function ($localStorageProvider) {

		$localStorageProvider.setKeyPrefix('myApp_');

	})

	.controller('homeCtrl', function ($scope, $http, $mdDialog, $localStorage) {

		$scope.fraseDoDia = '';

		/**
		 * Retorna uma frase motivacional.
		 * @type {undefined}
		 */
		$scope.getFraseDoDia = function () {

			if ($localStorage.frasesDoDia != undefined) {
				$scope.fraseDoDia = getFrase();
			} else {

				return $http.get('https://type.fit/api/quotes').then(
					function (response) {
						$localStorage.frasesDoDia = response.data;
						$scope.fraseDoDia = getFrase();
					},
					function (response) {
						//$scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
						$scope.fraseDoDia = false;
					}
				);

			}

		}();

		/**
		 * Retorna a frase do localStorage.
		 * @returns {*}
		 */
		function getFrase() {

            var frase = $localStorage.frasesDoDia[getRandomInt(0, $localStorage.frasesDoDia.length - 1)];
            return frase;

		}

		/**
		 * Retorna um número aleatório entre min e max.
		 * @param min
		 * @param max
		 * @returns {number}
		 */
		function getRandomInt(min, max) {

			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;

		}

	});