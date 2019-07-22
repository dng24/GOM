//display graduate when done
//add 5 pts when pass green
//div should show through
//menu/instructions
function startGame() {
  gameArea.start();
}
var stayUp = false; //these two variables are for the stay up and hope for the best
var hopeBest = false; //event handlers.

var gameArea = {
  canvasB: document.createElement("canvas"), //canvas for the cells
  canvas: document.createElement("canvas"), //canvas for the grid lines
  canvasP: document.createElement("canvas"), //canvas for when the players aren't moving
  canvasM: document.createElement("canvas"), //canvas for when the players are moving
  start: function() {
    var height = 600; //height of the canvases. changing this number will resize all other vars accordingly
    var width = height * 1.8;//2.142857;

    //set size of canvases
    this.canvasB.height = height;
    this.canvasB.width = width;
    this.canvas.height = height;
    this.canvas.width = width;
    this.canvasP.height = height;
    this.canvasP.width = width;
    this.canvasM.height = height;
    this.canvasM.width = width;

    //get contexts of canvases
    this.contextB = this.canvasB.getContext("2d");
    this.context = this.canvas.getContext("2d");
    this.contextP = this.canvasP.getContext("2d");
    this.contextM = this.canvasM.getContext("2d");

    //insert the canvases and the div for scoreboard
    document.body.insertBefore(document.createElement("div"), document.body.childNodes[0]);
    document.body.insertBefore(this.canvasB, document.body.childNodes[1]);
    document.body.insertBefore(this.canvas, document.body.childNodes[2]);
    document.body.insertBefore(this.canvasP, document.body.childNodes[3]);
    document.body.insertBefore(this.canvasM, document.body.childNodes[4]);

    //add the logo to the scoreboard
    document.getElementsByTagName("div")[0].appendChild(document.createElement("img"));
    document.getElementsByTagName("img")[0].src = "logo.png";
    document.getElementsByTagName("img")[0].style.width = "150px";

    //current player indicator
    document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
    document.getElementsByTagName("p")[0].id = "plyr";

    drawGrid(height, width);
    this.cells = drawCells(); //info on the cells
    this.roll = 0; //the number rolled

    //wecome screen
    displays(["welcome"], []);
    document.getElementById("beginBtn").addEventListener("click", function() {
      displays(["numPlayers"], ["welcome"]);
      this.removeEventListener('click', arguments.callee);
    })

    //number players screen
    var numPlayers = 0;
    document.getElementById("btn2").addEventListener("click", function() {
      setNumPlyrs(2);
      this.removeEventListener('click', arguments.callee);
    });
    document.getElementById("btn3").addEventListener("click", function() {
      setNumPlyrs(3);
      this.removeEventListener('click', arguments.callee);
    });
    document.getElementById("btn4").addEventListener("click", function() {
      setNumPlyrs(4);
      this.removeEventListener('click', arguments.callee);
    });
    document.getElementById("btn5").addEventListener("click", function() {
      setNumPlyrs(5);
      this.removeEventListener('click', arguments.callee);
    });
    document.getElementById("btn6").addEventListener("click", function() {
      setNumPlyrs(6);
      this.removeEventListener('click', arguments.callee);
    });

    function setNumPlyrs(num) {
      numPlayers = num;
      displays(["playerColor"], ["numPlayers"]);
    }

    //create array of players
    this.players = new Array(numPlayers);
    this.currentPlayer = 0; //the current player

    //choose colors screen
    var count = 0; //keeps track of how many ppl have chosen colors so far
    document.getElementById("Rojo").addEventListener("click", function() {
      chooseColors("Rojo", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Naranja").addEventListener("click", function() {
      chooseColors("Naranja", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Amarillo").addEventListener("click", function() {
      chooseColors("Amarillo", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Verde").addEventListener("click", function() {
      chooseColors("Verde", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Azul").addEventListener("click", function() {
      chooseColors("Azul", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Morado").addEventListener("click", function() {
      chooseColors("Morado", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Negro").addEventListener("click", function() {
      chooseColors("Negro", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Blanco").addEventListener("click", function() {
      chooseColors("Blanco", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });
  }
}

function chooseColors(color, count, numPlayers) {
  gameArea.players[count] = new Player(color);
  displays([], [color]);
  if(count + 1 != numPlayers) { //still more ppl need to choose colors
    document.getElementById("colorTitle").innerHTML = "Jugador " + (count + 2) + ": Elige un color";
  } else { //everyone has chosen colors
    document.getElementById("playerColor").style.display = "none";
    for(var i = 0; i < 2 * gameArea.players.length; i+=2) { //populates the scoreboard with players and scores
      document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
      document.getElementsByTagName("p")[i + 1].innerHTML = "Puntuación de<br>Jugador " + gameArea.players[i/2].color + ":";
      document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
      document.getElementsByTagName("p")[i + 2].innerHTML = "20 pf";
      document.getElementsByTagName("p")[i + 2].id = gameArea.players[i/2].color + "Score";
    }
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("div")[0].appendChild(document.createElement("p")); //element for weekend & break notification

    //resume button
    document.getElementsByTagName("div")[0].appendChild(document.createElement("button"));
    document.getElementsByTagName("button")[0].id = "resume";
    document.getElementById("resume").innerHTML = "Continuen";
    displays([], ["resume"]);

    document.getElementById("resume").addEventListener("click", function() {
      displays([gameArea.hide], ["resume"]);
    });

    onePlay();
  }
}

//start of a play
function onePlay() {
  console.log("BEGIN\nPOSITION: " + gameArea.players[gameArea.currentPlayer].position);
  document.getElementById("plyr").innerHTML = "Jugador actual: <br>" + gameArea.players[gameArea.currentPlayer].color; //set current player
  document.getElementById("rollDiceTitle").innerHTML = "Jugador " + gameArea.players[gameArea.currentPlayer].color + ": Tira los Dados"; //title for dice roll

  //roll dice
  displays(["dice"], []);
  document.getElementById("rollBtn").addEventListener("click", function() {
    rollDice("rollBtn", "okDiceBtn", "diceImg", "", "", "", false, false);
    this.removeEventListener('click', arguments.callee);
  });
  //player has rolled dice and clicks ok
  document.getElementById("okDiceBtn").addEventListener("click", function() {
    displays(["rollBtn"], ["dice", "okDiceBtn"]);
    gameArea.cells[gameArea.players[gameArea.currentPlayer].position].occupied = false;
    gameArea.players[gameArea.currentPlayer].move(gameArea.roll, false);
    this.removeEventListener('click', arguments.callee);
  });
}

//shows and hides elements
function displays(show, hide) {
  gameArea.hide = hide[0]; //resume button will know which modal to reopen when game is paused
  for(var i = 0; i < show.length; i++) {
    document.getElementById(show[i]).style.display = "block";
  }
  for(var i = 0; i < hide.length; i++) {
    document.getElementById(hide[i]).style.display = "none";
  }
}

function drawGrid(height, width) {
  var c = gameArea.context;
  var div = height / 7.6923; //distance between the center of the gaps
  var gap = height / 70; //half the space between the rows on the board
  var adjust = height / 70; //adjust factor since top row doesn't have top gap

  //draws vertical lines
  for(var i = 1; i < 15; i++) {
    for(var j = 0; j < 9; j++) {
      c.beginPath();
      if(j == 0) { //beginning point for top row lines
        c.moveTo(i * (width / 15), j * div - div - gap - adjust);
      } else {
        c.moveTo(i * (width / 15), j * div - div + gap - adjust);
      }

      //end point for top/bottom row lines and spaces that connect to the
      //row above or below
      if(j == 8 || j == 0 || i == 1 && j % 2 == 0 || i == 14 && j % 2 == 1) {
        c.lineTo(i * (width / 15), j * div + gap - adjust);
      } else { //end point for rest of the vertical lines
        c.lineTo(i * (width / 15), j * div - gap - adjust);
      }
      c.stroke();
    }
  }

  //draws horizontal lines
  for(var i = 1; i < 8; i++) {
    if(i % 2 == 0) { //rows that connect to row below on left side
      drawLine(c, 0, i * div - adjust, width / 15, i * div - adjust);
      drawLine(c, width / 15, i * div - gap - adjust, width, i * div - gap - adjust);
      drawLine(c, width / 15, i * div + gap - adjust, width, i * div + gap - adjust);
    } else { //rows that connect to row below on right side
      drawLine(c, 0, i * div - gap - adjust, width * (14/15), i * div - gap - adjust);
      drawLine(c, 0, i * div + gap - adjust, width * (14/15), i * div + gap - adjust);
      drawLine(c, width * (14/15), i * div - adjust, width, i * div - adjust);
    }
  }

  //puts text on the canvas
  var height = gameArea.canvas.height;
  gameArea.context.font = "13px sans-serif";
  gameArea.context.fillText("Comienzo", height / 100, height / 1.04);
  gameArea.context.fillText("Final", height / 23, height / 18);
  gameArea.context.fillText("Fin de", height / 0.91, height / 1.045);
  gameArea.context.fillText("Semana", height / 0.91, height / 1.02);
  gameArea.context.fillText("Fin de", height / 0.821, height / 1.21);
  gameArea.context.fillText("Semana", height / 0.821, height / 1.18);
  gameArea.context.fillText("Fin de", height / 55, height / 1.21);
  gameArea.context.fillText("Semana", height / 55, height / 1.18);
  gameArea.context.fillText("Fin de", height / 1.165, height / 1.445);
  gameArea.context.fillText("Semana", height / 1.165, height / 1.4);
  gameArea.context.fillText("Fin de", height / 0.686, height / 1.77);
  gameArea.context.fillText("Semana", height / 0.686, height / 1.71);
  gameArea.context.fillText("Fin de", height / 2.65, height / 1.77);
  gameArea.context.fillText("Semana", height / 2.65, height / 1.71);
  gameArea.context.fillText("Vacaciones", height / 2.75, height / 2.24);
  gameArea.context.fillText("Fin de", height / 0.59, height / 2.3);
  gameArea.context.fillText("Semana", height / 0.59, height / 2.2);
  gameArea.context.fillText("Fin de", height / 2, height / 3.2);
  gameArea.context.fillText("Semana", height / 2, height / 3);
  gameArea.context.fillText("Fin de", height / 1.355, height / 5.5);
  gameArea.context.fillText("Semana", height / 1.355, height / 5);
  gameArea.context.fillText("Fin de", height / 0.747, height / 20);
  gameArea.context.fillText("Semana", height / 0.747, height / 14);
}

//for cell borders
function drawLine(c, startX, startY, endX, endY) {
  c.beginPath();
  c.moveTo(startX, startY);
  c.lineTo(endX, endY);
  c.stroke();
}

function cEN(color) {
  var colorEN;
  switch(color) {
    case "Rojo":
      colorEN = "red";
      break;
    case "Naranja":
      colorEN = "orange";
      break;
    case "Amarillo":
      colorEN = "yellow";
      break;
    case "Verde":
      colorEN = "green";
      break;
    case "Azul":
      colorEN = "blue";
      break;
    case "Morado":
      colorEN = "purple";
      break;
    case "Negro":
      colorEN = "black";
      break;
    case "Blanco":
      colorEN = "white";
      break;
  }
  return colorEN;
}

function Player(color) {
  this.x = gameArea.canvasP.width * 0.033; //center x
  this.y = gameArea.canvasP.height * 0.9555; //center y
  this.r = gameArea.canvasP.height * 0.03; //radius
  this.color = color;
  this.cP = gameArea.contextP;
  this.cM = gameArea.contextM;
  this.position = 1; //start is 1, finish is 120
  this.hp = 20; //each player starts with 20 happiness points
  this.draw = function(ctx) { //draws the player
    ctx.fillStyle = cEN(color);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
  this.clear = function(ctx) { //clears the sceen of the player
    ctx.clearRect(this.x - this.r - 2, this.y - this.r - 2, 2 * this.r + 4, 2 * this.r + 4);
  }
  this.move = function(numMoves, extra) { //moves a player
    console.log("POS3 " + this.position);
    this.draw(this.cM);

    //clears player from permanent canvas on first move and if the move is not an extra one
    if(numMoves == gameArea.roll && !extra) {
      this.clear(this.cP);
    }

    var dir = (this.position % 30 > 0 && this.position % 30 < 15); //move left or right
    var type;
    if(numMoves == 0) { //finished moving
      type = 0;
    } else if(this.position % 15 == 0) { //move up
      type = 3;
    } else if(dir) { //move right
      type = 1;
    } else { //move left
      type = 2;
    }

    //moves differently depending on position
    var plyr = this;
    switch(type) {
      case 0:
        //if the target cell is occupied, move to the next one
        if(this.position < 120 && gameArea.cells[this.position].occupied) {
          this.move(1, true);
        } else { //get the info for the cell & put player on permanent canvas
          console.log("GETTING CELL INFO");
          gameArea.cells[this.position].occupied = true;
          plyr.draw(plyr.cP);
          getCellInfo(this.position - 1, this);
        }
        break;
      case 1:
        moveDir(1, true);
        break;
      case 2:
        moveDir(2, true);
        break;
      case 3:
        moveDir(3, false);
        break;
    }

    function moveDir(type, dir) {
      var i = 0;
      var len = dir ? Math.floor(gameArea.canvasP.width / 15) : Math.ceil((13/100) * gameArea.canvasP.height); //how many pixels to move
      var moving = setInterval(function() { //moves pixel by pixel & animate it
        plyr.clear(plyr.cM);
        if(type == 1) { //move right
          (plyr.x)++;
        } else if(type == 2) { //move left
          (plyr.x)--;
        } else { //move right
          (plyr.y)--;
        }
        plyr.draw(plyr.cM);
        i++;
        if(i == len) { //finished moving to the next cell
          clearInterval(moving); //stop animation
          if(plyr.position < 120) { //not at last cell
            if(gameArea.cells[plyr.position - 1].text == "Fin de Semana") { //if pass weekend, add 5 hp
              plyr.hp += 5;
              passGreen("Fin de Semana, +5 pf");
            } else if(gameArea.cells[plyr.position - 1].text == "Vacaciones de Verano") { //if pass break, add 10 hp
              plyr.hp += 10;
              passGreen("Vacaciones de Verano, +10 pf");
            }
            plyr.move(numMoves - 1, false); //move to next space
          } else { //graduate!
            getCellInfo(119, plyr);
          }
        }
      }, 2);
      (plyr.position)++;
    }
  }
}

//pass a weekend or summer break cell
function passGreen(text) {
  document.getElementsByTagName("p")[2 * gameArea.players.length + 1].innerHTML = text; //notify that player passed green in scoreboard
  document.getElementById(gameArea.players[gameArea.currentPlayer].color + "Score").innerHTML = gameArea.players[gameArea.currentPlayer].hp + " pf";
  setTimeout(function() { //remove notification after 3 seconds
    document.getElementsByTagName("p")[2 * gameArea.players.length + 1].innerHTML = "";
  }, 3000);
}

//info for all the cells, [cell #, text, points], 99 if decision
var cellInfo = [
  [0, "¡Empecemos!", 0],
  [1, "Lee <i>Walden</i>", -7],
  [2, "Haz Amigos Nuevos", 8],
  [3, "Prueba Diagnóstica de CS", 99],
  [4, "Bournedale", 8],
  [5, "Procrastinación", 99],
  [6, "Deportes Varsity", 99],
  [7, "Primera Vez usando la Impresora 3D", 5],
  [8, "Laboratorio de Piedra y Globo", 99],
  [9, "Fin de Semana", 5],
  [10, "Haz un Sitio Web", 6],
  [11, "Recoge Manzanas", 3],
  [12, "Examen de Matemáticas", 99],
  [13, "Resuelve Problema Über en un Intento", 8],
  [14, "Pillado Diciendo Palabrotas", -4],
  [15, "Lanza Pelota de Ping Pong con Statapult", 1],
  [16, "Llega Tarde a la Clase de Física", -3],
  [17, "Olvídate de Guardar el Trabajo durante HiMCM", -5],
  [18, "Clase de Gimnasia con Entrenador Ketchum", 99],
  [19, "Fin de Semana", 5],
  [20, "Tire el Mantel de la Mesa", 99],
  [21, "Comida Gratis", 2],
  [22, "Duérmete en Clase", 99],
  [23, "Haz Crêpes con Sr. Regele", 2],
  [24, "Quédate levantado hasta las 4:30 de la Mañana", -4],
  [25, "Procrastinar", 99],
  [26, "Pillado Comiendo en la Biblioteca", -3],
  [27, "Pelea con la Pizarra \"Inteligente\" de Sr. Regele", -1],
  [28, "Procrastina en STEM I", -6],
  [29, "Fin de Semana", 5],
  [30, "Falla ACSL", -5],
  [31, "Genera un Meme de Calidad", 99],
  [32, "Obtén una Prolongación para el Laboratorio de Energía de Resorte", 8],
  [33, "Toca el Piano", 3],
  [34, "Falla el Mandelbrot", -5],
  [35, "Examen de CS", 99],
  [36, "Falla la Exámen de Movimiento Rotacional", -8],
  [37, "Fin de Semana", 5],
  [38, "Crea una Película", 7],
  [39, "Estudia para SAT", -5],
  [40, "Cree Tecnología de Asistencia para Discapacitados", 4],
  [41, "Gana el Concurso de Poesía de Slam", 9],
  [42, "Sr. Ellis Hace un Juego de Palabras", 4],
  [43, "Obtén una Nota Decente en el Ensayo de la Clase de Hum", 3],
  [44, "Habla en Inglés durante Lang", 99],
  [45, "Android Studios se Bloquea Portátil", -9],
  [46, "Confundido en la Física Cuántica", -2],
  [47, "Fin de Semana", 5],
  [48, "Criticado Presentando Problemas Matemáticos", -3],
  [49, "Procrastinar", 99],
  [50, "Gana el Concurso de Programación", 7],
  [51, "Demuestra un Teorema en la Clase de Matemáticas", 4],
  [52, "Ve a ISEF", 10],
  [53, "Atascado en PCMI", -4],
  [54, "Piérdete Encontrando el ATC", -2],
  [55, "Lee y Nunca Entiende \"El Páramo\"", -1],
  [56, "Fin de Semana", 5],
  [57, "Examen de Física", 99],
  [58, "Crea Arte Cónico Decente", 4],
  [59, "La Impresora Se Queda sin Tinta", 99],
  [60, "El App Se Rompe una Hora antes de la Feria", -7],
  [61, "Sr. Brunner Deja MAMS", -5],
  [62, "Aprende sobre el Espacio del Profesor Gatsonis", 5],
  [63, "Vacaciones de Verano", 10],
  [64, "Obtén un Ticket de Estacionamiento", -7],
  [65, "Olimpiadas de Orientación", 99],
  [66, "Demuestra el Teorema de Fermat", 8],
  [67, "Deportes Varsity", 99],
  [68, "Se olvide de firmar antes de entrar en la escuela", -2],
  [69, "Procrastinar", 99],
  [70, "Pierde el Pase de Estacionamiento", -5],
  [71, "Obtén una Puntuación de SAT Perfecta", 10],
  [72, "Comida Atascada en la Máquina Expendedora", -3],
  [73, "Examen", 99],
  [74, "Fin de Semana", 5],
  [75, "Sr. Barney Derrota la Mofeta", 4],
  [76, "Haz Amigos con Personas de Otras Secciones", 7],
  [77, "Despiértate a las 8 de la Mañana para Clase", -3],
  [78, "Molesta a los Estudiantes de WPI Jugando Pescado", -9],
  [79, "Conduce a la Clase durante la Tormenta de Nieve", -4],
  [80, "Deportes Varsity", 99],
  [81, "Obtén un 100 en un Examen", 7],
  [82, "Gana el Primer Lugar en la Competición de Matemáticas", 9],
  [83, "Sr. Ludt Revisa los Ensayos Universitarios", 3],
  [84, "Examen", 99],
  [85, "Fin de Semana", 5],
  [86, "Ser un Matemático en Quién Quiere ser un Matemático", 10],
  [87, "Procrastinar", 99],
  [88, "Realiza en Café Night", 4],
  [89, "Asignado un Libro de 300 Páginas para Leer por Semana", -4],
  [90, "Garaje de Estacionamiento Cierra Inesperadamente", -7],
  [91, "Despiértate a las 10 Todos los Días", 2],
  [92, "Llega tarde para el Examen Porque Hay una Tormenta de Nieve", 99],
  [93, "Obtén Pastel Gratis", 1],
  [94, "Haz Projecto a WPI hasta Medianoche", 99],
  [95, "Falla en el Estacionamiento Paralelo", -2],
  [96, "Fin de Semana", 5],
  [97, "Aceptado en la Universidad", 5],
  [98, "Gana el Primer Lugar en CyberPatriot", 9],
  [99, "Inesperadamente Obtén un A en una Clase", 8],
  [100, "Procrastinar", 99],
  [101, "Escribe Ensayos para Universidades y Becas", -3],
  [102, "Profesor Escala Sólo el Examen de Otra Sección", 99],
  [103, "Camine a WPI en 10°F Tiempo", -3],
  [104, "Averigua Cómo Pagar la Universidad", -5],
  [105, "Nada en la Piscina de WPI", 6],
  [106, "El Profesor Le Encanta Tu Presentación", 7],
  [107, "Procrastinar", 99],
  [108, "Fin de Semana", 5],
  [109, "Ninguna Clase los Miércoles", 3],
  [110, "Profesor Escala el Examen", 99],
  [111, "Rechazado de Colegio del Sueño", -8],
  [112, "Profesor Empuja Atrás el Examen", 3],
  [113, "Procrastinar", 99],
  [114, "Forma Grupos de Estudio", 6],
  [115, "Olvidate ID: Bloqueado de MAMS", -1],
  [116, "Ejecuta el Programa después de Escribir 1000 Líneas de Código", 99],
  [117, "Consigue un Neumático Plano", -6],
  [118, "Examen", 99],
  [119, "Licénciate", 10]
];

function Cell(position, text, points, color, x, y) {
  this.position = position;
  this.text = text;
  this.points = points;
  this.occupied = false;
  if(color == 1) {
    this.color = "rgb(247, 116, 1)"; //orange
  } else if(color == 2) {
    this.color = "rgb(78, 175, 0)"; //green
  } else {
    this.color = "rgb(1, 164, 225)"; //blue
  }
  this.x = x;
  this.y = y;
  this.width = gameArea.canvas.width / 15;
  this.height = (1/10) * gameArea.canvas.height;
  if(position % 15 == 0 || position % 15 == 1) { //edge cells are taller
    this.height += (gameArea.canvas.height / 70);
  }
}

function drawCells() {
  var cells = new Array(120);
  var cellPos = calcCellPos(); //0 based
  for(var i = 0; i < 120; i++) {
    var color = 1; //orange
    if(cellInfo[i][2] == 99) {
      color = 3; //blue, decisions
    } else if(cellInfo[i][1].localeCompare("Fin de Semana") == 0 || cellInfo[i][1].localeCompare("Vacaciones de Verano") == 0) {
      color = 2; //green
    }
    cells[i] = new Cell(i + 1, cellInfo[i][1], cellInfo[i][2], color, cellPos[i][0], cellPos[i][1]);

    //draws the cell
    gameArea.contextB.beginPath();
    gameArea.contextB.rect(cells[i].x, cells[i].y, cells[i].width, cells[i].height);
    gameArea.contextB.fillStyle = cells[i].color;
    gameArea.contextB.fill();
  }
  return cells;
}

//gets the cell position for all the cells
function calcCellPos() {
  var cellPos = new Array(120);
  var up = true;
  var x = 0;
  var y = gameArea.canvas.height - (1/10) * gameArea.canvas.height + gameArea.canvas.height / 70 - 3.7;
  var count = 0;
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 14; j++) { //changes x
      cellPos[count] = [x, y];
      x = up ? x + gameArea.canvas.width / 15 : x - gameArea.canvas.width / 15;
      count++;
    }

    //changes y
    cellPos[count] = [x, y - (gameArea.canvas.height / 70)];
    count++;
    up = !up;
    y -= ((9/78) * gameArea.canvas.height + (gameArea.canvas.height / 70));
  }
  return cellPos;
}

function getCellInfo(cell, plyr) {
  //cell is 0 based
  //position is 1 based
  console.log("Cell: " + cell + "\nPosition: " + plyr.position);
  console.log(gameArea.cells[cell].text);
  document.getElementById("fortune").innerHTML = gameArea.cells[cell].text;
  if(gameArea.cells[cell].color == "rgb(247, 116, 1)" || gameArea.cells[cell].color == "rgb(78, 175, 0)") { //orange & green
    console.log("LANDED ON ORANGE OR GREEN");

    //displays points
    var points = gameArea.cells[cell].points;
    if(points < 0) {
      document.getElementById("fortunePts").innerHTML = "Pierdes " + Math.abs(points) + " pf.";
    } else {
      document.getElementById("fortunePts").innerHTML = "Ganas " + points + " pf.";
    }
    displays(["orangeCell"], []);
    document.getElementById("okFortuneBtn").addEventListener("click", function() {
      displays([], ["orangeCell"]);
      //add points if not a weekend or summer break space (bc those points already added elsewhere)
      if(gameArea.cells[cell].text != "Fin de Semana" && gameArea.cells[cell].text != "Vacaciones de Verano") {
        plyr.hp += points;
      }
      document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " pf";
      nextPlayer();
      console.log("NEXT");
      this.removeEventListener('click', arguments.callee);
    });
  } else { //blue
    console.log("LANDED ON BLUE");
    //Test/Exam
    if(gameArea.cells[cell].text == "Examen" || cell == 12 || cell == 35 || cell == 57) {
      var type;
      if(cell == 12) {
        type = "Examen de matemáticas";
      } else if(cell == 35) {
        type = "Examen de CS";
      } else if(cell == 57) {
        type = "Examen de física";
      } else {
        type = "Examen";
      }
      for(var i = 1; i < 4; i++) {
        document.getElementById("exam" + i + "Title").innerHTML = type;
      }

      //roll button for first screen of exam
      displays(["examCell"], []);
      document.getElementById("examRollBtn").addEventListener("click", function() {
        rollDice("examRollBtn", "examOk", "examDiceImg", "", "", "", false, true);
        this.removeEventListener('click', arguments.callee);
      });

      //ok button for first screen of exam
      document.getElementById("examOk").addEventListener("click", function() {
        displays(["examRollBtn"], ["examCell", "examOk", "examResult"]);
        document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " pf";
        if(gameArea.roll > 4) {
          var points = 0;
          displays(["exam2Cell"], []);

          //third screen for exam
          if(!stayUp) { //not first time running code (so that event listener isn't created again)
            stayUp = true;
            document.getElementById("stayUp").addEventListener("click", function() {
              displays([], ["exam2Cell"]);
              noDecision(type + " - Quedarse Despierto Toda la Noche",
                        ["1 - Puntuación buena, +4 pf",
                        "2 - Puntuación buena, +4 pf",
                        "3 - Puntuación buena, +4 pf",
                        "4 - Puntuación mala, -5 pf",
                        "5 - Puntuación mala, -5 pf",
                        "6 - Puntuación mala, -5 pf"],
                        [4, 4, 4, -5, -5, -5]
              );
            });
          }
          if(!hopeBest) { //not first time running code (so that event listener isn't created again)
            hopeBest = true;
            document.getElementById("hopeForBest").addEventListener("click", function() {
              displays([], ["exam2Cell"]);
              noDecision(type + " - Esperanza para el Mejor",
                        ["1 - Puntuación buena, +10 pf",
                        "2 - Puntuación buena, +10 pf",
                        "3 - Puntuación buena, +10 pf",
                        "4 - Puntuación mala, -10 pf",
                        "5 - Puntuación mala, -10 pf",
                        "6 - Puntuación mala, -10 pf"],
                        [10, 10, 10, -10, -10, -10]
              );
            });
          }
        } else {
          nextPlayer();
          console.log("NEXT");
        }
        this.removeEventListener('click', arguments.callee);
      });

    } else if(gameArea.cells[cell].text == "Procrastinación") { //Procrastinate
      decision("Procrastina",
              ["1 - Completa la tarea con tiempo de sobra, +0 pf",
              "2 - Completa la tarea con tiempo de sobra, +0 pf",
              "3 - Apenas termina la asignación, +2 pf",
              "4 - Obtén una extensión, +4 pf",
              "5 - Completa la tarea tarde, -2 pf",
              "6 - Darse cuenta de que hay más de lo que se pensó originalmente, gire en incompleto, -6 pf"],
              [0, 0, 2, 4, -2, -6]
      );
    } else if(gameArea.cells[cell].text == "Deportes Varsity") { //Sports
      decision("Juega Deportes Varsity",
              ["1 - Todavía haces excelente en la escuela, +6 pf",
              "2 - Haces bien en la escuela, +3 pf",
              "3 - Haces bien en la escuela, +3 pf",
              "4 - Estresa sobre la escuela, -3 pf",
              "5 - Estresa sobre la escuela, -3 pf",
              "6 - Hace terrible en la escuela, -6 pf"],
              [6, 3, 3, -3, -3, -6]
      );
    } else if(cell == 3) { //CS Diagnostic
      noDecision("Prueba Diagnóstica de CS",
                ["1 - Lo hiciste impresionante, +3 pf",
                "2 - Lo hiciste bien, +0 pf",
                "3 - Lo hiciste bien, +0 pf",
                "4 - No entendiste nada, -5 pf",
                "5 - No entendiste nada, -5 pf",
                "6 - No entendiste nada, -5 pf"],
                [3, 0, 0, -5, -5, -5]
      );
    } else if(cell == 8) { //Rock & Balloon
      noDecision("Laboratorio de Piedra y Globo",
                ["1 - Correctamente formatea en 1 intento, +6 pf",
                "2 - Correctamente formatea en 2 intentos, +3 pf",
                "3 - Correctamente formatea en 3 intentos, +1 pf",
                "4 - Correctamente formatea en 4 intentos, -1 pf",
                "5 - Correctamente formatea en 5 intentos, -3 pf",
                "6 - Correctamente formatea en 6 o más intentos, -6 pf"],
                [6, 3, 1, -1, -3, -6]
      );
    } else if(cell == 18) { //Gym w Ketchum
      noDecision("Clase de Gimnasia con Entrenador Ketchum",
                ["1 - Excellente en los deportes, +5 pf",
                "2 - Bueno en los deportes, +2 pf",
                "3 - Bueno en los deportes, +2 pf",
                "4 - Bueno en los deportes, +2 pf",
                "5 - Terrible en los deportes, -1 pf",
                "6 - Terrible en los deportes, -1 pf"],
                [5, 2, 2, 2, -1, -1]
      );
    } else if(cell == 20) { //pull tablecloth
      decision("Tire el Mantel de la Mesa",
              ["1 - Nada se mueve en absoluto, +6 pf",
              "2 - Algunas cosas se mueven, +3 pf",
              "3 - Algunas cosas se mueven, +3 pf",
              "4 - Algunas cosas se mueven, +3 pf",
              "5 - Cuchara golpea tu cara, -5 pf",
              "6 - Cuchillo golpea tu cara, -10 pf"],
              [6, 3, 3, 3, -5, -10]
      );
    } else if(cell == 22) { //fall asleep in class
      noDecision("Duérmete en Clase",
                ["1 - No atrapado, +1 pf",
                "2 - No atrapado, +1 pf",
                "3 - No atrapado, +1 pf",
                "4 - Atrapado, -3 pf",
                "5 - Atrapado, -3 pf",
                "6 - Atrapado, -3 pf"],
                [1, 1, 1, -3, -3, -3]
      );
    } else if(cell == 31) { //generate quality meme
      noDecision("Genera Meme de Calidad",
                ["1 - Meme bien, +1 pf",
                "2 - Meme bueno, +2 pf",
                "3 - Meme fabuloso, +3 pf",
                "4 - Meme excelente, +4 pf",
                "5 - Meme caliente, +5 pf",
                "6 - Oro puro, +6 pf"],
                [1, 2, 3, 4, 5, 6]
      );
    } else if(cell == 44) { //speak eng during Lang
      noDecision("Habla en inglés durante Lang",
                ["1 - No atrapado, +0 pf",
                "2 - No atrapado, +0 pf",
                "3 - No atrapado, +0 pf",
                "4 - Atrapado, -3 pf",
                "5 - Atrapado, -3 pf",
                "6 - Atrapado, -3 pf"],
                [0, 0, 0, -3, -3, -3]
      );
    } else if(cell == 59) { //printer runs out of ink
      noDecision("La Impresora Se Queda sin Tinta",
                ["1 - Ni siquiera lo necesito ahora, +0 pf",
                "2 - Ni siquiera lo necesito ahora, +0 pf",
                "3 - Necesitas imprimir pero no es urgente, -1 pf",
                "4 - Necesitas imprimir pero no es urgente, -1 pf",
                "5 - Ensayo de Hum debido en 2 minutos, -4 pf",
                "6 - Diario del vocabulario de Lang debido en 1 minuto, -4 pf"],
                [0, 0, -1, -1, -4, -4]
      );
    } else if(cell == 65) { //orientation Olympics
      noDecision("Olimpiadas de Orientación",
                ["1 - Sección gana la mayoría de los eventos, +10 pf",
                "2 - Sección gana unos eventos, +5 pf",
                "3 - Sección gana unos eventos, +5 pf",
                "4 - Sección gana algunos eventos, +2 pf",
                "5 - Sección gana algunos eventos, +2 pf",
                "6 - Sección gana no eventos, -1 pf"],
                [10, 5, 5, 2, 2, -1]
      );
    } else if(cell == 92) { //late to exam bc of snowstorm
      noDecision("Tarde para el Examen Porque Hay una Tormenta de Nieve",
                ["1 - Todavía hiciste excelente, +6 pf",
                "2 - Todavía hiciste excelente, +6 pf",
                "3 - Hiciste bien, +3 pf",
                "4 - Hiciste bien, +3 pf",
                "5 - Hiciste terrible, -7 pf",
                "6 - Hiciste terrible, -7 pf"],
                [6, 6, 3, 3, -7, -7]
      );
    } else if(cell == 94) { //do proj @ wpi until 12
      noDecision("Haz Projecto a WPI hasta Medianoche",
                ["1 - No hacerlo en Foisie, -3 pf",
                "2 - No hacerlo en Foisie, -3 pf",
                "3 - No hacerlo en Foisie, -3 pf",
                "4 - Foisie se cierra y es expulsado, -6 pf",
                "5 - Foisie se cierra y es expulsado, -6 pf",
                "6 - Foisie se cierra y es expulsado, -6 pf"],
                [-3, -3, -3, -6, -6, -6]
      );
    } else if(cell == 102) { //prof only scale other section
      noDecision("Profesor Escala Sólo el Examen de Otra Sección",
                ["1 - Hiciste bueno por lo que no es importante, +0 pf",
                "2 - Hiciste bueno por lo que no es importante, +0 pf",
                "3 - Hiciste bueno por lo que no es importante, +0 pf",
                "4 - Hiciste malo y quieres la escala, -5 pf",
                "5 - Hiciste malo y quieres la escala, -5 pf",
                "6 - Hiciste terrible y realmente necesita la escala, -9 pf"],
                [0, 0, 0, -5, -5, -9]
      );
    } else if(cell == 110) { //prof scales Exam
      noDecision("Profesor Escala el Examen",
                ["1 - Ganó 2 puntos, +1 pf",
                "2 - Ganó 2 puntos, +1 pf",
                "3 - Ganó 5 puntos, +3 pf",
                "4 - Ganó 5 puntos, +3 pf",
                "5 - Ganó 8 puntos, +5 pf",
                "6 - Ganó 23 puntos, +10 pf"],
                [1, 1, 3, 3, 5, 10]
      );
    } else if(cell == 116) { //run prog aft writing 100 lines
      decision("Ejecuta el Programa después de Escribir 1000 Líneas de Código",
              ["1 - Funciona perfectamente, +30 pf",
              "2 - Funciona pero el comportamiento es incorrecto, +3 pf",
              "3 - Los errores toman 30 minutos para arreglar, -3 pf",
              "4 - Los errores toman 2 horas para arreglar, -7 pf",
              "5 - Los errores toman 2 horas para arreglar, -7 pf",
              "6 - Los errores toman 2 horas para arreglar, -7 pf"],
              [30, 3, -3, -7, -7, -7]
      );
    }
  }
}

function examResult() { //first screen of exam
  var arr = [["Lo hiciste mejor de lo que pensabas, +7 pf.",
            "Obtienes una puntuación buena, +3 pf.",
            "Obtienes una puntuación buena, +3 pf.",
            "Obtienes una puntuación mala, -7 pf.",
            "Procrastinas. Continuas a la pantalla siguiente.",
            "Procrastinas. Continuas a la pantalla siguiente."],
            [7, 3, 3, -7, 0, 0]
  ];
  document.getElementById("examResult").innerHTML = arr[0][gameArea.roll - 1];
  var points = arr[1][gameArea.roll - 1];
  displays(["examResult"], []);
  gameArea.players[gameArea.currentPlayer].hp += points;
}

//for decision cells where player can choose whether to do the thing
function decision(title, optArr, ptArr) {
  setOptions(title, optArr, 2);
  document.getElementById("opNoRollBtn").addEventListener("click", noRoll);
  document.getElementById("opRollBtn").addEventListener("click", roll);
  function noRoll() { //player chooses not to do thing
    document.getElementById("opNoRollBtn").removeEventListener("click", noRoll);
    document.getElementById("opRollBtn").removeEventListener("click", roll);
    document.getElementById("opResult").innerHTML = "Eliges no hacerlo, +0 hp";
    displays(["opOkBtn"], ["opNoRollBtn", "opRollBtn"]);
    document.getElementById("opOkBtn").addEventListener("click", function() {
      displays(["opNoRollBtn", "opRollBtn"], ["op", "opOkBtn"]);
      document.getElementById("opResult").innerHTML = "";
      nextPlayer();
      console.log("NEXT");
      this.removeEventListener('click', arguments.callee);
    });
  }

  function roll() { //player chooses to do thing
    document.getElementById("opNoRollBtn").removeEventListener("click", noRoll);
    document.getElementById("opRollBtn").removeEventListener("click", roll);
    displays([], ["op"]);
    setOptions(title, optArr, 3);
    rollDiceELs("opA", optArr, ptArr);
  }
}

//for decision cells where players must do thing
function noDecision(title, optArr, ptArr) {
  setOptions(title, optArr, 1);
  rollDiceELs("nonOp", optArr, ptArr);
}

//puts the possibilities for the decision cells on the screen
function setOptions(title, optArr, type) {
  var arr = ["", "nonOp", "op", "opA"];
  var id = arr[type];
  document.getElementById(id + "Title").innerHTML = title;
  for(var i = 0; i < 6; i++) {
    document.getElementById(id + (i + 1)).innerHTML = optArr[i];
  }
  displays([id], []);
}

//handles events that happen after the dice is rolled for decision cells
function rollDiceELs(type, optArr, ptArr) {
  var plyr = gameArea.players[gameArea.currentPlayer];
  document.getElementById(type + "RollBtn").addEventListener("click", function() {
    rollDice(type + "RollBtn", type + "OkBtn", type + "Img", type + "Result", optArr, ptArr, true, false);
    this.removeEventListener('click', arguments.callee);
  });
  document.getElementById(type + "OkBtn").addEventListener("click", function() {
    document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " pf";
    displays([type + "RollBtn"], [type, type + "OkBtn"]);
    document.getElementById(type + "Result").innerHTML = "";
    nextPlayer();
    console.log("NEXT");
    this.removeEventListener('click', arguments.callee);
  });
}

//gets number of points for a cell
function determinePoints(ptArr) {
  console.log("Points: " + ptArr[gameArea.roll - 1]);
  var points = ptArr[gameArea.roll - 1];
  return points;
}

function rollDice(rollBtn, okBtn, img, result, optArr, ptArr, decision, exam) {
  console.log("ROLLING");
  displays([], [rollBtn]);
  var i = 0;
  var rollingDice = setInterval(function() {
    setImg(i, img); //changes the dice image 50 times (makes it seem dice is rolling)
    if(i > 50) { //stop changing after 50 "rolls"
      clearInterval(rollingDice);
      displays([okBtn], []);
      if(decision) { //if this is the last screen of a decision, add the points
        gameArea.players[gameArea.currentPlayer].hp += determinePoints(ptArr);
        document.getElementById(result).innerHTML = optArr[gameArea.roll - 1];
      } else if(exam) { //if this is the last screen of an exam, go to exam result
        examResult();
      }
    }
    i++;
  }, 10);
}

//sets the image in the dice rolling
function setImg(i, img) {
  var rand = Math.floor((Math.random() * 6) + 1);
  document.getElementById(img).src = "dice" + rand + ".gif";
  if(i == 51) {
    gameArea.roll = rand;
  }
}

//goes to next player
function nextPlayer() {
  var plyrs = gameArea.players;
  var inPlay = false;
  var done = false;
  var count = 0;
  while(!inPlay && !done) { //loops thorugh players to find the next one that hasn't graduated
    gameArea.currentPlayer = (gameArea.currentPlayer < plyrs.length - 1) ? (gameArea.currentPlayer + 1) : 0;
    if(plyrs[gameArea.currentPlayer].position < 120) {
      inPlay = true;
    } else {
      count++;
      if(count == plyrs.length) { //if all players are done
        done = true;
      }
    }
  }

  if(done) { //all players are done
    var max = plyrs[0].hp;
    for(var i = 1; i < plyrs.length; i++) {
      if(plyrs[i].hp > max) {
        max = plyrs[i].hp;
      }
    }

    //displays the winner
    var tags = ["w1", "w2", "w3", "w4", "w5", "w6"];
    for(var i = 0; i < plyrs.length; i++) {
      if(plyrs[i].hp == max) {
        document.getElementById(tags[i]).innerHTML = "¡Jugador " + plyrs[i].color + " gana!";
      }
    }
    displays(["winners"], []);
    document.getElementById("playAgain").addEventListener("click", function() {
      for(var i = 0; i < 6; i++) {
        document.getElementById(tags[i]).innerHTML = "";
      }
      displays([], ["winners"]);
      location.reload();
      this.removeEventListener('click', arguments.callee);
    });
  } else { //not all players done
    onePlay();
  }
}


//darkens the image of the home icon when hovering over it
function hovIcon() {
  document.getElementById("homeIcon").src = "homeIconHov.png";
}

//undo the darkening when not hovering over the home icon
function unHovIcon() {
  document.getElementById("homeIcon").src = "homeIcon.png";
}
