const API_BASE = 'https://teulogin-api.up.railway.app'; // troca aqui pro seu link

const authForms = document.getElementById('auth-forms');
const profileDiv = document.getElementById('profile');

const regUsername = document.getElementById('reg-username');
const regEmail = document.getElementById('reg-email');
const regPassword = document.getElementById('reg-password');
const regMessage = document.getElementById('reg-message');
const btnRegister = document.getElementById('btn-register');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');
const btnLogin = document.getElementById('btn-login');

const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const btnLogout = document.getElementById('btn-logout');
const profileMessage = document.getElementById('profile-message');

function showMessage(element, msg, isError = true) {
  element.textContent = msg;
  element.className = isError ? 'error' : 'success';
  setTimeout(() => {
    element.textContent = '';
  }, 4000);
}

btnRegister.onclick = async () => {
  if (!regUsername.value || !regEmail.value || !regPassword.value) {
    showMessage(regMessage, 'Preencha todos os campos!');
    return;
  }
  btnRegister.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: regUsername.value.trim(),
        email: regEmail.value.trim(),
        password: regPassword.value,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(regMessage, data.message, false);
      regUsername.value = '';
      regEmail.value = '';
      regPassword.value = '';
    } else {
      showMessage(regMessage, data.error);
    }
  } catch {
    showMessage(regMessage, 'Erro de conexão');
  }
  btnRegister.disabled = false;
};

btnLogin.onclick = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    showMessage(loginMessage, 'Preencha todos os campos!');
    return;
  }
  btnLogin.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value,
      }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      showProfile();
    } else {
      showMessage(loginMessage, data.error || 'Erro no login');
    }
  } catch {
    showMessage(loginMessage, 'Erro de conexão');
  }
  btnLogin.disabled = false;
};

async function showProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    authForms.classList.remove('hidden');
    profileDiv.classList.add('hidden');
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    if (res.ok) {
      profileUsername.textContent = data.username;
      profileEmail.textContent = data.email;
      authForms.classList.add('hidden');
      profileDiv.classList.remove('hidden');
    } else {
      logout();
    }
  } catch {
    logout();
  }
}

function logout() {
  localStorage.removeItem('token');
  authForms.classList.remove('hidden');
  profileDiv.classList.add('hidden');
}

btnLogout.onclick = logout;

showProfile();
