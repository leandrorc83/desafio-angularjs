'use strict';

angular.module('myApp.funcionario', [])

    .config(function ($stateProvider) {

        $stateProvider

            .state ('funcionario',{
                url: "/funcionario",
                views: {
                    '' :{
                        templateUrl: "/funcionario/lista.html",
                        controller: 'funcionarioListaCtrl'
                    }
                }
            })

            .state ('funcionario-cadastrar',{
                url: "/funcionario/cadastrar",
                templateUrl: "/funcionario/dados.html",
                controller: 'funcionarioFormCtrl'
            })

            .state ('funcionario-editar',{
                url: "/funcionario/editar/:id",
                templateUrl: "/funcionario/dados.html",
                controller: 'funcionarioFormCtrl'
            });

    })

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

    .controller('funcionarioFormCtrl', function ($scope, $http, $stateParams) {

        $scope.funcionario = {id: '', nome: '', telefone: '', endereco: '', dt_admissao: ''};

        $scope.acao = $stateParams.id != undefined ? 'Visualizar/Editar' : 'Cadastrar';

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

        if($stateParams.id != undefined){
            $scope.getFuncionario($stateParams.id);
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