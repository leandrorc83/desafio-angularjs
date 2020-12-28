<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\CursoFuncionario;
use Illuminate\Http\Request;
use DB;

class CursoController extends Controller
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
        return Curso::all();
    }

    /**
     * Retorna um funcionário e seus dependentes
     */
    public function get($id)
    {
        return Curso::find($id);
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
                $curso = Curso::find($request->id);

                //Se mudou nome, checa se existe outro com mesmo nome.
                if($curso->titulo != $request->titulo){
                    $this->testaCurso($request->titulo);
                }

                $curso->update($request->all());
            }
            else{
                $this->testaCurso($request->titulo);
                $curso = Curso::create($request->all());
            }

            $curso->save();
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
    public function testaCurso($titulo){

        $curso2 = Curso::where('titulo', $titulo)->first();
        if($curso2){
            throw new \ErrorException('Já existe outro curso com o título informado!');
        }

    }

    /**
     * Deleta um curso.
     */
    public function delete($id)
    {
        //return response()->json($id);
        $curso = Curso::find($id);

        if($curso){
            $curso->delete();
        }
    }

    /**
    * Retorna os alunos de um curso
    * @param $id
    */
    public function getAlunos($id)
    {
        sleep(3);
        return Curso::find($id)->alunos()->get();
    }

    /**
     * Relacionar aluno a um curso.
     * @param Request $request
     */
    public function relacionarAluno(Request $request)
    {

        $retorno = new \stdClass();

        $cursoFuncionario = CursoFuncionario::firstOrNew($request->all());

        if(!$cursoFuncionario->id){
            $cursoFuncionario->save();
        }
        else{
            $retorno->erro = 'Funcionário já relacionado a este curso.';
        }

        return json_encode($retorno);

    }

    public function getCursosComAlunos(){

        return Curso::with('alunos')->get();

    }


}
