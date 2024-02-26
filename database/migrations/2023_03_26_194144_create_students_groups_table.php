<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students_groups', function (Blueprint $table) {
            $table->id();
            $table->integer('year');
            $table->string('deparment')->nullable();
            $table->integer('category')->nullable();
            $table->integer('size');


          
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students_groups');
    }
};
