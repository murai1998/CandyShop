let main = document.querySelector('#main');
let totalScore = document.querySelector('#totalScore')
main.style.visibility = 'hidden';
totalScore.style.visibility = 'hidden';
let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let id = null;
let start = document.querySelector('#start');
//let restart = document.querySelector('#restart');
let finish = document.querySelector('#finish');
start.onclick = () => {
    document.querySelector('#intro').remove();
    main.style.visibility = 'visible';
    gameStart();
}

let score = 0
let animateid = null;
let candyid = null;





function gameStart() {
    let frames = 1;
    let hearts = document.querySelectorAll('#heart');
    let timer = 90;

    let shopImg = new Image()
    let cartImage = new Image();
    let candy1 = new Image();
    let candy2 = new Image();
    let candy3 = new Image();
    let candy4 = new Image();
    let music = new Audio();



    let name = [candy1, candy2, candy3, candy4]
    shopImg.src = 'Images/CandyShop.jpg'
    cartImage.src = 'Images/backG.png';
    candy1.src = 'Images/candy3.png'
    candy2.src = 'Images/candy1.png'
    candy3.src = 'Images/candy2.png'
    candy4.src = 'Images/candy4.png'
    music.src = 'Images/musicBack.mp3'


    shopImg.onload = animate;
    let state = {
        volume: true
    }
    let mute = document.querySelector('#mute');
    mute.onclick = () => {
        state.volume = !state.volume;
        if (state.volume) {
            music.play();
            document.querySelector('#mute').innerHTML = `<img src='Images/volume.png' alt='clock' width="30" height="30" />`
        } else {
            music.pause();
            document.querySelector('#mute').innerHTML = `<img src='Images/mute.png' alt='clock' width="30" height="30" />`
        }

    }



    //-----Class Game---
    class Game {
        constructor({
            candies,
            frames,
            id,
            max,
            min
        }) {
            this.candies = candies
            this.frames = frames
            this.id = id
            this.max = max
            this.min = min
            this.lives = 3
            this.level = 1;
        }
        createCandies = () => {
            this.candies = [];
            let num1 = Math.floor(Math.random() * (this.max - this.min)) + this.min;
            let num2 = Math.floor(Math.random() * (this.max - this.min)) + this.min;
            let index = Math.floor(Math.random() * operators.length) % operators.length;
            let sign = operators[index].sign;
            let result = operators[index].result(num1, num2);
            this.equipment = `${num1} ${sign} ${num2}`;
            let results = [];
            results.push(result);
            let ranArr = generateArrayRandomNumber(1, 9)
            results.push(result - ranArr[0]);
            results.push(result + ranArr[1]);
            results.push(result + ranArr[2]);
            results = shuffle(results);
            this.result = result;
            for (let i = 0, length = 5; i < name.length; i++) {

                let obj = new Candy({
                    img: name[i],
                    x: length,
                    y: -135,
                    width: 135,
                    height: 135,
                    num: results[i]
                });
                this.candies.push(obj);
                if (i === 1) length += 230
                length += 140
            }
        }
        drawCandies = () => this.candies.forEach(candy => candy.drawCandy());
        removeCandy = () => this.candies.forEach((candy, i) => {});
    }



    //-----class Candy----
    class Candy {
        constructor({
            img,
            x,
            y,
            width,
            height,
            num
        }) {
            this.img = img;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.num = num;
        }
        drawCandy = () => {
            this.y += 1;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.strokeText(this.num, this.x + 34, this.y + 70);


        }
    }



    let max = 100;
    let min = 0;
    let operators = [{
            sign: '+',
            result: (num1, num2) => {
                return num1 + num2
            }
        },
        {
            sign: '-',
            result: (num1, num2) => {
                return num1 - num2
            }
        },
        {
            sign: '*',
            result: (num1, num2) => {
                return num1 * num2
            }
        }
    ];
    /*restart.onclick = () => {
        let game = new Game({
            candies: [],
            frames: 1,
            id: null,
            max: 100,
            min: 0
        });
        gameStart();
        music.play();
        game.createCandies();
    }*/
    let game = new Game({
        candies: [],
        frames: 1,
        id: null,
        max: 100,
        min: 0
    });
    music.play();
    game.createCandies();
    //========================ERASE==========================================================
    function erase() {
        document.querySelector('#score').remove();
        clearInterval(id);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        music.pause();
        music.src = '';
        cancelAnimationFrame(animateid);
        document.querySelector('#main').remove()
        totalScore.style.visibility = 'visible';
    }
    finish.onclick = erase

    function scoreRusult() {
        if (score >= 0 && score <= 100) return document.querySelector('#resultRange').innerHTML = `Looks like you need more practice!!!`;
        if (score > 100 && score <= 300) return document.querySelector('#resultRange').innerHTML = `I know you can do better than this!!!`;
        if (score > 300 && score <= 500) return document.querySelector('#resultRange').innerHTML = `Good results!!! But there's always room for improvement`;
        else return document.querySelector('#resultRange').innerHTML = `Excellent results!!!`;

    }

    //----Remove candies----
    canvas.addEventListener('mousedown', function (e) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        game.candies.forEach(candy => {
            if (candy.x <= x && x <= candy.x + candy.width && candy.y <= y && y <= candy.y + candy.height) {
                if (candy.num === game.result) {
                    score += 50;
                    document.querySelector('#totalScore strong').innerHTML = score;
                    console.log(score);
                    scoreRusult()
                    game.createCandies();
                } else {
                    hearts[game.lives - 1].remove()
                    game.lives -= 1;
                    if (game.lives === 0) {
                        game.candies = [];
                        scoreRusult()
                        erase()
                    } else {
                        alert(`Oops! Wrong answer!`);
                        game.createCandies();
                        scoreRusult()
                    }

                }
                console.log({
                    x,
                    y
                });
            }
        });
    });

    function drawShop() {
        ctx.drawImage(shopImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(cartImage, canvas.width / 2 - 160, canvas.height / 2 + 68, 290, 140);
    }


    function generateArrayRandomNumber(min, max) {
        let totalNumbers = max - min + 1;
        let arrayTotalNumbers = []
        let arrayRandomNumbers = []
        let tempRandomNumber;
        while (totalNumbers--) {
            arrayTotalNumbers.push(totalNumbers + min);
        }
        while (arrayTotalNumbers.length) {
            tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
            arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
            arrayTotalNumbers.splice(tempRandomNumber, 1);
        }
        return arrayRandomNumbers;
    }


    //---Random array---
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }


    //-----Animation-----
    function animate() {
        animateid = window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShop();
        ctx.font = "45px Concert One cursive";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4.5;
        ctx.strokeText(game.equipment, canvas.width / 2 - 72, canvas.height / 2 + 145);
        console.log("Hello");
        if (game.candies[0].y >= canvas.height) {
            if (game.lives - 1 >= 0) hearts[game.lives - 1].remove()
            game.lives -= 1;
            console.log(game.lives)
            if ((game.lives === 0) || (timer === 0)) {
                game.candies = [];
                erase()

            } else {
                alert(`Oops! Wrong answer!`);
                game.createCandies();
            }
        }
        game.drawCandies();
        game.removeCandy();
        //game.createCandies();
        if (Number(frames) % 1000 === 0) {
            let scoreBoard = document.querySelector('#score span');
            scoreBoard ? scoreBoard.innerText = score : scoreBoard.innerText = 0;
        }
        frames++;

    };
    //----Timer----
    id = setInterval(function () {
        if (timer === 0 || game.lives === 0) {
            document.querySelector('#timer').innerHTML = '0'
            document.querySelector('#timer').remove();
        }
        document.querySelector('#timer span').innerHTML = timer
        timer--;

    }, 1000)

    //----Create candies----
    /*setTimeout(function () {
        candyid = window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.createCandies();
    }, 10);*/
    return score;
}



