<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
use App\Models\CursoFuncionario;
use Illuminate\Http\Request;
use DB;

class FuncionarioController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Lista os funcionários
     */
    public function listar()
    {
        return Funcionario::all();
    }

    /**
     * Retorna um funcionário e seus dependentes
     */
    public function get($id)
    {
        return Funcionario::find($id);
    }

    /**
     * Cadastra um funcionário e seus dependentes
     */
    public function salvar(Request $request)
    {

        $funcionario = new Funcionario();
        return $funcionario->salvar($request->all());

    }

    /**
     * Exclui um funcionário
     * @param $request
     */
    public function excluir(Request $request)
    {

        $funcionario = new Funcionario();
        return $funcionario->excluir($request->id);

    }

    /**
     * Pesquisa funcionários
     * @param Request $request
     * @return mixed
     */
    public function pesquisar(Request $request)
    {

        return Funcionario::where('nome', 'like', "%{$request->nome}%")->orderBy('nome')->get();

        /*
        $query = Db::table('funcionario as f')
            ->leftJoin('curso_funcionario as cf', 'f.id', '=', 'cf.funcionario_id')
            ->where('cf.curso_id', "%{$request->curso_id}%")
            ->whereNull('cf.funcionario_id')
            ->where('f.nome', 'like', "%{$request->nome}%");

        return $query->toSql();*/

    }

}
