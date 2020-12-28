'use strict';

angular.module('myApp.funcionario', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/funcionario', {

            templateUrl: 'funcionario/lista.html',
            controller: 'funcionarioListaCtrl'

        }).when('/funcionario/dados/:id?', {

            templateUrl: 'funcionario/dados.html',
            controller: 'funcionarioFormCtrl'

        });
    }])

    .controller('funcionarioListaCtrl', function ($scope, $http) {

        $scope.funcionarios = [];

        $scope.selected = [];

        $scope.query = {
            order: 'nome',
            limit: 5,
            page: 1
        };

        //$scope.promise = null;

        /**
         * Salva dados do funcionário no backend ou emite alerta em caso de erro.
         * @returns {*}
         */
        $scope.listar = function () {

             $http.get($scope.apiHost + 'funcionario/listar', $scope.query).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    $scope.funcionarios = response.data;
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }();

    })

    .controller('funcionarioFormCtrl', function ($scope, $http, $routeParams) {

        $scope.funcionario = {id: '', nome: '', telefone: '', endereco: '', dt_admissao: ''};

        $scope.acao = $routeParams.id != undefined ? 'Visualizar/Editar' : 'Cadastrar';

        $scope.getFuncionario = function(id){

            $http.get($scope.apiHost + 'funcionario/' + id, $scope.query).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    response.data.dt_admissao = new Date(response.data.dt_admissao);
                    $scope.funcionario = response.data;
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        if($routeParams.id != undefined){
            $scope.getFuncionario($routeParams.id);
        }

        /**
         * Salva dados do funcionário no backend ou emite alerta em caso de erro.
         * @returns {*}
         */
        $scope.salvar = function () {

            //console.log($scope.funcionario, $scope.funcionarioForm);

            $scope.salvarDados('funcionario/salvar', $scope.funcionarioForm.$valid, $scope.funcionario);

        }

    });