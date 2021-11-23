import images from './images.js';

const sections = document.querySelectorAll('section');
const sectionMain = document.querySelector('section[id="main"]');
const sectionCategoriesGame1 = document.querySelector('section[id="categories-game1"]');
const sectionCategoriesGame2 = document.querySelector('section[id="categories-game2"]');
const sectionGame1 = document.querySelector('section[id="game1"]');
const sectionGame2 = document.querySelector('section[id="game2"]');
const popUpSetting = document.querySelector('.setting');
const popUpResult = document.querySelector('.result');
const audio = document.querySelectorAll('audio');

let currentQuestion = 0;
let countQuestions = 0;
let dotsArray;

// вешаем обработчики на кнопки
document.querySelectorAll('.btn-nav.home').forEach((el) => {
    el.addEventListener('click', () => {
        sound.bonk();
        showSection(sectionMain);
    });
});
document.querySelectorAll('.btn-nav.category1').forEach((el) => {
    el.addEventListener('click', () => {
        sound.bonk();
        showSection(sectionCategoriesGame1);
    });
});
document.querySelectorAll('.btn-nav.category2').forEach((el) => {
    el.addEventListener('click', () => {
        sound.bonk();
        showSection(sectionCategoriesGame2);
    });
});
document.querySelector('.next-quiz').addEventListener('click', (el) => {
    if (currentQuestion < 120) {
        sound.bonk();
        startGame1(currentQuestion);
    } else {
        sound.bonk();
        startGame2(currentQuestion);
    }
});
document.querySelectorAll('.btn-setting').forEach((el) => {
    el.addEventListener('click', (el) => {
        sound.bonk();
        showSettingPopUp();
    });
});
popUpSetting.querySelector('.reset').addEventListener('click', (el) => {
    sound.bonk();
    setting.reset();
});
popUpSetting.querySelector('.save').addEventListener('click', (el) => {
    sound.bonk();
    setting.save();
    hideSettingPopUp();
});
popUpSetting.querySelector('input[name=volume]').addEventListener('input', (el) => {
    if (el.target.value == 0) {
        popUpSetting.querySelector('.setting img[name=volume]').src = "/Assets/Svg/mute.svg";
    } else {
        popUpSetting.querySelector('.setting img[name=volume]').src = "/Assets/Svg/volume.svg";
    }
});
popUpSetting.querySelector('input[name=timer]').addEventListener('input', (el) => {
    if (el.target.value == 0) {
        popUpSetting.querySelector('.setting img[name=timer]').style.opacity = '0.3';
    } else {
        popUpSetting.querySelector('.setting img[name=timer]').style.opacity = '1.0';
    }
});

console.log(popUpSetting.querySelector('input[name=volume]'));

// LocalStorage
class LocalStorage {
    constructor() {
        if (!localStorage.getItem('scores')) {
            this.result = [];

            for (let i = 0; i < 24; i++) {
                this.result.push(new Array(10).fill(null));
            }
            this.saveLS();
        } else {
            this.loadLS();
        }
    }

    saveLS() {
        localStorage.setItem('scores', JSON.stringify(this.result));
    }

    loadLS() {
        this.result = JSON.parse(localStorage.getItem('scores'));
    }

}

const scores = new LocalStorage();

// класс Настройки
class Setting {
    constructor() {
        this.timerTime = localStorage.getItem('timerTime') || 20;
        this.timerOn = localStorage.getItem('timerOn') || false;
        this.volume = localStorage.getItem('volume') || 50;
        this.volumeOn = localStorage.getItem('volumeOn') || false;
    }
    // переносим настройки в окно
    show() {
        if (this.timerOn) {
            popUpSetting.querySelector('.setting img[name=timer]').style.opacity = '1.0';
            popUpSetting.querySelector('.setting input[name=timer]').value = `${this.timerTime}`;
        } else {
            popUpSetting.querySelector('.setting img[name=timer]').style.opacity = '0.3';
            popUpSetting.querySelector('.setting input[name=timer]').value = `0`;
        }
        if (this.volumeOn) {
            popUpSetting.querySelector('.setting img[name=volume]').src = "/Assets/Svg/volume.svg";
            popUpSetting.querySelector('.setting input[name=volume]').value = `${this.volume}`;
        } else {
            popUpSetting.querySelector('.setting img[name=volume]').src = "/Assets/Svg/mute.svg";
            popUpSetting.querySelector('.setting input[name=volume]').value = `0`;
        }
    }
    reset() {
        this.timerTime = 20;
        this.timerOn = false;
        this.volume = 50;
        this.volumeOn = false;
        this.show();
    }
    save() {
        this.timerTime = +popUpSetting.querySelector('.setting input[name=timer]').value;
        this.timerOn = this.timerTime > 0;
        this.volume = +popUpSetting.querySelector('.setting input[name=volume]').value;
        this.volumeOn = this.volume > 0;
        localStorage.setItem('timerTime', this.timerTime);
        localStorage.setItem('timerOn', this.timerOn);
        localStorage.setItem('volume', this.volume);
        localStorage.setItem('volumeOn', this.volumeOn);
    }
}

