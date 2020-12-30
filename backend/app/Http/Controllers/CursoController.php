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

        $curso = new Curso();
        return $curso->salvar($request->all());

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

        return Curso::find($id)->alunos()->orderBy('nome')->get();

    }

    /**
     * Relacionar aluno a um curso.
     * @param Request $request
     */
    public function relacionarAluno(Request $request)
    {

        $curso = new Curso();
        return $curso->relacionarAluno($request->all());

    }

    /**
     * Relacionar aluno a um curso.
     * @param Request $request
     */
    public function removerAluno(Request $request)
    {

        $curso = new Curso();
        return $curso->removerAluno($request->all());

    }

    /**
     * Retorna lista de cursos e seus alunos.
     * @return Curso[]|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getCursosComAlunos(){

        return Curso::with('alunos')->get();

    }

    /**
     * Exclui um curso
     * @param $request
     */
    public function excluir(Request $request)
    {

        $curso = new Curso();
        return $curso->excluir($request->id);

    }

}
