
// acceder al canvas en el html
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')



//tamaño del canvas
canvas.width = 600
canvas.height = 400


/*VARIABLES DE LA PELOTA*/
const ballRadius = 4;

//Posicion Pelota
let posicionX = canvas.width / 2;
let posicionY = canvas.height - 30;

// Direccion Pelota
let direccionX = -2; // eje X es en horizontal
let direccionY = -2; // eje Y es en vertical


/*VARIABLES DE LA PALETA */
const paddleHeight = 10
const paddleWidth = 55

const PADDLE_SENSITIVITY = 7

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false;
let leftPressed = false;


/*VARIABLES DE LOS LADRILLOS */

const bricksRowCount = 6 // 6 filas
const bricksColumnCount = 13 // 13 columnas
const bricksWith = 39 // ancho de cada ladrillo
const bricksHeight = 15 // alto de cada ladrillo
const brickPadding = 1 // espacio entre ladrillos
const brickOffsetTop = 32 // espacio arriba
const brickOffsetLeft = 31 // espacio a la izquierda
const bricks = []

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
}


for (let columna = 0; columna < bricksColumnCount; columna++) {
  bricks[columna] = [] // inicializa el array vacio
  for (let fila = 0; fila < bricksRowCount; fila++) {
    const brickX = (columna * (bricksWith + brickPadding)) + brickOffsetLeft
    const brickY = (fila * (bricksHeight + brickPadding)) + brickOffsetTop

    // Asignar un color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8)
    //Guardamos la información de los ladrillos
    bricks[columna][fila] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random
    }
  }


}




const drawBall = () => {
  ctx.beginPath()
  ctx.arc(posicionX, posicionY, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()
}


const drawPaddle = () => {

  //ctx.fillStyle = 'orange' color de la paleta
  //ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight) // fondo de la paleta/tamaño x, y, ancho, alto

  ctx.drawImage(
    $sprite, // imagen
    29, // clip x de la imagen
    174, // clip y de la imagen
    paddleWidth, // tamaño del recorte alto
    paddleHeight, // tamaño del recorte ancho
    paddleX, // posicion x del dibujo
    paddleY, // posicion y del dibujo
    paddleWidth, // ancho del dibujo
    paddleHeight // alto del dibujo
  )

}

const drawBricks = () => {
  for (let columna = 0; columna < bricksColumnCount; columna++) {
    for (let fila = 0; fila < bricksRowCount; fila++) {
      const currentBrick = bricks[columna][fila]

      if (currentBrick.status === BRICK_STATUS.DESTROYED) {
        continue;

      }

      //ctx.fillStyle = "yellow" // color de los ladrillos
      //ctx.rect(currentBrick.x, currentBrick.y, bricksWith, bricksHeight) // fondo de los ladrillos/tamaño x, y, ancho, alto
      ctx.stroke()
      ctx.fill()


      const clipX = currentBrick.color * 32
      ctx.drawImage(
        $bricks,
        clipX,
        0,
        31,
        14,
        currentBrick.x,
        currentBrick.y,
        bricksWith,
        bricksHeight,
      )
    }
  }
}

const collisionDetection = () => {
  for (let columna = 0; columna < bricksColumnCount; columna++) {
    for (let fila = 0; fila < bricksRowCount; fila++) {
      const currentBrick = bricks[columna][fila]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) {
        continue
      }
      const isBallSameXAsBrick =
        posicionX > currentBrick.x &&
        posicionX < currentBrick.x + bricksWith
      const isBallSameYAsBrick =
        posicionY > currentBrick.y &&
        posicionY < currentBrick.y + bricksHeight



      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        direccionY = -direccionY
        currentBrick.status = BRICK_STATUS.DESTROYED
      }

    }
  }
}


const ballMovement = () => {

  // rebote de las pelotas en laterales
  if (direccionX + posicionX >= canvas.width - ballRadius || // Pared derecha
    direccionX + posicionX <= ballRadius // Pared izquierda
  ) {
    direccionX = -direccionX
  }

  // rebote de las pelotas en arriba
  if (direccionY + posicionY <= ballRadius) {
    direccionY = -direccionY
  }

  // Pelota toca la paleta
  const isBallSameXAsPaddle = (
    posicionX >= paddleX && posicionX <= paddleX + paddleWidth)

  // 
  const isBallTouchingPaddle = (
    posicionY + direccionY > paddleY
  )




  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    direccionY = -direccionY // Cambia la direccion de la pelota (rebota)

  } else if ( // Pelota toca suelo GAmeOver
    direccionY + posicionY >= canvas.height - ballRadius) {
    console.log('GAME OVER')
    document.location.reload()
  }


  //Mover pelota
  posicionX += direccionX
  posicionY += direccionY

}

const paddleMovement = () => {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY

  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY
  }

}



const cleanCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}


const initEvents = () => {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)
}

const keyUpHandler = (event) => {

  const { key } = event
  if (key === 'Right' || key === 'ArrowRight') {
    rightPressed = false
  }
  if (key === 'Left' || key === 'ArrowLeft') {
    leftPressed = false

  }
}

const keyDownHandler = (event) => {

  const { key } = event
  if (key === 'Right' || key === 'ArrowRight') {
    rightPressed = true
  }
  if (key === 'Left' || key === 'ArrowLeft') {
    leftPressed = true

  }
}

const draw = () => {  // esta función es la base para todos los videojuegos.
  console.log({ rightPressed, leftPressed })

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