let setting = new Setting();

// PopUp результаты игры
function showResultPopUp() {

    console.log(dotsArray);
    // формируем содержание окна в зависимости от результата
    const result = dotsArray.filter((el) => el === true).length;

    console.log(result);

    document.querySelector('.text-result').textContent = `${result} / 10`;

    // показываем окно
    popUpResult.style.left = 'calc(50% - 200px)';
    sound.win();
}
function hideResultPopUp() {
    popUpResult.style.left = '-1000px';
}

// PopUp настройки
function showSettingPopUp() {
    setting.show();
    // показываем окно
    popUpSetting.style.left = 'calc(50% - 200px)';
}
function hideSettingPopUp() {
    popUpSetting.style.left = '-1000px';
}

// Игра1 - угадай автора картины
const options = document.querySelectorAll('.answer'); // поля с ответами
const dots = sectionGame1.querySelectorAll('.dot'); // поля с ответами

options.forEach((el) => {
    el.addEventListener('click', () => {

        console.log(el.textContent);

        if (countQuestions < 10) {
            sound.bonk2();
            const result = el.textContent === images[ currentQuestion ].author;
            // окрашиваем фон ответа в зависимости от ответа (зеленый/красный)
            result ? el.style.backgroundColor = 'green' : el.style.backgroundColor = 'red';
            dotsArray.push(result);
            showDotsGame1();
        }

        currentQuestion++;
        countQuestions++;
        if (countQuestions < 10) {
            setTimeout(showQuestion, 1000, currentQuestion);
            // showQuestion(currentQuestion);
            console.log(dotsArray);
        }
        if (countQuestions === 10) {
            sound.bonk2();
            showResultPopUp();
            const indexArray = (currentQuestion - 10) / 10;
            scores.result[ indexArray ] = dotsArray;
            scores.saveLS();
        }
    });
});

// стартуем викторину из 10 вопросов, передаем стартовый номер картины
function startGame1(num) {
    currentQuestion = num;
    countQuestions = 0;
    dotsArray = [];
    showQuestion(currentQuestion);
}

// отображение точек с результатами ответов
function showDotsGame1() {
    // красим все точки в серый
    for (let i = 0; i < dots.length; i++) {
        dots[ i ].style.backgroundColor = "gray";
    }
    // красим в красный ложные ответы и в зеленый правильные
    for (let i = 0; i < dotsArray.length; i++) {
        console.log(dotsArray.length);
        dotsArray[ i ] ? dots[ i ].style.backgroundColor = "green" : dots[ i ].style.backgroundColor = "red";
    }
}

// показать новый вопрос (картину и варианты ответов)
function showQuestion(num) {
    // скрываем окно результатов, если есть
    hideResultPopUp();
    // окрашиваем варианты ответов в бирюзовый
    const answers = sectionGame1.querySelectorAll('.answer');

    answers.forEach((el) => {
        el.style.backgroundColor = 'aquamarine';
    });

    const picture = document.querySelector('.picture-artist img');
    picture.src = `/Assets/Img/full/${num}full.jpg`;        // показываем новую картину

    const optionsAnswers = getOptionsAnswers(num);          // получаем варианты ответов

    // показываем варианты ответов
    for (let i of options) {
        i.textContent = optionsAnswers[ i.dataset.answer ];
    }
    showDotsGame1();

}

