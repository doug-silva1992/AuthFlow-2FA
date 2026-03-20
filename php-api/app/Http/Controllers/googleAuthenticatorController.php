<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\usuariosModel;

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
        if (!$request->has('email') || !$request->has('client_name')) {
            return response()->json([
                'message' => 'Parâmetro "email" e "client_name" são obrigatórios',
            ], 400);
        }

        // Lógica para registrar o usuário e gerar a chave TOTP
        $user = usuariosModel::create([
            'email' => $request->input('email'),
            'nome' => $request->input('client_name'),
        ]);

        return response()->json([
            'message' => 'Usuário registrado com sucesso',
        ], 200);
    }

    public function requestKey(Request $request)
    {
        $user = $_COOKIE['email'] ?? null;
        $clientName = $_COOKIE['client_name'] ?? null;

        if (!$user || !$clientName) {
            return response()->json([
                'message' => 'Usuário não registrado',
            ], 400);
        }

        return response()->json([
            'message' => 'Chave gerada com sucesso',
        ], 200);
    }

    public function verifyCode(Request $request)
    {
        if (!$request->has('code')) {
            return response()->json([
                'message' => 'Parâmetro "code" é obrigatório',
            ], 400);
        }

        $secret = $_COOKIE['totp_secret'] ?? null;

        if (!$secret) {
            return response()->json([
                'message' => 'Nenhuma chave TOTP encontrada para o usuário',
            ], 400);
        }

        return response()->json([
            'message' => 'Código verificado com sucesso',
        ], 200);
    }
}
