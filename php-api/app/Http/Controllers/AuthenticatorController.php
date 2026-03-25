<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\usuariosModel;

class AuthenticatorController extends Controller
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

    private function generateMicrosoftAuthenticatorKey($email): array
    {
        try {
            $totp = TOTP::create();
            $totp->setLabel($email);
            $totp->setIssuer('DCRM');

            $secret = $totp->getSecret();
            $uri = $totp->getProvisioningUri();

            return [
                'secret' => $secret,
                'uri' => $uri,
            ];
        } catch (\Throwable $e) {
            throw new \Exception('Erro ao gerar chave do Microsoft Authenticator: ' . $e->getMessage());
        }
    }

    public function requestKey(Request $request)
    {
        $user = new usuariosModel();
        $userId = $request->query('user_id');
        $clientName = $request->query('client_name');

        var_dump($userId, $clientName);

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
    {}
}