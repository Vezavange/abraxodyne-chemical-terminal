function getStoredData() {
    return JSON.parse(localStorage.getItem('abraxo-list')) || [];
}

function setStoredData(data) {
    localStorage.setItem('abraxo-list', JSON.stringify(data));
}

function restoreMainPageListener() {
    document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
        if (p.textContent.includes('[1] Список файлов')) {
            p.parentElement.addEventListener('click', onListClick);
        }
    });
    document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
        if (p.textContent.includes('[2] Новый файл')) {
            p.parentElement.addEventListener('click', onNewRecipeClick);
        }
    });
}

function onNewRecipeClick(e) {
    e.preventDefault();
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
    content.insertAdjacentHTML('beforeend', `
        <form class="temporaly-menu">
            <label id="id">Идентификатор >></label><input type="text" id="id-input" /><br />
            <label id="name">Название >></label><input type="text" id="name-input" /><br />
            <label id="text">Текст >></label><input type="text" id="text-input" /><br />
            <br class="temporaly-menu" />
            <a id="save-recipe"><p>[1] Записать</p></a>
        </form>
        <a class="temporaly-menu" id="clear-form"><p>[2] Очистить форму</p></a>
        <a class="temporaly-menu" id="back-to-main"><p>[3] Назад</p></a>
    `);
    
    const clearFormLink = document.querySelector('#clear-form');
    clearFormLink.addEventListener('click', function(e) {
        e.preventDefault();
        const inputs = document.querySelectorAll('.temporaly-menu input[type="text"]');
        inputs.forEach(input => input.value = '');
    });

    const saveRecipeLink = document.querySelector('#save-recipe');
    saveRecipeLink.addEventListener('click', function(e) {
        e.preventDefault();
        const id = document.querySelector('#id-input').value.trim();
        const name = document.querySelector('#name-input').value.trim();
        const text = document.querySelector('#text-input').value.trim();
        if (!id || !name || !text || !/^[0-9]+$/.test(id)) {
            document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
            content.insertAdjacentHTML('beforeend', `
                <p class="temporaly-menu">
                    Запись... провал <br/>
                    Ошибка: данные невалидны
                </p>
                <br class="temporaly-menu" />
                <a class="temporaly-menu" id="back-to-new-recipe"><p>[1] Назад</p></a>
            `);
            const backToNewRecipeLink = document.querySelector('#back-to-new-recipe');
            backToNewRecipeLink.addEventListener('click', function(e) {
                e.preventDefault();
                onNewRecipeClick(e);
            });
            return;
        }
        let recipes = getStoredData();
        const existingIds = recipes.map(item => item.id);

        if (!existingIds.includes(id)) {
            recipes.push({ id: id, name: name, text: text });
            setStoredData(recipes);
            document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
            content.insertAdjacentHTML('beforeend', `
                <p class="temporaly-menu">
                    Запись... готово <br/>
                    Файл успешно добавлен
                </p>
                <br class="temporaly-menu" />
                <a class="temporaly-menu" id="back-to-new-recipe"><p>[1] Назад</p></a>
            `);
            const backToNewRecipeLink = document.querySelector('#back-to-new-recipe');
            backToNewRecipeLink.addEventListener('click', function(e) {
                e.preventDefault();
                onNewRecipeClick(e);
            });
        } else {
            document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
            content.insertAdjacentHTML('beforeend', `
                <p class="temporaly-menu">
                    Запись... провал <br/>
                    Ошибка: рецепт с таким идентификатором уже существует
                </p>
                <br class="temporaly-menu" />
                <a class="temporaly-menu" id="back-to-new-recipe"><p>[1] Назад</p></a>
            `);
            const backToNewRecipeLink = document.querySelector('#back-to-new-recipe');
            backToNewRecipeLink.addEventListener('click', function(e) {
                e.preventDefault();
                onNewRecipeClick(e);
            });
            return;
        }
    });
}

function onListClick(e) {
    e.preventDefault();
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
    const recipes = getStoredData();

    if (recipes.length > 0) {
        content.insertAdjacentHTML('beforeend', '<br class="temporaly-menu">');
        recipes.forEach((recipe, idx) => {
            const recipeElement = document.createElement('a');
            recipeElement.className = 'temporaly-menu';
            recipeElement.innerHTML = `<p>[${idx + 1}] ИД-${recipe.id}-РЦПТ-НВД-1: ${recipe.name}</p>`;
            recipeElement.addEventListener('click', () => displayRecipeDetails(recipe.id));
            content.appendChild(recipeElement);
        });
        content.insertAdjacentHTML(
            'beforeend',
            `<a class="temporaly-menu" id="back-to-main"><p>[${recipes.length + 1}] Назад</p></a>`
        );
    } else {
        content.insertAdjacentHTML(
            'beforeend',
            `<p class="temporaly-menu">Данные отсутствуют</p><br class="temporaly-menu"><a class="temporaly-menu" id="back-to-main"><p>[1] Назад</p></a>`
        );
    }
}

function displayRecipeDetails(recipeId) {
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
    const recipes = getStoredData();
    const recipe = recipes.find(item => item.id === recipeId);

    if (recipe) {
        content.insertAdjacentHTML('beforeend', `
            <div class="temporaly-menu">
                <p>Название: ${recipe.name}</p>
                <p>Текст: ${recipe.text}</p>
                <br />
                <a class="temporaly-menu" id="edit-recipe"><p>[1] Редактировать</p></a>
                <a class="temporaly-menu" id="delete-recipe"><p>[2] Удалить</p></a>
                <a class="temporaly-menu" id="back-to-list"><p>[3] Назад</p></a>
            </div>
        `);
        const backToListLink = document.querySelector('#back-to-list');
        backToListLink.addEventListener('click', function(e) {
            e.preventDefault();
            onListClick(e);
        });
        const deleteRecipeLink = document.querySelector('#delete-recipe');
        deleteRecipeLink.addEventListener('click', function(e) {
            e.preventDefault();
                const updatedRecipes = recipes.filter(item => item.id !== recipeId);
                setStoredData(updatedRecipes);
                onListClick(e);
        });
    } else {
        content.insertAdjacentHTML('beforeend', `
            <p class="temporaly-menu">Рецепт не найден.</p>
            <br />
            <a class="temporaly-menu" id="back-to-list"><p>[3] Назад</p></a>
        `);
        const backToListLink = document.querySelector('#back-to-list');
        backToListLink.addEventListener('click', function(e) {
            e.preventDefault();
            onListClick(e);
        });
    }
}

function restoreMainMenu() {
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
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
    restoreMainPageListener();
}

document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
    if (p.textContent.includes('[1] Список файлов')) {
        p.parentElement.addEventListener('click', onListClick);
    }
});

document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
    if (p.textContent.includes('[2] Новый файл')) {
        p.parentElement.addEventListener('click', onNewRecipeClick);
    }
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('#back-to-main');
    if (btn) {
        e.preventDefault();
        restoreMainMenu();
    }
});