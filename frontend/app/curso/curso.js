'use strict';

angular.module('myApp.curso', [])

    .config(function ($stateProvider) {

        $stateProvider
            .state ('curso',{
                url: "/curso",
                views: {
                    '' :{
                        templateUrl: "/curso/lista.html",
                        controller: 'cursoListaCtrl'
                    }
                }
            })

            .state ('curso-cadastrar',{
                url: "/curso/cadastrar",
                templateUrl: "/curso/dados.html",
                controller: 'cursoFormCtrl'
            })

            .state ('curso-editar',{
                url: "/curso/editar/:id",
                templateUrl: "/curso/dados.html",
                controller: 'cursoFormCtrl'
            });

    })

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

        $scope.cursosPdf = [];

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

        };

        $scope.listar();

        /**
         * Abre modal com a relação de alunos do curso selecionado.
         * @param ev
         * @param curso
         */
        $scope.abrirRelacaoAlunos = function (ev, curso) {

            $scope.cursoSelecionado = curso;

            $scope.carregandoAlunos = true;

            $scope.alunosCursoSelecionado = [];

            $scope.cursoIdRelacionar = null;

            $mdDialog.show({
                contentElement: '#alunosCurso',
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application to prevent interaction outside of dialog
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                ok: "Fechar",
                multiple: true,
                onRemoving: function (event, removePromise) {
                    limparAutocompleteFuncionario();
                }
            });

            getAlunos();

        }

        /**
         * Fecha modal com a relação de alunos do curso selecionado.
         */
        $scope.fecharRelacaoAlunos = function () {

            $mdDialog.cancel();

        }

        // list of `state` value/display objects
        $scope.cursosPorNome = [];
        $scope.pesquisarFuncionario = pesquisarFuncionario;
        $scope.selectedItemChange = selectedItemChange;
        $scope.cursoIdRelacionar = null;

        $scope.searchText = '';
        $scope.selectedItem = '';

        /**
         * Recupera lista de alunos do curso selecionado.
         */
        function getAlunos(){

            $scope.carregandoAlunos = true;

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

        /**
         * Limpa o autocomplete de relacionar funcionário a um curso.
         */
        function limparAutocompleteFuncionario(){
            $scope.searchText = '';
            $scope.selectedItem = '';
        }

        /**
         * Pesquisa funcionário cujo nome contenha o informado no campo "Funcionário" da janela "Relação de alunos".
         * @param query
         * @returns {PromiseLike<[] | *[]>|Promise<[] | *[]>|*[]}
         */
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

                    $scope.cursosPorNome = [];

                    for(var curso of response.data){
                        $scope.cursosPorNome.push({
                            value: curso.id,
                            display: curso.nome
                        });
                    }

                    return $scope.cursosPorNome;
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        /**
         * Processa seleção no autocomplete.
         * @param item
         */
        function selectedItemChange(item) {

            if(item != undefined) {
                $scope.funcionarioIdRelacionar = item.value;
            }

        }

        /**
         * Relaciona funcionário a curso.
         */
        $scope.relacionarFuncionarioCurso = function(){

            $http.post($scope.apiHost + 'curso/relacionar-aluno', {curso_id: $scope.cursoSelecionado.id, funcionario_id: $scope.funcionarioIdRelacionar}).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    else{
                        $scope.alertDialog('sucesso', 'Sucesso', 'Funcionário inscrito com sucesso!');
                        limparAutocompleteFuncionario();
                        getAlunos();
                    }

                },
                function (response) {
                    $scope.carregandoAlunos = false;
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        /**
         * Recupera lista de cursos e seus alunos.
         */
        $scope.getCursosComAlunos = function() {

            $scope.cursosPdf = [];
            $http.get($scope.apiHost + 'curso/get-cursos-com-alunos').then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    } else {
                        $scope.cursosPdf = response.data;
                        if($scope.cursosPdf.length > 0) {
                            $scope.gerarPdf();
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

        /**
         * Gera pdf com base na lista de cursos e seus alunos.
         */
        $scope.gerarPdf = function(){

            var docDefinition = {
                content: [
                    {text: 'Lista de cursos e alunos', alignment: 'center', bold: true, fontSize: 15}
                ]
            };

            for(var curso of $scope.cursosPdf){

                docDefinition.content.push(
                    {
                        text: '\n\nCurso: ' + curso.titulo + '\n\n',
                        bold: true
                    }
                );

                if(curso.alunos.length == 0){
                    docDefinition.content.push(
                        {
                            text: 'Nenhum aluno inscrito.'
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

        /**
         * Confirma exclusão do funcionário.
         * @param ev
         */
        $scope.confirmarExcluir = function(ev, id) {

            var confirm = $mdDialog.confirm()
                .title('Confirma exclusão?')
                .textContent('O curso pode ter funcionários inscritos!')
                .ariaLabel('Confirma exclusão?')
                .targetEvent(ev)
                .ok('Continuar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                $scope.excluir(id);
            },function(){});

        }

        /**
         * Processa exclusão do funcionário.
         * @param id
         */
        $scope.excluir = function (id) {

            $http.delete($scope.apiHost + 'curso/' + id).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    else {
                        $scope.alertDialog('sucesso', 'Sucesso', 'Curso excluído!');
                        $scope.listar();
                    }
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

        /**
         * Confirma exclusão do funcionário.
         * @param ev
         */
        $scope.confirmarRemover = function(ev, id) {

            var confirm = $mdDialog.confirm()
                .title('Confirma remoção?')
                .textContent('O aluno será removido do curso!')
                .ariaLabel('Confirma remoção?')
                .targetEvent(ev)
                .ok('Continuar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function () {
                $scope.remover(id);
            },function(){});

        }

        /**
         * Processa exclusão do funcionário.
         * @param id
         */
        $scope.remover = function (id) {

            $http.delete($scope.apiHost + 'curso/remover-aluno', {curso_id: $scope.cursoSelecionado.id, funcionario_id: id}).then(
                function (response) {
                    if (response.data.erro != undefined) {
                        $scope.alertDialog('erro', 'Erro', response.data.erro);
                    }
                    else {
                        $scope.alertDialog('sucesso', 'Sucesso', 'Aluno removido!');
                        getAlunos();
                    }
                },
                function (response) {
                    $scope.alertDialog('erro', 'Erro', 'Erro no servidor!');
                }
            );

        }

    })

    .controller('cursoFormCtrl', function ($scope, $http, $state, $stateParams) {

        $scope.acao = $stateParams.id != undefined ? 'Editar' : 'Cadastrar';

        /**
         * Inicializa model de curso.
         * @returns {{carga_horaria: string, valor: string, titulo: string, id: string, descricao: string}}
         */
        $scope.initCurso = function(){
            return {id: '', titulo: '', descricao: '', carga_horaria: '', valor: ''};
        }

        $scope.curso = $scope.initCurso();

        /**
         * Recupera um curso.
         * @param id
         */
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

        if($stateParams.id != undefined){

            $scope.getCurso($stateParams.id);

        }

        /**
         * Salva dados do funcionário no backend ou emite alerta em caso de erro.
         * @returns {*}
         */
        $scope.salvar = function () {

            //console.log($scope.curso, $scope.cursoForm);

            $scope.salvarDados('curso/salvar', $scope.cursoForm.$valid, $scope.curso,
                function(){
                    if($scope.acao == 'Cadastrar') {
                        $state.reload();
                    }
                }
            );

        }

    });