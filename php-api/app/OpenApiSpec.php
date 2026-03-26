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
    #[OA\Post(
        path: '/users/register',
        summary: 'Endpoint para cadastrar usuários',
        tags: ['Cadastrar Usuários'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(
                        property: 'client_name',
                        type: 'string',
                        description: 'Nome do Cliente'
                    ),
                    new OA\Property(
                        property: 'email',
                        type: 'string',
                        description: 'Email do usuário para o qual o cadastro está sendo realizado'
                    ),
                    new OA\Property(
                        property: 'senha',
                        type: 'string',
                        description: 'Senha do usuário para o qual o cadastro está sendo realizado'
                    ),
                    new OA\Property(
                        property: 'fk_IdentityProvider',
                        type: 'string',
                        description: 'ID do provedor de identidade para o qual o cadastro está sendo realizado (opcional, se não for fornecido, será usado um valor padrão)'
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Cadastro realizado com sucesso'
            )
        ]
    )]
    public function registerUser(): void
    {
    }

    #[OA\Get(
        path: '/authenticator/request_key',
        summary: 'Endpoint para solicitar a chave do autenticador',
        tags: ['Authenticator'],
        parameters: [
            new OA\Parameter(
                name: 'user_id',
                in: 'query',
                description: 'ID do usuário para o qual a chave do autenticador está sendo solicitada',
                required: true,
                schema: new OA\Schema(type: 'string')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Chave do autenticador retornada com sucesso'
            )
        ]
    )]
    public function authenticatorRequestKey(): void
    {
    }

    #[OA\Get(
        path: '/identity_provider',
        summary: 'Endpoint para obter os provedores de identidade disponíveis',
        tags: ['Identity Provider'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Provedores de identidade retornados com sucesso'
            ),
            new OA\Response(
                response: 400,
                description: 'Erro ao obter os provedores de identidade'
            )
        ]
    )]
    public function getIdentityProviders(): void
    {
    }

    #[OA\Get(
        path: '/authenticator/verify_code',
        summary: 'Endpoint para verificar o código do autenticador',
        tags: ['Authenticator'],
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
    public function authenticatorVerifyCode(): void
    {
    }

    
}
