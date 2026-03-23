import { users } from './data_parol.js';

const emailInputEnter = document.querySelector('#floatingInput');
const passwordInputEnter = document.querySelector('#floatingPassword');
const entBtn = document.querySelector('#enter');


const toastElement = document.getElementById('errorToast');
const toastText = document.getElementById('errorToastText');
const errorToast = new bootstrap.Toast(toastElement);

function showToast(message) {
    toastText.textContent = message;
    errorToast.show();
}

function checkLoginEnter() {
    const queryEmail = emailInputEnter.value;
    const queryPassword = passwordInputEnter.value;
    if (emailInputEnter.value === '' || passwordInputEnter.value === '') {
        showToast('Пустые значения');
        emailInputEnter.value = '';
        passwordInputEnter.value = '';
        return;
    }
    else if (checkData(queryEmail, queryPassword)) {
        window.location.href = 'main.html';
    } else {
        showToast('Неверный логин или пароль');
        emailInputEnter.value = '';
        passwordInputEnter.value = '';
        return;
    }
}

entBtn.addEventListener('click', checkLoginEnter);

function checkData(email, password) {
    const raw = localStorage.getItem('users');
    const localUsers = JSON.parse(raw) || [];
    const allUsers = [...users, ...localUsers];

    const user = allUsers.find(user => user.email === email);

    if (user && user.password === password) {
        return true;
    }
    return false;
}