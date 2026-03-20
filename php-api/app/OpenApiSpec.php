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
        path: '/',
        summary: 'Versao da aplicacao',
        tags: ['Health'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Versao retornada com sucesso'
            )
        ]
    )]
    public function version(): void
    {
    }
}
