<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\usuariosModel;
use OTPHP\TOTP;

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

    private function generateGoogleAuthenticatorKey($email): array
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
            throw new \Exception('Erro ao gerar chave do Google Authenticator: ' . $e->getMessage());
        }
    }

    public function requestKey(Request $request) : JsonResponse
    {
        $userId = $request->input('user_id');

        $user = usuariosModel::select('usuarios.id', 
                                      'usuarios.nome', 
                                      'usuarios.email', 
                                      'IdentityProvider.provider_name', 
                                      'IdentityProvider.id as ip_provider')
                ->join('IdentityProvider', 'IdentityProvider.id', '=', 'usuarios.fk_IdentityProvider')
                ->where('usuarios.id', $userId)
                ->first();

        if(!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado',
            ], 404);
        }

        if($user->provider_name == 'Microsoft Authenticator') {
            try {
                $keyData = $this->generateMicrosoftAuthenticatorKey($user->email);
                
                return response()->json([
                    'message' => 'Chave gerada com sucesso',
                    'secret' => $keyData['secret'],
                    'uri' => $keyData['uri'],
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Erro ao gerar chave do Microsoft Authenticator',
                    'error' => $e->getMessage(),
                ], 500);
            }

        }else if($user->provider_name == 'Google Authenticator') {
            try {
                $keyData = $this->generateGoogleAuthenticatorKey($user->email);

                return response()->json([
                    'message' => 'Chave gerada com sucesso',
                    'secret' => $keyData['secret'],
                    'uri' => $keyData['uri'],
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Erro ao gerar chave do Google Authenticator',
                    'error' => $e->getMessage(),
                ], 500);
            }

        }else {
            return response()->json([
                'message' => 'Provedor de autenticação não suportado',
            ], 400);
        }
    }

    public function verifyCode(Request $request)
    {}
}