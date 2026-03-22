<?php
    use App\Http\Controllers\MicrosoftAuthenticatorController;
    use App\Http\Controllers\GoogleAuthenticatorController;
    use App\Http\Controllers\UserController;

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

        try {
                // Em desenvolvimento, gera a spec em tempo real para evitar arquivo desatualizado no container.
                if (env('APP_ENV') !== 'production') {
                        $openapi = \OpenApi\Generator::scan([base_path('app')]);
                        $json = $openapi->toJson();
                        @file_put_contents($specPath, $json);

                        return response($json, 200, [
                                'Content-Type' => 'application/json',
                                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                                'Pragma' => 'no-cache',
                                'Expires' => '0',
                        ]);
                }

                if (!file_exists($specPath)) {
                        return response()->json([
                                'message' => 'Arquivo OpenAPI nao encontrado. Gere com: vendor/bin/openapi app -o public/openapi.json',
                        ], 404);
                }

                return response(file_get_contents($specPath), 200, [
                        'Content-Type' => 'application/json',
                        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                        'Pragma' => 'no-cache',
                        'Expires' => '0',
                ]);
        } catch (\Throwable $e) {
                return response()->json([
                        'message' => 'Erro ao gerar OpenAPI',
                        'error' => $e->getMessage(),
                ], 500);
        }
});

$router->get('/swagger', function () {
        $swaggerUrl = url('/openapi.json?v='.time());

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
        , 200, [
                'Content-Type' => 'text/html; charset=UTF-8',
                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma' => 'no-cache',
                'Expires' => '0',
        ]);
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

$router->post('/users/register', 'UserController@registerUser');
$router->get('/authenticator/verify_code', 'AuthenticatorController@verifyCode');
$router->get('/authenticator/request_key', 'AuthenticatorController@requestKey');