// функция возвращает массив с 4-мя значениями вариантов ответов.
// на вход передается номер картины
function getOptionsAnswers(num) {
    const result = [];
    result.push(images[ num ].author);           // добавляем правильный вариант ответа
    let i = 1;                  // счетчик найденных вариантов ответа (1 уже есть - это верный ответ)
    while (i < 4) {
        const option = Math.floor(Math.random() * 241);
        // делаем проверку, что бы авторы картин не повторялись
        if (!result.includes(images[ option ].author)) {
            result.push(images[ option ].author);
            i++;
        }
    }
    // перемещаем правильный ответ с первого места на случайное
    const newPlace = Math.floor(Math.random() * 4);
    const rightAnswer = result.splice(0, 1)[ 0 ];
    result.splice(newPlace, 0, rightAnswer);        // вставляем правильный ответ на новое место

    return result;
}


// показ секции

showSection(sectionMain);

function showSection(section) {
    // скрываем окно результата, если оно показывается
    hideResultPopUp();

    if (section === sectionCategoriesGame1 || section === sectionCategoriesGame2) {
        makeCategoriesPages();
    }
    sections.forEach((el) => {
        el.classList.add('none');
    });
    section.classList.remove('none');
}

// слушатели на главной странице Main
const changeGames = document.querySelectorAll('.change-game');

changeGames.forEach((el) => {
    el.addEventListener('click', (el2) => {
        switch (el.id) {
            case 'game-artist':
                showSection(sectionCategoriesGame1);
                break;
            case 'game-pictures':
                showSection(sectionCategoriesGame2);
                break;
        }
    });
});

// заполнение страниц категорий
// sectionCategoriesGame1 - 1-я игра категории
// sectionCategoriesGame2 - 2-я игра категории
makeCategoriesPages();
function makeCategoriesPages() {
    // удаление предыдущих (если есть)
    while (sectionCategoriesGame1.querySelector('.stages').firstChild) {
        sectionCategoriesGame1.querySelector('.stages').removeChild(sectionCategoriesGame1.querySelector('.stages').firstChild);
    }
    while (sectionCategoriesGame2.querySelector('.stages').firstChild) {
        sectionCategoriesGame2.querySelector('.stages').removeChild(sectionCategoriesGame2.querySelector('.stages').firstChild);
    }


    // заполнение карточками категорий (12 шт)
    for (let i = 0; i < 12; i++) {
        sectionCategoriesGame1.querySelector('.stages').innerHTML += `<div id="game1-stage${i + 1}" class="stage game1">Этап<br> <b>${i + 1}</b></div>`;
        sectionCategoriesGame2.querySelector('.stages').innerHTML += `<div id="game2-stage${i + 1}" class="stage game2">Этап<br> <b>${i + 1}</b></div>`;
    }
    const categoryesGame1 = sectionCategoriesGame1.querySelectorAll('.stage');
    const categoryesGame2 = sectionCategoriesGame2.querySelectorAll('.stage');

    // назначение фоновіх картинок на карточки (по первому слайду)
    let i = 0;
    categoryesGame1.forEach((el) => {
        el.style.backgroundImage = `url("/assets/Img/img/${i}.jpg")`;
        i += 10;
    });
    categoryesGame2.forEach((el) => {
        el.style.backgroundImage = `url("/assets/Img/img/${i}.jpg")`;
        i += 10;
    });

    // показ очков, набранных в предыдущих играх на карточках категорий
    categoryesGame1.forEach((el) => {
        const indexLS = el.id.slice(el.id.indexOf('stage') + 5) - 1;
        const score = scores.result[ indexLS ].filter((el) => el === true).length;

        if (scores.result[ indexLS ][ 0 ] !== null) {
            el.innerHTML += `<div class="stage-score">Баллы - ${score}</div>`;
            score > 5 ? el.style.borderColor = 'green' : el.style.borderColor = 'red';
        }
    });
    categoryesGame2.forEach((el) => {
        const indexLS = el.id.slice(el.id.indexOf('stage') + 5) - 1 + 12;
        const score = scores.result[ indexLS ].filter((el) => el === true).length;

        if (scores.result[ indexLS ][ 0 ] !== null) {
            el.innerHTML += `<div class="stage-score">Баллы - ${score}</div>`;
            score > 5 ? el.style.borderColor = 'green' : el.style.borderColor = 'red';
        }
    });

    // отслеживание нажатий по категориям
    categoryesGame1.forEach((el) => {
        el.addEventListener('click', (el2) => {
            const numCategory = +el.id.slice(11);
            showSection(sectionGame1);
            startGame1((numCategory - 1) * 10);
        });
    });
    categoryesGame2.forEach((el) => {
        el.addEventListener('click', (el2) => {
            const numCategory = +el.id.slice(11) + 12;
            showSection(sectionGame2);
            startGame2((numCategory - 1) * 10);
        });
    });


}

