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
    document.querySelector("#fname").value = "";
    document.querySelector("#fnum").value = "";
    document.querySelector("#femail").value = "";
};

const sendForm = () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('https://fake-server.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Form submitted successfully!');
                clearFields();
            } else {
                alert('Error submitting form. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
}

sendForm();
