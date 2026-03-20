<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use OTPHP\TOTP;

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

        setcookie("email", $request->query('email'), time() + 3600, "/");

        return response()->json([
            'message' => 'Usuário registrado com sucesso',
        ], 200);
    }

    public function requestKey(Request $request)
    {
        $email = $_COOKIE['email'] ?? null;

        if (!$email) {
            return response()->json([
                'message' => 'Usuário não registrado',
            ], 400);
        }

        $totp = TOTP::create();
        $totp->setLabel($email);
        $totp->setIssuer('DCRM');

        $secret = $totp->getSecret();
        $uri = $totp->getProvisioningUri();

        setcookie("totp_secret", $secret, time() + 3600, "/");
        setcookie("totp_uri", $uri, time() + 3600, "/");
        setcookie("email", "", time() - 3600, "/");


        return response()->json([
            'secret' => $secret,
            'provisioning_uri' => $uri
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

        $totp = TOTP::create($secret);

        if ($totp->verify($request->query('code'))) {
            return response()->json([
                'message' => 'Código verificado com sucesso',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Código inválido',
            ], 400);
        }
    }
}
