<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/openapi.json', function () {
        $specPath = __DIR__.'/../public/openapi.json';

        if (!file_exists($specPath)) {
                return response()->json([
                        'message' => 'Arquivo OpenAPI nao encontrado. Gere com: vendor/bin/openapi app -o public/openapi.json',
                ], 404);
        }

        return response(file_get_contents($specPath), 200, [
                'Content-Type' => 'application/json',
        ]);
});

$router->get('/swagger', function () {
        $swaggerUrl = url('/openapi.json');

        return response(<<<HTML
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        window.ui = SwaggerUIBundle({
            url: "{$swaggerUrl}",
            dom_id: '#swagger-ui'
        });
    </script>
</body>
</html>
HTML
        , 200, ['Content-Type' => 'text/html; charset=UTF-8']);
});
