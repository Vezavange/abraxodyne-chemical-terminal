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
    document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
        if (p.textContent.includes('[3] Резервная копия')) {
            p.parentElement.addEventListener('click', onBackupClick);
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

function editRecipe(e, recipeId) {
    e.preventDefault();
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
    const recipes = getStoredData();
    const recipe = recipes.find(item => item.id === recipeId);
    if (!recipe) {
        content.insertAdjacentHTML('beforeend', `
            <p class="temporaly-menu">
                Рецепт не найден.
            </p>
            <br class="temporaly-menu" />
            <a class="temporaly-menu" id="back-to-main"><p>[1] Назад</p></a>
        `);
        return;
    }
    content.insertAdjacentHTML('beforeend', `
        <form class="temporaly-menu">
            <label id="id">Идентификатор >></label><input type="text" id="id-input" value="${recipe.id}" /><br />
            <label id="name">Название >></label><input type="text" id="name-input" value="${recipe.name}" /><br />
            <label id="text">Текст >></label><input type="text" id="text-input" value="${recipe.text}" /><br />
            <br class="temporaly-menu" />
            <a id="save-recipe"><p>[1] Сохранить изменения</p></a>
        </form>
        <a class="temporaly-menu" id="clear-form"><p>[2] Очистить форму</p></a>
        <a class="temporaly-menu" id="back-to-list"><p>[3] Назад</p></a>
        `);
        const backToListLink = document.querySelector('#back-to-list');
        backToListLink.addEventListener('click', function(e) {
            e.preventDefault();
            onListClick(e); 
    });
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
        if (!name || !text || !id || !/^[0-9]+$/.test(id)) {
            document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
            content.insertAdjacentHTML('beforeend', `
                <p class="temporaly-menu">
                    Запись... провал <br/>
                    Ошибка: данные невалидны
                </p>
                <br class="temporaly-menu" />
                <a class="temporaly-menu" id="back-to-edit-recipe"><p>[1] Назад</p></a>
            `);
            const backToEditRecipeLink = document.querySelector('#back-to-edit-recipe');
            backToEditRecipeLink.addEventListener('click', function(e) {
                e.preventDefault();
                editRecipe(e, recipeId); 
            });
            return;
        }
        const recipeIndex = recipes.findIndex(item => item.id === recipeId);
        if (recipeIndex !== -1) {
            recipes[recipeIndex] = { id: id, name: name, text: text }; 
            setStoredData(recipes);
            document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
            content.insertAdjacentHTML('beforeend', `
                <p class="temporaly-menu">
                    Запись... готово <br/>
                    Рецепт успешно обновлен
                </p>
                <br class="temporaly-menu" />
                <a class="temporaly-menu" id="back-to-list"><p>[1] Назад</p></a>
            `);
            const backToListLink = document.querySelector('#back-to-list');
            backToListLink.addEventListener('click', function(e) {
                e.preventDefault();
                onListClick(e); 
        });
        } else {
            document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
            content.insertAdjacentHTML('beforeend', `
                <p class="temporaly-menu">
                    Запись... провал <br/>
                    Ошибка: рецепт не найден
                </p>
                <br class="temporaly-menu" />
                <a class="temporaly-menu" id="back-to-edit-recipe"><p>[1] Назад</p></a>
            `);
            const backToEditRecipeLink = document.querySelector('#back-to-edit-recipe');
            backToEditRecipeLink.addEventListener('click', function(e) {
                e.preventDefault();
                editRecipe(e, recipeId);
            });
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
        const editRecipeLink = document.querySelector('#edit-recipe');
        editRecipeLink.addEventListener('click', function(e) {
            e.preventDefault(); 
            editRecipe(e, recipeId); 
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

async function createBackup() {
    const data = getStoredData();
    const backup = {
        date: new Date().toISOString(),
        dataArray: data
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backupData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);   
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
    content.insertAdjacentHTML('beforeend', `
        <p class="temporaly-menu">Резервная копия создана успешно</p>
        <a class="temporaly-menu" id="back-to-main"><p>[1] Назад</p></a>
    `);
}

function restoreFromBackup() {
    const input = document.createElement('input');
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                setStoredData(backupData);
                alert("Данные восстановлены успешно.");
            } catch (error) {
                alert("Ошибка восстановления данных: " + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function onBackupClick(e) {
    e.preventDefault();
    document.querySelectorAll('.temporaly-menu').forEach(el => el.remove());
    const content = document.querySelector('.content');
    content.insertAdjacentHTML('beforeend', `
            <a class="temporaly-menu" id="backup-data"><p>[1] Сделать резервную копию</p></a>
            <a class="temporaly-menu" id="restore-data"><p>[2] Восстановить из резервной копии</p></a>
            <a class="temporaly-menu" id="back-to-main"><p>[3] Назад</p></a>
    `);
    const backupDataLink = document.getElementById('backup-data');
    backupDataLink.addEventListener('click', createBackup);
    const restoreDataLink = document.getElementById('restore-data');
    restoreDataLink.addEventListener('click', restoreFromBackup);
    const backToMainLink = document.getElementById('back-to-main');
    backToMainLink.addEventListener('click', restoreMainMenu);
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

document.querySelectorAll('a.temporaly-menu > p').forEach(p => {
    if (p.textContent.includes('[3] Резервная копия')) {
        p.parentElement.addEventListener('click', onBackupClick);
    }
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('#back-to-main');
    if (btn) {
        e.preventDefault();
        restoreMainMenu();
    }
});