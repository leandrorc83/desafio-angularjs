<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $timestamps = false;
    protected $table = 'curso';
    protected $fillable = [
        'titulo',
        'descricao',
        'carga_horaria',
        'valor',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function alunos()
    {
        return $this->belongsToMany('App\Models\Funcionario', 'curso_funcionario', 'curso_id', 'funcionario_id');
    }

    /**
     * @param $dados
     * @return false|string
     * @throws \Exception
     */
    public function salvar($dados)
    {

        \DB::beginTransaction();

        $retorno = new \stdClass();
        try
        {
            if($dados['id']) {
                $curso = Curso::find($dados['id']);

                //Se mudou título, checa se existe outro curso com o título informado.
                if($curso->titulo != $dados['titulo']){
                    $this->testaCurso($dados['titulo']);
                }

                $curso->update($dados);
            }
            else{
                $this->testaCurso($dados['titulo']);
                $curso = Curso::create($dados);
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
    public function testaCurso($titulo)
    {

        $curso2 = Curso::where('titulo', $titulo)->first();
        if($curso2){
            throw new \ErrorException('Já existe outro curso com o título informado!');
        }

    }

    /**
     * Relaciona aluno a um curso.
     * @param $dados
     * @return false|string
     */
    public function relacionarAluno($dados)
    {

        $retorno = new \stdClass();

        $cursoFuncionario = CursoFuncionario::firstOrNew($dados);

        if(!$cursoFuncionario->id){
            $cursoFuncionario->save();
        }
        else{
            $retorno->erro = 'Funcionário já inscrito nesse curso.';
        }

        return json_encode($retorno);

    }

    /**
     * Remove aluno de curso.
     * @param $dados
     * @return false|string
     */
    public function removerAluno($dados)
    {

        $retorno = new \stdClass();

        $cursoFuncionario = CursoFuncionario::firstOrNew($dados);

        $cursoFuncionario->delete();

        return json_encode($retorno);

    }

    /**
     * Processa exclusão do curso.
     * @param $id
     * @return false|string
     * @throws \Exception
     */
    public function excluir($id)
    {

        $retorno = new \stdClass();

        try {

            \DB::beginTransaction();

            //return response()->json($id);
            $curso = Curso::find($id);

            if ($curso) {
                $curso->alunos()->detach();
                $curso->delete();
            }

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

}
