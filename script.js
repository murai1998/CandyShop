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
candy1.src = 'Images/candy.jpg'
candy2.src = 'Images/candy2.png'
candy3.src = 'Images/candy4.png'
candy3.src = 'Images/candy5.png'

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
    }) {
        this.candies = candies
        this.frames = frames
        this.id = id
        this.score = score
    }

    drawCandies = () => {
        for (let i = 1; i < 5; i++) {
            let length = 50;
            let obj = new Candy({
                img: name[i],
                x: length,
                y: -50,
                width: 135,
                height: 200,

            });
            this.candies.push(obj);
            this.candies[i].drawCandy()
            length += 185
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
        this.y += 1
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
    score: 0
})



function drawShop() {
    ctx.drawImage(shopImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(cartImage, canvas.width / 2 - 160, canvas.height / 2 + 68, 290, 140);
}


function generator() {
    let num1 = Math.floor(Math.random() * (max - min)) + min;
    let num2 = Math.floor(Math.random() * (max - min)) + min;
    let index = Math.floor(Math.random() * operators.length) % operators.length;
    let sign = operators[index].sign;
    let result = operators[index].result(num1, num2);
    let string = `${num1} ${sign} ${num2}`;
    console.log(result);
    return [string, result]
}

function drawExpression() {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    let arr = generator();
    ctx.fillText(arr[0], canvas.width / 2, canvas.height / 2);
}


function animate() {
    id = window.requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShop();
    game.drawCandies()
    if (frames % 1000 === 0) {

    }
    frames++;
}