<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IdentityProviderModel;

class GetProviderAuthenticate extends Controller
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

    public function getProviderAuthenticate()
    {
        $providers = IdentityProviderModel::all();
        return response()->json($providers);
    }
}
