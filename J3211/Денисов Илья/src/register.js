import { users as defaultUsers } from './data_parol.js';

const emailInputRegister = document.querySelector('#floatingInputRegister');
const passwordInputRegister = document.querySelector('#floatingPasswordRegister');
const passwordInputRepeatRegister = document.querySelector('#floatingPasswordRepeatRegister');
const nameInput = document.querySelector('#floatingName');
const surnameInput = document.querySelector('#floatingSurname');
const entBtnReg = document.querySelector('#enterRegister');
const toastElement = document.getElementById('errorToast');
const toastText = document.getElementById('errorToastText');
const errorToast = new bootstrap.Toast(toastElement);

function showToast(message) {
    toastText.textContent = message;
    errorToast.show();
}

function checkLoginInBase() {
    const queryEmail = emailInputRegister.value;
    const raw = localStorage.getItem('users');
    const localUsers = JSON.parse(raw) || [];
    const allUsers = [...defaultUsers, ...localUsers];

    if (
        emailInputRegister.value === '' ||
        passwordInputRegister.value === '' ||
        passwordInputRepeatRegister.value === '' ||
        nameInput.value === '' ||
        surnameInput.value === ''
    ) {
        showToast('Пустые значения');
        emailInputRegister.value = '';
        passwordInputRegister.value = '';
        passwordInputRepeatRegister.value = '';
        nameInput.value = '';
        surnameInput.value = '';
        return;
    }
    else if (CheckDataBase(allUsers, queryEmail)) {
        showToast('Уже есть такой пользователь');
        emailInputRegister.value = '';
        passwordInputRegister.value = '';
        passwordInputRepeatRegister.value = '';
        nameInput.value = '';
        surnameInput.value = '';
        return;
    }
    else if (passwordInputRegister.value != passwordInputRepeatRegister.value) {
        showToast('Пароли не совпадают');
        emailInputRegister.value = '';
        passwordInputRegister.value = '';
        passwordInputRepeatRegister.value = '';
        nameInput.value = '';
        surnameInput.value = '';
        return;
    }

    const newUser = {
        name: nameInput.value,
        surname: surnameInput.value,
        email: emailInputRegister.value,
        password: passwordInputRegister.value
    };

    localUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(localUsers));
    window.location.href = 'main.html';

    emailInputRegister.value = '';
    passwordInputRegister.value = '';
    passwordInputRepeatRegister.value = '';
    nameInput.value = '';
    surnameInput.value = '';
}

entBtnReg.addEventListener('click', checkLoginInBase);

function CheckDataBase(usersArray, email) {
    if (usersArray.find(user => user.email === email)) {
        return true;
    }
    return false;
}