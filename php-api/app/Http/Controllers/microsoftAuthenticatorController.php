<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class microsoftAuthenticatorController extends Controller
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

    public function registerUser(Request $request)
    {
        echo "Nome do cliente: " . $request->query('client_name') . "\n";
        echo "Email: " . $request->query('email') . "\n";
    }

    public function requestKey(Request $request)
    {
        echo "ID do usuário: " . $request->query('user_id') . "\n";
    }
}