// game2

const optionsGame2 = sectionGame2.querySelectorAll('.pictures4 img'); // поля с ответами
const dotsGame2 = sectionGame2.querySelectorAll('.dot'); // поля с ответами

optionsGame2.forEach((el) => {

    el.addEventListener('click', el2 => {
        const numChangedPict = +el.src.slice(el.src.indexOf('img/') + 4, el.src.indexOf('.jpg'));

        if (countQuestions < 10) {
            const result = numChangedPict === currentQuestion;
            // el.style.backgroundColor = ""
            dotsArray.push(result);
            showDotsGame2();
        }

        currentQuestion++;
        countQuestions++;
        if (countQuestions < 10) {
            showQuestionGame2(currentQuestion);
            console.log(dotsArray);
        }
        if (countQuestions === 10) {
            showResultPopUp();
            const indexArray = (currentQuestion - 10) / 10;
            scores.result[ indexArray ] = dotsArray;
            scores.saveLS();
        }
    });
});

// стартуем викторину из 10 вопросов, передаем стартовый номер картины
function startGame2(num) {
    currentQuestion = num;
    countQuestions = 0;
    dotsArray = [];
    showQuestionGame2(currentQuestion);
}

// отображение точек с результатами ответов
function showDotsGame2() {
    // красим все точки в серый
    for (let i = 0; i < dotsGame2.length; i++) {
        dotsGame2[ i ].style.backgroundColor = "gray";
    }
    // красим в красный ложные ответы и в зеленый правильные
    for (let i = 0; i < dotsArray.length; i++) {
        console.log(dotsArray.length);
        dotsArray[ i ] ? dotsGame2[ i ].style.backgroundColor = "green" : dotsGame2[ i ].style.backgroundColor = "red";
    }
}


// показать новый вопрос (картину и варианты ответов)
function showQuestionGame2(num) {
    // скрываем окно результатов, если есть
    hideResultPopUp();

    const optionsAnswers = getOptionsAnswersGame2(num);          // получаем варианты ответов
    let i = 0;
    optionsGame2.forEach((el) => {
        el.src = optionsAnswers[ i++ ];
    });

    // показываем вопрос
    sectionGame2.querySelector('.text-question').textContent = `Какую картину написал ${images[ num ].author}?`;
    showDotsGame2();
}

// функция возвращает массив с 4-мя значениями вариантов ответов.
// на вход передается номер картины
function getOptionsAnswersGame2(num) {
    const result = [];
    result.push(`/Assets/Img/img/${num}.jpg`);           // добавляем правильный вариант ответа
    let i = 1;                  // счетчик найденных вариантов ответа (1 уже есть - это верный ответ)
    while (i < 4) {
        const option = Math.floor(Math.random() * 241);
        // делаем проверку, что бы авторы картин не повторялись
        if (!result.includes(`/Assets/Img/img/${option}.jpg`)) {
            result.push(`/Assets/Img/img/${option}.jpg`);
            i++;
        }
    }
    // перемещаем правильный ответ с первого места на случайное
    const newPlace = Math.floor(Math.random() * 4);
    const rightAnswer = result.splice(0, 1)[ 0 ];
    result.splice(newPlace, 0, rightAnswer);        // вставляем правильный ответ на новое место

    return result;
}


// Звуки
class Sound {
    win() {
        audio[ 4 ].volume = setting.volumeOn ? setting.volume / 100 : 0;
        audio[ 4 ].play();
    }
    lose() {
        audio[ 3 ].volume = setting.volumeOn ? setting.volume / 100 : 0;
        audio[ 3 ].play();
    }
    bonk() {
        audio[ 0 ].volume = setting.volumeOn ? setting.volume / 100 : 0;
        audio[ 0 ].play();
    }
    bonk2() {
        audio[ 1 ].volume = setting.volumeOn ? setting.volume / 100 : 0;
        audio[ 1 ].play();
    }
}

const sound = new Sound();

