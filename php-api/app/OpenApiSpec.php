<?php

declare(strict_types=1);

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'AuthFlow 2FA API',
    description: 'Documentacao da API AuthFlow 2FA'
)]
#[OA\Server(
    url: 'http://localhost:8080',
    description: 'Ambiente local'
)]
#[OA\PathItem(path: '/')]
final class OpenApiSpec
{
    #[OA\Get( 
        path: '/microsoft_authenticator/register_user',
        summary: 'Endpoint Microsoft Authenticator',
        tags: ['Microsoft Authenticator'],
        parameters: [
            new OA\Parameter(
                name: 'client_name',
                in: 'query',
                description: 'Nome do Cliente',
                required: true,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'email',
                in: 'query',
                description: 'Email do usuário para o qual a versão está sendo solicitada',
                required: true,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'senha',
                in: 'query',
                description: 'Senha do usuário para o qual a versão está sendo solicitada',
                required: true,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'fk_IdentityProvider',
                in: 'query',
                description: 'ID do provedor de identidade para o qual a versão está sendo cadastrada (opcional, se não for fornecido, será usado um valor padrão)',
                required: false,
                schema: new OA\Schema(type: 'string')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Versao retornada com sucesso'
            )
        ]
    )]
    public function microsoftAuthenticatorRegisterUser(): void
    {
    }

    #[OA\Get(
        path: '/microsoft_authenticator/request_key',
        summary: 'Endpoint Microsoft Authenticator',
        tags: ['Microsoft Authenticator'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Versao retornada com sucesso'
            )
        ]
    )]
    public function microsoftAuthenticatorRequestKey(): void
    {
    }

    #[OA\Get(
        path: '/microsoft_authenticator/verify_code',
        summary: 'Endpoint Microsoft Authenticator',
        tags: ['Microsoft Authenticator'],
        parameters: [
            new OA\Parameter(
                name: 'code',
                in: 'query',
                description: 'Código TOTP a ser verificado',
                required: true,
                schema: new OA\Schema(type: 'string')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Código verificado com sucesso'
            ),
            new OA\Response(
                response: 400,
                description: 'Código inválido ou usuário não registrado'
            )
        ]
    )]
    public function microsoftAuthenticatorVerifyCode(): void
    {
    }

    #[OA\Get(
        path: '/google_authenticator/register_user',
        summary: 'Endpoint Google Authenticator',
        tags: ['Google Authenticator'],
        parameters: [
            new OA\Parameter(
                name: 'client_name',
                in: 'query',
                description: 'Nome do Cliente',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'email',
                in: 'query',
                description: 'Email do usuário para o qual a versão está sendo solicitada',
                required: true,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'senha',
                in: 'query',
                description: 'Senha do usuário para o qual a versão está sendo solicitada',
                required: true,
                schema: new OA\Schema(type: 'string')
            ),
             new OA\Parameter(
                name: 'fk_IdentityProvider',
                in: 'query',
                description: 'ID do provedor de identidade para o qual a versão está sendo cadastrada (opcional, se não for fornecido, será usado um valor padrão)',
                required: false,
                schema: new OA\Schema(type: 'string')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Versao retornada com sucesso'
            )
        ]
    )]
    public function googleAuthenticatorRegisterUser(): void
    {
    }

    #[OA\Get(
        path: '/google_authenticator/request_key',
        summary: 'Endpoint Google Authenticator',
        tags: ['Google Authenticator'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Versao retornada com sucesso'
            )
        ]
    )]
    public function googleAuthenticatorRequestKey(): void
    {
    }

    #[OA\Get(
        path: '/google_authenticator/verify_code',
        summary: 'Endpoint Google Authenticator',
        tags: ['Google Authenticator'],
        parameters: [
            new OA\Parameter(
                name: 'code',
                in: 'query',
                description: 'Código TOTP a ser verificado',
                required: true,
                schema: new OA\Schema(type: 'string')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Código verificado com sucesso'
            ),
            new OA\Response(
                response: 400,
                description: 'Código inválido ou usuário não registrado'
            )
        ]
    )]
    public function googleAuthenticatorVerifyCode(): void
    {
    }
}
