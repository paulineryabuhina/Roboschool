//открытие и закрытие бургера

document.addEventListener('DOMContentLoaded', function () {
    const burgerButton = document.querySelector('.burger__box');
    const menuList = document.querySelector('.burger__menu-list');
    const closeMenu = document.querySelector('.burger__close');
    const links = document.querySelectorAll('.burger__link');

    burgerButton.addEventListener('click', function (event) {
        event.preventDefault();
        menuList.style.transform = 'translateX(0)';
    });

    closeMenu.addEventListener('click', function (event) {
        event.preventDefault();
        menuList.style.transform = 'translateX(-100%)';
    });

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const target = event.target.getAttribute('href'); // Получаем атрибут href ссылки, на которую нажали
            window.location.href = target;
            menuList.style.transform = 'translateX(-100%)';
        });
    });
});

//модальное окно
const modal = document.querySelector('.modal');

const closeButton = document.querySelector('.modal__close-button');

const detail = document.querySelector('#marina');

detail.addEventListener('click', function (event) {
    event.preventDefault();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
    document.body.style.overflow = '';
});

//плавный скролл
const smoothLinks = document.querySelectorAll('a[href^="#"]');
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (event) {
        event.preventDefault();
        const id = smoothLink.getAttribute('href');

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
}

const clearFields = () => {
    document.querySelector("#name").value = "";
    document.querySelector("#num").value = "";
    document.querySelector("#email").value = "";
};

async function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const formButton = document.querySelector('.form__send-button');
    const formSendResult = document.querySelector('.form__send-result');
    clearFields();

    const formData = new FormData(form);
    const formDataObject = {};

    formData.forEach((value, key) => {
        formDataObject[key] = value.trim().replace(/\s+/g, ' ');
    })

    const validationErrors = validateForm(formDataObject);

    displayErrors(validationErrors);
    if (validationErrors.length > 0) return;

    sendFormData(form, formButton, formSendResult, formDataObject);
}

function displayErrors(errors) {
    const errorElements = document.querySelectorAll('.form__error');
    errorElements.forEach((errorElement) => {
        errorElement.textContent = '';
    });

    if(errors.length < 1) return;

    errors.forEach((error) => {
        const { field, message } = error;
        const errorElement = document.querySelector(`[data-for="${field}"]`);
        errorElement.textContent = message;
    });
}

//валидация формы
function validateForm(formData) {
    const { name, email, num} = formData;

    const phoneRegex = /^\+[0-9]{5,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = [];

    if (!name) {
        errors.push({ field: 'name', message: 'Пожалуйста, введите ваше имя.' });
    } 

    if (!num) {
        errors.push({ field: 'num', message: 'Пожалуйста, введите номер телефона.' });
    } else if (!phoneRegex.test(num)) {
        errors.push({ field: 'num', message: 'Пожалуйста, введите корректный номер телефона.' });
    }

    if (!email) {
        errors.push({ field: 'email', message: 'Пожалуйста, введите адрес электронной почты.' });
    } else if (!emailRegex.test(email) || (email.length < 5 || email.length > 100)) {
        errors.push({ field: 'email', message: 'Пожалуйста, введите корректный адрес электронной почты.' });
    }
    return errors;
}

async function sendFormData(form, formBtn, formSendResult, formDataObject) {
    try {
        formBtn.textContent = 'Loading...';
        formBtn.disabled = true;

        const response = await fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            formSendResult.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
            form.reset();
        } else if (response.status === 422) {
            const errors = await response.json();
            console.log(errors);
            throw new Error('Ошибка валидации данных');
        } else {
            throw new Error(response.statusText);
        }

    } catch (error) {
        console.error(error.message);
        formSendResult.textContent = 'Письмо не отправлено! Попробуйте позже.';
        formSendResult.style.color = 'red';

    } finally {
        formBtn.textContent = 'Отправить';
        formBtn.disabled = false;
    }
}