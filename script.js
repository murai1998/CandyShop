let start = document.querySelector('#start');
let finish = document.querySelector('#finish');
start.onclick = gameStart;
finish.onclick = () => {

}

function gameStart() {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    let id = null;
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
    cartImage.onload = animate;
    candy1.onload = animate;
    candy2.onload = animate;
    candy3.onload = animate;
    candy4.onload = animate;
    music.onload = animate;


    //-----Class Game---
    class Game {
        constructor({
            candies,
            frames,
            id,
            score,
            max,
            min
        }) {
            this.candies = candies
            this.frames = frames
            this.id = id
            this.score = score
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
            results.push(result - 1);
            results.push(result + 1);
            results.push(result - 2);
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
            this.y += 0.1;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.fillText(this.num, this.x + 34, this.y + 70);
            ctx.style

        }
    }



    let max = 100; //will change later for different leves, It will go to the Game class
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

    let game = new Game({
        candies: [],
        frames: 1,
        id: null,
        score: 0,
        max: 100,
        min: 0
    });
    //----Remove candies----
    canvas.addEventListener('mousedown', function (e) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        game.candies.forEach(candy => {
            if (candy.x <= x && x <= candy.x + candy.width && candy.y <= y && y <= candy.y + candy.height) {
                if (candy.num === game.result) {
                    game.createCandies();
                } else {
                    hearts[game.lives - 1].remove()
                    game.lives -= 1;
                    if (game.lives === 0) {
                        game.candies = [];
                        music.pause();
                        clearInterval(id);
                        erase();
                    } else {
                        alert(`Oops! Wrong answer!`);
                        game.createCandies();
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
        window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShop();
        music.play()
        ctx.font = "45px bolder Stencil Std, fantasy";
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white'
        ctx.strokeText(game.equipment, canvas.width / 2 - 72, canvas.height / 2 + 145);

        if (game.candies[0].y >= canvas.height) {
            hearts[game.lives - 1].remove()
            game.lives -= 1;


            if ((game.lives === 0) && (timer === 0)) {
                game.candies = [];
                music.pause();
                clearInterval(id);
                erase();
            } else {
                alert(`Oops! Wrong answer!`);
                game.createCandies();
            }
        }
        game.drawCandies();
        game.removeCandy();

    };
    //----Timer----
    id = setInterval(function () {
        document.querySelector('#timer span').innerHTML = timer
        timer--;
        if (timer === 0 || game.lives === 0) {
            document.querySelector('#timer').innerHTML = '0'
            document.querySelector('#timer').remove();
        }
    }, 1000)

    //----Create candies----
    setTimeout(function () {
        id = window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.createCandies();
    }, 10);
}