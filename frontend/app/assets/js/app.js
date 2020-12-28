'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
    'ngRoute',
    'ngMessages',
    'ngMaterial',
    'md.data.table',
    'myApp.funcionario',
    'myApp.curso',
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/funcionario'});

}]).controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdDialog, $http) {

    $scope.apiHost = 'http://localhost:8082/api/';

    $scope.toggleLeft = buildDelayedToggler('left');

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle();
        }, 200);
    }

    /**
     * Chama o alertDialog com mensagem relativa a erros de validação de formulário.
     */
    $scope.alertDialogForm = function(){

        $scope.alertDialog('erro', 'Erro', 'Verifique os erros no formulário.');

    }

    /**
     * Dispara o alert do mdDialog.
     * @param content
     */
    $scope.alertDialog = function(tipo, titulo, conteudo){

        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(titulo)
                .textContent(conteudo)
                //.ariaLabel('Alert Dialog Demo')
                .ok('OK')
                //.targetEvent(ev)
        );

    }

    $scope.getDados = function(url, objParams, fnPreencher){

        $http.get($scope.apiHost + url, objParams).then(
            function (response) {
                if (response.data.erro != undefined) {
                    $scope.alertDialog('erro', 'Erro', response.data.erro);
                }
                fnPreencher.call(response.data);
            },
            function (response) {
                $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
            }
        );

    }

    $scope.salvarDados = function(url, formValido, objDados){

        if (!formValido) {
            $scope.alertDialogForm();
        } else {
            $http.post($scope.apiHost + url, objDados).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    } else {
                        $scope.alertDialog('sucesso', 'Sucesso', 'Dados salvos com sucesso!');
                    }
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );
        }

    }

});
