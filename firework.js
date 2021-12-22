const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
// full sceen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//make Colors
let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "F"]

function colorRandom() {
    let hexColor = "#"
    for (let i = 0; i < 6; i++) {
        hexColor += array[Math.floor(Math.random() * array.length)]
    }
    return hexColor;
}

function pushColor() {
    let color = [];
    for (let i = 0; i < 10; i++) {
        color.push(colorRandom());
    }
    return color;
}
let gravity = -0.1
let fireworks = []
let subFireworks = []

class Firework {
    constructor(x, y, radius, veclocityX, veclocityY, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.veclocityX = veclocityX
        this.veclocityY = veclocityY
        this.color = color
        this.opacity = 1
    }
    update() {
        this.veclocityY -= gravity
        this.x += this.veclocityX
        this.y += this.veclocityY
        this.opacity -= 0.006
        if (this.opacity < 0) this.opacity = 0
    }
    draw() {
        canvasContext.save()
        canvasContext.globalAlpha = this.opacity
        canvasContext.beginPath()
        canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        canvasContext.fillStyle = this.color
        canvasContext.fill()
        canvasContext.closePath()
        canvasContext.restore()
    }
}
let animate = () => {
    requestAnimationFrame(animate)
    update()
    draw()
}



// let colors = ["Blue", "Orange", "Red", "Purple", "Green"]
let colors = pushColor();
let initializedCount = 0
let maximumInitialize = 1

let initDelay = 1000 //ms
let fireworkRadius = 5;
let particleCount = 50
let speedMultiplier = 5

let createSubFireworks = (x, y, count, color, speedMultiplier) => {
    let created = 0
    let radians = (Math.PI * 2) / count
    while (created < count) {
        let firework = new Firework(x, y, fireworkRadius,
            Math.cos(radians * created) * Math.random() * speedMultiplier,
            Math.sin(radians * created) * Math.random() * speedMultiplier,
            colors[Math.floor(Math.random() * colors.length)])

        subFireworks.push(firework);
        // console.log(subFirework);
        created++;
    }
}

let update = () => {
    canvasContext.fillStyle = "rgba(10,0,0,0.1)"
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    if (initializedCount < maximumInitialize) {
        let firework = new Firework(canvas.width * Math.random(),
            canvas.height + Math.random() * 65,
            fireworkRadius,
            3 * (Math.random() - 0.5), -12,
            colors[Math.floor(Math.random() * colors.length)]
        )
        fireworks.push(firework)
            // console.log(fireworks)
        setTimeout(() => {
            initializedCount--;
        }, initDelay)
        initializedCount++;
    }
    fireworks.forEach((firework, i) => {
        if (firework.opacity <= 0.1) {
            fireworks.splice(i, 1)
            createSubFireworks(firework.x, firework.y, particleCount, firework.color, speedMultiplier)
        } else {
            firework.update();
        }
    })
    subFireworks.forEach((firework, i) => {
        if (firework.opacity <= 0) {
            subFireworks.splice(i, 1);
        } else {
            firework.update();
        }
    })
}

let draw = () => {
    fireworks.forEach((firework) => {
        firework.draw();
    })
    subFireworks.forEach((firework) => {
        firework.draw();
    })
}
animate()