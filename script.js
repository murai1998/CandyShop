const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let id = null;
let frames = 1;

let shopImg = new Image()
let cartImage = new Image();
let candy1 = new Image();
let candy2 = new Image();
let candy3 = new Image();
let candy4 = new Image();
let name = [candy1, candy2, candy3, candy4]
shopImg.src = 'Images/CandyShop.jpg'
cartImage.src = 'Images/backG.png';
candy1.src = 'Images/candy1.png'
candy2.src = 'Images/candy2.png'
candy3.src = 'Images/candy3.png'
candy4.src = 'Images/candy4.png'

shopImg.onload = animate;
cartImage.onload = animate;
candy1.onload = animate;
candy2.onload = animate;
candy3.onload = animate;
candy4.onload = animate;

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
        this.level = 1
    }

    createCandies = () => {
        for (let i = 0, length = 5; i < name.length; i++) {
            let obj = new Candy({
                img: name[i],
                x: length,
                y: -135,
                width: 135,
                height: 135,

            });
            this.candies.push(obj);
            if (i === 1) length += 230
            length += 140
        }
    }
    drawCandies = () => this.candies.forEach(candy => candy.drawCandy());
    removeCandy = () => this.candies.forEach((candy, i) => {
        canvas.onclick = candy.remove();
        //candy.onclick = candy.remove();
    });


    generator = () => {
        let num1 = Math.floor(Math.random() * (this.max - this.min)) + this.min;
        let num2 = Math.floor(Math.random() * (this.max - this.min)) + this.min;
        let index = Math.floor(Math.random() * operators.length) % operators.length;
        let sign = operators[index].sign;
        let result = operators[index].result(num1, num2);
        let string = `${num1} ${sign} ${num2} = ?`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(string, canvas.width / 2 - 50, canvas.height / 2 + 140);
    }
    drawGame = () => {
        game.createCandies();
        //game.drawCandies();
        //game.generator()
    }
    gameOver() {
        if (this.lives <= 0) {
            window.cancelAnimationFrame(this.id)
        }
    }

}

class Candy {
    constructor({
        img,
        x,
        y,
        width,
        height
    }) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    drawCandy = () => {
        this.y += 1;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
})



function drawShop() {
    ctx.drawImage(shopImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(cartImage, canvas.width / 2 - 160, canvas.height / 2 + 68, 290, 140);
}
let framesPerSecond = 10;

/*function animate() {
    setTimeout(function () {
        id = window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShop();
        game.drawGame()
    }, 10000);
}*/



function animate() {
    setTimeout(function () {
        id = window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.drawGame();
        game.generator();
    }, 10);


    window.requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShop();
    game.drawCandies();
    game.removeCandy()
};