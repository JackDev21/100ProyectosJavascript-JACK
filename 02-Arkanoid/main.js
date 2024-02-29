
// acceder al canvas en el html
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

//tamaño del canvas
canvas.width = 600
canvas.height = 400


/*VARIABLES DE LA PELOTA*/
const ballRadius = 4;

//Posicion Pelota
let posicionX = canvas.width / 2;
let posicionY = canvas.height - 30;

//Velocidad Pelota
let velocidadX = -2; // eje X es en horizontal
let velocidadY = -2; // eje Y es en vertical


/*Variables de la paleta */
const paddleHeight = 10
const paddleWidth = 75

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false;
let leftPressed = false;



const drawBall = () => {
  ctx.beginPath()
  ctx.arc(posicionX, posicionY, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()
}


const drawPaddle = () => {

  ctx.fillStyle = 'orange'
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight) // x, y, ancho, alto


}
const drawBricks = () => {

}


const collisionDetection = () => {

}

const ballMovement = () => {

  // rebote de las pelotas en laterales
  if (velocidadX + posicionX >= canvas.width - ballRadius || // Pared derecha
    velocidadX + posicionX <= ballRadius // Pared izquierda
  ) {
    velocidadX = -velocidadX
  }

  // rebote de las pelotas en arriba
  if (velocidadY + posicionY <= ballRadius) {
    velocidadY = -velocidadY
  }


  // Pelota caida por abajo GAmeOver

  if (velocidadY + posicionY >= canvas.height - ballRadius) {
    console.log('GAME OVER')
    document.location.reload()
  }


  //Mover pelota
  posicionX += velocidadX
  posicionY += velocidadY

}

const paddleMovement = () => {
  if (rightPressed) {
    paddleX += 7
  } else if (leftPressed) {
    paddleX -= 7
  }

}



const cleanCanvas = () => {

  ctx.clearRect(0, 0, canvas.width, canvas.height)
}


const initEvents = () => {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  const keyDownHandler = (event) => {

    const { key } = event
    if (key === 'Rigth' || key === 'ArrowRight') {
      rightPressed = true
    }
    if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true

    }
  }

  const keyUpHandler = (event) => {

    const { key } = event
    if (key === 'Rigth' || key === 'ArrowRight') {
      rightPressed = false
    }
    if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false

    }
  }
}



const draw = () => {  // esta función es la base para todos los videojuegos.


  cleanCanvas()

  // Primero dibujamos los elementos
  drawBall()
  drawPaddle()
  drawBricks()
  //drawScore()

  // colisiones y movimientos
  collisionDetection()
  ballMovement()
  paddleMovement()


  window.requestAnimationFrame(draw)
}

draw()
initEvents()