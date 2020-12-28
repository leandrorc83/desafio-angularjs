<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/api/funcionario/listar/', 'FuncionarioController@listar');
$router->post('/api/funcionario/pesquisar', 'FuncionarioController@pesquisar');
$router->get('/api/funcionario/{id}', 'FuncionarioController@get');
$router->post('/api/funcionario/salvar', 'FuncionarioController@salvar');
$router->delete('/api/funcionario/delete/{id}', 'FuncionarioController@delete');

$router->get('/api/curso/listar/', 'CursoController@listar');
$router->get('/api/curso/get-cursos-com-alunos', 'CursoController@getCursosComAlunos');
$router->get('/api/curso/{id}', 'CursoController@get');
$router->post('/api/curso/salvar', 'CursoController@salvar');
$router->delete('/api/curso/delete/{id}', 'CursoController@delete');
$router->post('/api/curso/get-alunos/{id}', 'CursoController@getAlunos');
$router->post('/api/curso/relacionar-aluno', 'CursoController@relacionarAluno');
