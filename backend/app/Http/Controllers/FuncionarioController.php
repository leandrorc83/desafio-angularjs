<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
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

        \DB::beginTransaction();

        $retorno = new \stdClass();
        try
        {
            //throw new \ErrorException('Campo obrigatório!');
            if($request->id) {
                $funcionario = Funcionario::find($request->id);

                //Se mudou nome, checa se existe outro com mesmo nome.
                if($funcionario->nome != $request->nome){
                    $this->testaFuncionario($request->nome);
                }

                $funcionario->update($request->all());
            }
            else{
                $this->testaFuncionario($request->nome);
                $funcionario = Funcionario::create($request->all());
            }

            $funcionario->save();
            \DB::commit();
        }
        catch(\ErrorException $e)
        {
            \DB::rollback();
            $retorno->erro = $e->getMessage();
        }
        catch(\Exception $e)
        {
            \DB::rollback();
            throw $e;
        }

        return json_encode($retorno);

    }

    /**
     * Verifica se já existe funcionário com $nome e, em caso afirmativo, dispara exceção.
     * @param $nome
     * @throws \ErrorException
     */
    public function testaFuncionario($nome){

        $funcionario2 = Funcionario::where('nome', $nome)->first();
        if($funcionario2){
            throw new \ErrorException('Já existe outro funcionário com o nome informado!');
        }

    }

    /**
     * Deleta um funcionário
     * @param $id
     */
    public function delete($id)
    {
        //return response()->json($id);
        $funcionario = Funcionario::find($id);

        if($funcionario){
            $funcionario->delete();
        }
    }

    /**
     * Pesquisa funcionários
     * @param Request $request
     * @return mixed
     */
    public function pesquisar(Request $request){

        return Funcionario::where('nome', 'like', "%{$request->nome}%")->get();

        /*
        $query = Db::table('funcionario as f')
            ->leftJoin('curso_funcionario as cf', 'f.id', '=', 'cf.funcionario_id')
            ->where('cf.curso_id', "%{$request->curso_id}%")
            ->whereNull('cf.funcionario_id')
            ->where('f.nome', 'like', "%{$request->nome}%");

        return $query->toSql();*/

    }

}
