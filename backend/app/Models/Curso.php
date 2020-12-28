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

    public function alunos()
    {
        return $this->belongsToMany('App\Models\Funcionario', 'curso_funcionario', 'curso_id', 'funcionario_id');
    }

}
