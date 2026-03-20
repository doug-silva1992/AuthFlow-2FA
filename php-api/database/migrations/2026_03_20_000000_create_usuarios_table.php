<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('senha');
    
            $table->unsignedBigInteger('fk_IdentityProvider')->nullable();
            $table->foreign('fk_IdentityProvider')
                ->references('id')
                ->on('IdentityProvider')
                ->onDelete('set null'); 
    
            $table->string('secret_2fa')->nullable();
            $table->boolean('is_2fa_enabled')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
