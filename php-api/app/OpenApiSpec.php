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
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'email',
                in: 'query',
                description: 'Email do usuário para o qual a versão está sendo solicitada',
                required: true,
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
        parameters: [
            new OA\Parameter(
                name: 'user_id',
                in: 'query',
                description: 'ID do usuário para o qual a versão está sendo solicitada',
                required: true,
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
    public function microsoftAuthenticatorRequestKey(): void
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
        parameters: [
            new OA\Parameter(
                name: 'user_id',
                in: 'query',
                description: 'ID do usuário para o qual a versão está sendo solicitada',
                required: true,
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
    public function googleAuthenticatorRequestKey(): void
    {
    }
}
