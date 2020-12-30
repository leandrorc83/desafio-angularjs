<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;

//use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
//use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class Funcionario extends Model// implements AuthenticatableContract, AuthorizableContract
{
    //use Authenticatable, Authorizable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $timestamps = false;
    protected $table = 'funcionario';
    protected $fillable = [
        'nome',
        'telefone',
        'endereco',
        'dt_admissao'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function cursos()
    {
        return $this->belongsToMany('App\Models\Curso', 'curso_funcionario', 'funcionario_id', 'curso_id');
    }

    /**
     * @param $dados
     * @return false|string
     * @throws \Exception
     */
    public function salvar($dados){

        \DB::beginTransaction();

        $retorno = new \stdClass();
        try
        {
            //throw new \ErrorException('Campo obrigatório!');
            if($dados['id']) {
                $funcionario = Funcionario::find($dados['id']);

                //Se mudou nome, checa se existe outro funcionário com o nome informado.
                if($funcionario->nome != $dados['nome']){
                    $this->testaFuncionario($dados['nome']);
                }

                $funcionario->update($dados);
            }
            else{
                $this->testaFuncionario($dados['nome']);
                $funcionario = Funcionario::create($dados);
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
    public function testaFuncionario($nome)
    {

        $funcionario2 = Funcionario::where('nome', $nome)->first();
        if($funcionario2){
            throw new \ErrorException('Já existe outro funcionário com o nome informado!');
        }

    }

    /**
     * Processa exclusão do funcionário.
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
            $funcionario = Funcionario::find($id);

            if ($funcionario) {
                $funcionario->cursos()->detach();
                $funcionario->delete();
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
