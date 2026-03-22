<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\usuariosModel;
use OTPHP\TOTP;

class UserController extends Controller
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
        try {
            $validator = Validator::make($request->all(), [
                'client_name' => 'required|string',
                'email' => 'required|email|unique:usuarios,email',
                'senha' => 'required|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Dados de entrada inválidos',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = new usuariosModel();
            $user->nome = $request->input('client_name');
            $user->email = $request->input('email');
            $user->senha = password_hash($request->input('senha'), PASSWORD_BCRYPT);
            $user->fk_IdentityProvider = $request->input('fk_IdentityProvider');
            $user->save();

            return response()->json([
                'message' => 'Usuário registrado com sucesso',
                'user_id' => $user->id,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erro ao registrar usuário',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
