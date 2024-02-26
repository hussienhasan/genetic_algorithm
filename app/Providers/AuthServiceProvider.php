<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Routing\Route;
use Laravel\Passport\Passport;
use Mockery\Generator\StringManipulation\Pass\Pass;
use Nyholm\Psr7\Request;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {

        Passport::tokensCan([
            'user' => 'Access user API',
            'admin' => 'Access admin API',
            'doctor' => 'Access doctor API',



        ]);


    }
}
