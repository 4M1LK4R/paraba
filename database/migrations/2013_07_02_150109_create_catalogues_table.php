<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCataloguesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogues', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->enum('state', ['ACTIVO', 'INACTIVO','ELIMINADO'])->default('ACTIVO');
            $table->unsignedBigInteger('type_catalogue_id')->unsigned();// FOREING KEY
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            //RELACTIONS
            $table->foreign('type_catalogue_id')->references('id')->on('type_catalogues')
            ->onDelete('cascade')
            ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogues');
    }
}