let canvas2 = document.querySelector('#canvas2');
let ctx2 = canvas2.getContext('2d');
let img = new Image();
img.src = '/Users/thatchampion/Desktop/Ironhack/CandyShop/Images/Firework.png'
let height = 256;
let counter = 0;
let frame2 = 1;
let num = 1


canvas2.onmouseover = function animation2() {
    id = window.requestAnimationFrame(animation2)
    let modulo = Math.floor(counter % 5);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    let x = 100;
    let x2 = 200;
    let y = 0;
    let widthH = 300;
    let heigthH = 300;
    for (let i = 0; i < 3; i++) {
        if (i % 2 === 0) {
            ctx2.drawImage(img, 1024, height * modulo, 256, 256, x2, y + 30, widthH + 200, heigthH + 200);
        }
        ctx2.drawImage(img, 0, height * modulo, 256, 256, x, y, widthH, heigthH);
        x += 400;
        x2 += 200;
    }

    counter = counter + .03;

    frame2++;
    if (frame2 >= 6000) {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        window.cancelAnimationFrame(animation2);
    }

}



const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
//let total = document.querySelector('#score span').innerText
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
console.log(score);

const MAX_HIGH_SCORES = 3;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});
console.log(finalScore.innerText);
saveHighScore = (e) => {
    e.preventDefault();
    const score2 = {
        score2: score,
        name: username.value,
    };
    highScores.push(score2);
    highScores.sort((a, b) => b.score2 - a.score2);
    highScores.splice(3);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    // window.location.assign('/Users/thatchampion/Desktop/Ironhack/CandyShop/index.html');
    location.reload()
};


const highScoresList = document.querySelector("#highScoresList");


highScoresList.innerHTML = highScores
    .map(score2 => {
        return `<li class="high-score">${score2.name.toUpperCase()} - ${score2.score2}</li>`;
    })
    .join("");