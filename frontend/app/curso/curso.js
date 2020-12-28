'use strict';

angular.module('myApp.curso', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/curso', {

            templateUrl: 'curso/lista.html',
            controller: 'cursoListaCtrl'

        }).when('/curso/dados/:id?', {

            templateUrl: 'curso/dados.html',
            controller: 'cursoFormCtrl'

        });
    }])

    .controller('cursoListaCtrl', function ($scope, $http, $mdDialog) {

        $scope.cursos = [];

        $scope.selected = [];

        $scope.query = {
            order: 'titulo',
            limit: 5,
            page: 1
        };

        $scope.cursoSelecionado = {};

        $scope.alunosCursoSelecionado = [];

        $scope.carregandoAlunos = true;

        //$scope.promise = null;

        /**
         * Salva dados do funcionário no backend ou emite alerta em caso de erro.
         * @returns {*}
         */
        $scope.listar = function () {

            $http.get($scope.apiHost + 'curso/listar', $scope.query).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    $scope.cursos = response.data;
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }();

        /**
         * Abre modal com a relação de alunos do curso selecionado.
         * @param ev
         * @param curso
         */
        $scope.abrirRelacaoAlunos = function (ev, curso) {

            $scope.cursoSelecionado = curso;

            $scope.carregandoAlunos = true;

            $scope.alunosCursoSelecionado = [];

            self.funcionarioIdRelacionar = null;

            $mdDialog.show({
                contentElement: '#myDialog',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });

            getAlunos();

        }

        var self = this;

        // list of `state` value/display objects
        self.funcionariosPorNome = [];
        self.pesquisarFuncionario = pesquisarFuncionario;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.funcionarioIdRelacionar = null;

        function getAlunos(){

            $http.post($scope.apiHost + 'curso/get-alunos/' + $scope.cursoSelecionado.id, $scope.query).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    $scope.alunosCursoSelecionado = response.data;
                    $scope.carregandoAlunos = false;
                },
                function (response) {
                    $scope.carregandoAlunos = false;
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        function pesquisarFuncionario (query) {

            if(query.length == 0){
                return [];
            }

            return $http.post($scope.apiHost + 'funcionario/pesquisar/', {nome: query, curso_id: $scope.cursoSelecionado.id}).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                        return;
                    }

                    self.funcionariosPorNome = [];

                    for(var funcionario of response.data){
                        self.funcionariosPorNome.push({
                            value: funcionario.id,
                            display: funcionario.nome
                        });
                    }

                    return self.funcionariosPorNome;
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            self.funcionarioIdRelacionar = item.value;
            //$log.info('Item changed to ' + JSON.stringify(item));
        }

        self.relacionarFuncionarioCurso = function(){

            $http.post($scope.apiHost + 'curso/relacionar-aluno', {curso_id: $scope.cursoSelecionado.id, funcionario_id: self.funcionarioIdRelacionar}).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    else{
                        $scope.alertDialog('sucesso', 'Sucesso', 'Funcionário relacionado com sucesso!');
                    }

                },
                function (response) {
                    $scope.carregandoAlunos = false;
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        self.cursosPdf = [];
        self.getCursosComAlunos = function() {

            self.cursosPdf = [];
            $http.get($scope.apiHost + 'curso/get-cursos-com-alunos').then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    } else {
                        self.cursosPdf = response.data;
                        if(self.cursosPdf.length > 0) {
                            self.gerarPdf();
                        }
                        else{
                            $scope.alertDialog('erro', 'Erro', 'Não existem cursos cadastrados!');
                        }
                    }
                },
                function (response) {
                    $scope.carregandoAlunos = false;
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        self.gerarPdf = function(){

            var docDefinition = {
                content: [
                    {text: 'Lista de cursos e alunos', alignment: 'center', bold: true, fontSize: 15}
                ]
            };

            for(var curso of self.cursosPdf){

                docDefinition.content.push(
                    {
                        text: '\n\nCurso: ' + curso.titulo + '\n\n',
                        bold: true
                    }
                );

                if(curso.alunos.length == 0){
                    docDefinition.content.push(
                        {
                            text: 'Nenhum aluno relacionado.'
                        }
                    );
                }
                else {
                    var itensLista = [];
                    for (var aluno of curso.alunos) {
                        itensLista.push(aluno.nome);
                    }

                    docDefinition.content.push(
                        {
                            ul: itensLista
                        }
                    );
                }
            }

            pdfMake.createPdf(docDefinition).download();

        }

    })

    .controller('cursoFormCtrl', function ($scope, $http, $routeParams) {

        $scope.curso = {id: '', titulo: '', descricao: '', carga_horaria: '', valor: ''};

        $scope.acao = $routeParams.id != undefined ? 'Visualizar/Editar' : 'Cadastrar';

        $scope.getCurso = function(id){

            $http.get($scope.apiHost + 'curso/' + id, $scope.query).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    response.data.carga_horaria = parseInt(response.data.carga_horaria);
                    response.data.valor = parseFloat(response.data.valor);
                    $scope.curso = response.data;
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        if($routeParams.id != undefined){
            $scope.getCurso($routeParams.id);
        }

        /**
         * Salva dados do funcionário no backend ou emite alerta em caso de erro.
         * @returns {*}
         */
        $scope.salvar = function () {

            //console.log($scope.curso, $scope.cursoForm);

            $scope.salvarDados('curso/salvar', $scope.cursoForm.$valid, $scope.curso);

        }

    });