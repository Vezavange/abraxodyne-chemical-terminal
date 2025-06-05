function getCookie(name) {
    let matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
        )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Назначаем обработчик на "[1] Список файлов"
document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
    if (p.textContent.includes('[1] Список файлов')) {
        p.parentElement.addEventListener('click', onListClick);
    }
});

function onListClick(e) {
    e.preventDefault();

    // Удаляем все временные меню
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());

    // Контейнер для вставки
    const content = document.querySelector('.content');

    // Работаем с cookie
    let cookieValue = 'Радскорпионовый стимулятор;_&Коктейль Ментатов;_&Гекконья слеза;_&Мед-Х для гурманов;_&Рад-Шипучка;_&Ядерный адреналин;_&Купрюмовый взвар;_&Пороховая настойка;_&Стимпак люкс;_&Реакторный энергетик'
    // getCookie('abraxo-list');
    if (typeof cookieValue === 'string' && cookieValue.length > 0) {
        let arr = cookieValue.split(';_&');
        content.insertAdjacentHTML('beforeend', '<br class="temporaly-menu">');
        arr.forEach((str, idx) => {
            content.insertAdjacentHTML(
                'beforeend',
                `<a class="temporaly-menu"><p>[${idx + 1}] Рецепт: ${str}</p></a>`
            );
        });
        content.insertAdjacentHTML(
            'beforeend',
            `<a class="temporaly-menu" id="back-to-main"><p>[${arr.length + 1}] Назад</p></a>`
        );
    } else {
        content.insertAdjacentHTML(
            'beforeend',
            `<p class="temporaly-menu" id="back-to-main">Данные отсутствуют</p><br class="temporaly-menu"><a class="temporaly-menu"><p>[1] Назад</p></a>`
        );
    }
    
}

// Функция для восстановления главного меню
function restoreMainMenu() {
    // Удаляем все временные элементы
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());

    // Контейнер, куда вставлять меню
    const content = document.querySelector('.content');

    // Вставка главного меню
    content.insertAdjacentHTML('beforeend', `
        <p class="temporaly-menu">
            Добро пожаловать в Электронную систему сообщений системного администратора (ЭСССА).<br />
            Вы получили доступ к защищённому терминалу хранения химических рецептов. <br />
            Пожалуйста, выберите необходимую команду для просмотра, добавления или редактирования рецептов. <br />
            Система работает в автоматическом режиме — соблюдайте протоколы безопасности.<br />
        </p>
        <br class="temporaly-menu" />
        <a class="temporaly-menu"><p>[1] Список файлов</p></a>
        <a class="temporaly-menu"><p>[2] Новый файл</p></a>
        <a class="temporaly-menu"><p>[3] Резервная копия</p></a>
    `);

    // Назначаем обработчик для возврата к списку файлов, если нужно  
    // (повторно назначить eventListener, если это требуется после восстановления меню)
    document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
        if (p.textContent.includes('[1] Список файлов')) {
            p.parentElement.addEventListener('click', onListClick);
        }
    });
}

document.addEventListener('click', function(e) {
    // Проверяем, был ли клик по элементу или внутри элемента с id="back-to-main"
    const btn = e.target.closest('#back-to-main');
    if (btn) {
        e.preventDefault();
        restoreMainMenu();
    }
});