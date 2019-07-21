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
    document.getElementById("Rouge").addEventListener("click", function() {
      chooseColors("Rouge", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Orange").addEventListener("click", function() {
      chooseColors("Orange", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Jaune").addEventListener("click", function() {
      chooseColors("Jaune", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Vert").addEventListener("click", function() {
      chooseColors("Vert", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Bleu").addEventListener("click", function() {
      chooseColors("Bleu", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Violet").addEventListener("click", function() {
      chooseColors("Violet", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Noir").addEventListener("click", function() {
      chooseColors("Noir", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Blanc").addEventListener("click", function() {
      chooseColors("Blanc", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });
  }
}

function chooseColors(color, count, numPlayers) {
  gameArea.players[count] = new Player(color);
  displays([], [color]);
  if(count + 1 != numPlayers) { //still more ppl need to choose colors
    document.getElementById("colorTitle").innerHTML = "Joueur " + (count + 2) + ": Choisissez une couleur";
  } else { //everyone has chosen colors
    document.getElementById("playerColor").style.display = "none";
    for(var i = 0; i < 2 * gameArea.players.length; i+=2) { //populates the scoreboard with players and scores
      document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
      document.getElementsByTagName("p")[i + 1].innerHTML = "Joueur " + gameArea.players[i/2].color + " score:";
      document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
      document.getElementsByTagName("p")[i + 2].innerHTML = "20 pb";
      document.getElementsByTagName("p")[i + 2].id = gameArea.players[i/2].color + "Score";
    }
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("div")[0].appendChild(document.createElement("p")); //element for weekend & break notification

    //resume button
    document.getElementsByTagName("div")[0].appendChild(document.createElement("button"));
    document.getElementsByTagName("button")[0].id = "resume";
    document.getElementById("resume").innerHTML = "Résume";
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
  document.getElementById("plyr").innerHTML = "Joueur actuel: <br>" + gameArea.players[gameArea.currentPlayer].color; //set current player
  document.getElementById("rollDiceTitle").innerHTML = "Joueur " + gameArea.players[gameArea.currentPlayer].color + ": Lance les Dés"; //title for dice roll

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
  gameArea.context.fillText("Début", height / 35, height / 1.04);
  gameArea.context.fillText("Fin", height / 23, height / 18);
  gameArea.context.fillText("Fin de", height / 0.91, height / 1.045);
  gameArea.context.fillText("Semaine", height / 0.91, height / 1.02);
  gameArea.context.fillText("Fin de", height / 0.821, height / 1.21);
  gameArea.context.fillText("Semaine", height / 0.821, height / 1.18);
  gameArea.context.fillText("Fin de", height / 55, height / 1.21);
  gameArea.context.fillText("Semaine", height / 55, height / 1.18);
  gameArea.context.fillText("Fin de", height / 1.165, height / 1.445);
  gameArea.context.fillText("Semaine", height / 1.165, height / 1.4);
  gameArea.context.fillText("Fin de", height / 0.686, height / 1.77);
  gameArea.context.fillText("Semaine", height / 0.686, height / 1.71);
  gameArea.context.fillText("Fin de", height / 2.65, height / 1.77);
  gameArea.context.fillText("Semaine", height / 2.65, height / 1.71);
  gameArea.context.fillText("Vacances", height / 2.7, height / 2.24);
  gameArea.context.fillText("Fin de", height / 0.59, height / 2.3);
  gameArea.context.fillText("Semaine", height / 0.59, height / 2.2);
  gameArea.context.fillText("Fin de", height / 2, height / 3.2);
  gameArea.context.fillText("Semaine", height / 2, height / 3);
  gameArea.context.fillText("Fin de", height / 1.355, height / 5.5);
  gameArea.context.fillText("Semaine", height / 1.355, height / 5);
  gameArea.context.fillText("Fin de", height / 0.747, height / 20);
  gameArea.context.fillText("Semaine", height / 0.747, height / 14);
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
    case "Rouge":
      colorEN = "red";
      break;
    case "Orange":
      colorEN = "orange";
      break;
    case "Jaune":
      colorEN = "yellow";
      break;
    case "Vert":
      colorEN = "green";
      break;
    case "Bleu":
      colorEN = "blue";
      break;
    case "Violet":
      colorEN = "purple";
      break;
    case "Noir":
      colorEN = "black";
      break;
    case "Blanc":
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
            if(gameArea.cells[plyr.position - 1].text == "Fin de Semaine") { //if pass weekend, add 5 hp
              plyr.hp += 5;
              passGreen("Fin de Semaine, +5 pb");
            } else if(gameArea.cells[plyr.position - 1].text == "Vacances d'Été") { //if pass break, add 10 hp
              plyr.hp += 10;
              passGreen("Vacances d'Été, +10 pb");
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
  document.getElementById(gameArea.players[gameArea.currentPlayer].color + "Score").innerHTML = gameArea.players[gameArea.currentPlayer].hp + " pb";
  setTimeout(function() { //remove notification after 3 seconds
    document.getElementsByTagName("p")[2 * gameArea.players.length + 1].innerHTML = "";
  }, 3000);
}

//info for all the cells, [cell #, text, points], 99 if decision
var cellInfo = [
  [0, "Commencer!", 0],
  [1, "Vous Lisez <i>Walden</i>", -7],
  [2, "Vous Faites des Nouveaux Amis", 8],
  [3, "Vous Prenez le CS Diagnostique", 99],
  [4, "Bournedale", 8],
  [5, "Vous Procrastinez", 99],
  [6, "Vous Participez Dans un Sport Universitaire", 99],
  [7, "Vous Utilisez les Imprimantes 3D pour la Première Fois", 5],
  [8, "Vous Devez Compléter le Laboratoire de Roche et Ballon", 99],
  [9, "Fin de Semaine", 5],
  [10, "Vous Créez un Site Web", 6],
  [11, "Vous Cueillez des Pommes", 3],
  [12, "Vous Prenez un Examen de Mathématiques", 99],
  [13, "Vous Résolvez un Problème Über en un Essai", 8],
  [14, "Vous vous Faites Prendre pour Maudire", -4],
  [15, "Vous Lancez une Balle de Ping-Pong avec le Statapult", 1],
  [16, "Vous êtes en Retard pour la Classe de Physique", -3],
  [17, "Vous Oubliez de Sauvegarder le Travaille durant HiMCM", -5],
  [18, "Vous avez L'éducation Physique avec Entraîneur Ketchum", 99],
  [19, "Fin de Semaine", 5],
  [20, "Vous Tiez une Nappe de Table", 99],
  [21, "Vous Trouvez de la Nourriture Gratuite", 2],
  [22, "Vous Vous Endormez en Classe", 99],
  [23, "Vous Faites des Crêpes avec M. Regele", 2],
  [24, "Vous Restez Debout jusqu'à 4:30 du Matin", -4],
  [25, "Vous Procrastinez", 99],
  [26, "Vous vous Faites Prendre Manger dans la Bibliothèque", -3],
  [27, "Vous vous Bataillez contre le Tableau \"Intelligent\" de M. Regele", -1],
  [28, "Vous Procrastinez pendant STEM I", -6],
  [29, "Fin de Semaine", 5],
  [30, "Vous avez Échouer ACSL", -5],
  [31, "Vous Produisez des Memes de Qualités", 99],
  [32, "Vous Recevez une Extension pour le Laboratoire de Ressort Énergie", 8],
  [33, "Vous Jouez le Piano", 3],
  [34, "Vous Échouez le Mandelbrot", -5],
  [35, "Vous Prenez l'Examen de CS", 99],
  [36, "Vous échouez l'Exament de Mouvement Rotatif", -8],
  [37, "Fin de Semaine", 5],
  [38, "Vous Créez un Film", 7],
  [39, "Vous Étudiez pour le SAT", -5],
  [40, "Vous Créez la Technologie d'Assistance pour les Handicapés", 4],
  [41, "Vous Gagnez le Concour de Poésie Slam", 9],
  [42, "M. Ellis Fait un Jeu de Mots", 4],
  [43, "Vous Obtenez une Note Décent sur un Papier de Hum", 3],
  [44, "Vous Parlez l'Anglais durant Lang", 99],
  [45, "Android Studio Plante votre Ordinateur Portable", -9],
  [46, "Vous êtes Confu sur la Physique Quantique", -2],
  [47, "Fin de Semaine", 5],
  [48, "Vous êtes Rôti durant une Présentation de Mathématique", -3],
  [49, "Vous Procrastinez", 99],
  [50, "Vous avez Gagné une Compétition de Programme", 7],
  [51, "Vous Provez un Théorème dans la Classe de Mathématique", 4],
  [52, "Vous Allez à ISEF", 10],
  [53, "Vous êtes Coincé sur PCMI", -4],
  [54, "Vous vous Perdez durant la Cherche pour le ATC", -2],
  [55, "Vous Lisez et ne Comprenez pas \"La Terre des Déchêts\"", -1],
  [56, "Fin de Semaine", 5],
  [57, "Vous Prenez l'Examen de Physique", 99],
  [58, "Vous Créez un Art Conique Décent", 4],
  [59, "Les Imprimantes sont à court d'encre", 99],
  [60, "Votre Application Tombe en Panner Une Heur avant la Foire", -7],
  [61, "M. Brunner Quitte MAMS", -5],
  [62, "Vous apprenez sur l'Espace avec Professeur Gatsonis", 5],
  [63, "Vacances d'Été", 10],
  [64, "Vous Recevez une Contravention", -7],
  [65, "Orientation Olympiques", 99],
  [66, "Vous Prouvez le Théorème de Fermat", 8],
  [67, "Vous Participez Dans un Sport Universitaire", 99],
  [68, "Vous Oubliez d'Enregister durant le Matin", -2],
  [69, "Vous Procrastinez", 99],
  [70, "Vous Perdez votre Laissez-Passer de Stationnement", -5],
  [71, "Vous avez Reçu une Note de SAT Prafaite", 10],
  [72, "Votre Nourriture est Coincée dans le Distributeur Automatique", -3],
  [73, "Examen", 99],
  [74, "Fin de Semaine", 5],
  [75, "M. Barney a Convaincu la Moufette", 4],
  [76, "Vous Devenez Ami avec des Étudiants des Autres Sections", 7],
  [77, "Vous vous Levez pour une Classe à 8 Heure du Matin", -3],
  [78, "Vous Êmbêtez les Étudiants de WPI en Jouant Fish", -9],
  [79, "Vous Conduisez à l’École durant une Tempête", -4],
  [80, "Vous Participez Dans un Sport Universitaire", 99],
  [81, "Vous Recevez un 100 sur un Examen", 7],
  [82, "Vous Placez en premier dans un Compétition de Mathématiques", 9],
  [83, "M. Ludt Vérifie votre Papier pour les Universités", 3],
  [84, "Examen", 99],
  [85, "Fin de Semaine", 5],
  [86, "Vous êtes un Mathématicien sur Qui Veut Devenir un Mathématicien", 10],
  [87, "Vous Procrastinez", 99],
  [88, "Vous Jouez durant Café Night", 4],
  [89, "Votre Professeur vous Done 300 Pages à Lire Chaque Semaine", -4],
  [90, "Le Garage de Parking Ferme Tout à Coup", -7],
  [91, "Vous vous Levez à 10 Heur du Matin Chaque Jour", 2],
  [92, "Vous êtes en Retard pour un Examen à cause de la Neige", 99],
  [93, "Vous Recevez du Gateau Gratuit", 1],
  [94, "Vous Terminez un Projet à WPI jusqu'à Minuit", 99],
  [95, "Vous Échouez le Stationnement Parallèle", -2],
  [96, "Fin de Semaine", 5],
  [97, "Vous êtes Accepté dans une Université", 5],
  [98, "Vous Gagnez le Premier Prix pour Cyberpatriot", 9],
  [99, "Vous Obtenez un A Imprévu dans une Classe", 8],
  [100, "Vous Procrastinez", 99],
  [101, "Vous Écrivez les Papier pour les Universités et Bourses d'Études", -3],
  [102, "Professeur Échelle seulement les Examens de l'Autre Classe", 99],
  [103, "Vous Marchez à WPI quand il fait 10°F Dehors", -3],
  [104, "Vous Assayez d'Arriver à Comprendre Comment Payer pour l'Université", -5],
  [105, "Vous Nagez dans la Piscine de WPI", 6],
  [106, "Le Professeur Aime votre Présentation", 7],
  [107, "Vous Procrastinez", 99],
  [108, "Fin de Semaine", 5],
  [109, "Vous avez aucune Classe Mercredi", 3],
  [110, "Le Professeur Échelle l'Examen", 99],
  [111, "Vous êtes Rejeté par l'Université de votre Rêve", -8],
  [112, "Le Professeur Pousse l'Examen en Arrière", 3],
  [113, "Vous Procrastinez", 99],
  [114, "Vous Formez des Groupes d'Étude", 6],
  [115, "Vous Perdez votre ID: Vous êtes Enfermé Endehors de MAMS", -1],
  [116, "Vous Éxecutez le Programme après avoir Ércit 1000 Lignes de Code", 99],
  [117, "Votre Voiture a un Pneu Crvé", -6],
  [118, "Examen", 99],
  [119, "Vous Recevez votre Dîplome", 10]
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
    } else if(cellInfo[i][1].localeCompare("Fin de Semaine") == 0 || cellInfo[i][1].localeCompare("Vacances d'Été") == 0) {
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
      document.getElementById("fortunePts").innerHTML = "Vous perdez " + Math.abs(points) + " pb.";
    } else {
      document.getElementById("fortunePts").innerHTML = "Vous gagnez " + points + " pb.";
    }
    displays(["orangeCell"], []);
    document.getElementById("okFortuneBtn").addEventListener("click", function() {
      displays([], ["orangeCell"]);
      //add points if not a weekend or summer break space (bc those points already added elsewhere)
      if(gameArea.cells[cell].text != "Fin de Semaine" && gameArea.cells[cell].text != "Vacances d'Été") {
        plyr.hp += points;
      }
      document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " pb";
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
        type = "Examen de Mathématiques";
      } else if(cell == 35) {
        type = "Examen de CS";
      } else if(cell == 57) {
        type = "Examen de Physique";
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
        document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " pb";
        if(gameArea.roll > 4) {
          var points = 0;
          displays(["exam2Cell"], []);

          //third screen for exam
          if(!stayUp) { //not first time running code (so that event listener isn't created again)
            stayUp = true;
            document.getElementById("stayUp").addEventListener("click", function() {
              displays([], ["exam2Cell"]);
              noDecision(type + " - Rester Éveiller Toute la Nuit",
                        ["1 - Bon score, +4 pb",
                        "2 - Bon score, +4 pb",
                        "3 - Bon score, +4 pb",
                        "4 - Mauvaise score, -5 pb",
                        "5 - Mauvaise score, -5 pb",
                        "6 - Mauvaise score, -5 pb"],
                        [4, 4, 4, -5, -5, -5]
              );
            });
          }
          if(!hopeBest) { //not first time running code (so that event listener isn't created again)
            hopeBest = true;
            document.getElementById("hopeForBest").addEventListener("click", function() {
              displays([], ["exam2Cell"]);
              noDecision(type + " - Espèrer la Meilleure",
                        ["1 - Bon score, +10 pb",
                        "2 - Bon score, +10 pb",
                        "3 - Bon score, +10 pb",
                        "4 - Mauvaise score, -10 pb",
                        "5 - Mauvaise score, -10 pb",
                        "6 - Mauvaise score, -10 pb"],
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

    } else if(gameArea.cells[cell].text == "Vous Procrastinez") { //Procrastinate
      decision("Vous Procrastinez",
              ["1 - Vous terminez le travail avec du temps qui reste, +0 pb",
              "2 - Vous terminez le travail avec du temps qui reste, +0 pb",
              "3 - Vous avez à peine terminer le travail, +2 pb",
              "4 - Vous obtenez une extension, +4 pb",
              "5 - Vous terminez le travail en retard, -2 pb",
              "6 - Vous vous êtes rendu compte qu' il y a encore beaucoup plus de travail, vous rendez le travail incomplet, -6 pb"],
              [0, 0, 2, 4, -2, -6]
      );
    } else if(gameArea.cells[cell].text == "Vous Participez Dans un Sport Universitaire") { //Sports
      decision("Vous Participez Dans un Sport Universitaire",
              ["1 - Vous êtes excellent à l'école, +6 pb",
              "2 - Vous êtes moyen à l'école, +3 pb",
              "3 - Vous êtes moyen à l'école, +3 pb",
              "4 - Vous êtes stressé à propos de l'école, -3 pb",
              "5 - Vous êtes stressé à propos de l'école, -3 pb",
              "6 - Vous êtes terribls à l'école, -6 pb"],
              [6, 3, 3, -3, -3, -6]
      );
    } else if(cell == 3) { //CS Diagnostic
      noDecision("Vous Prenez le CS Diagnostique",
                ["1 - Vous avez reçu une note impressionnante, +3 pb",
                "2 - Vous avez reçu une note moyenne, +0 pb",
                "3 - Vous avez reçu une note moyenne, +0 pb",
                "4 - Vous avez rien compris, -5 pb",
                "5 - Vous avez rien compris, -5 pb",
                "6 - Vous avez rien compris, -5 pb"],
                [3, 0, 0, -5, -5, -5]
      );
    } else if(cell == 8) { //Rock & Balloon
      noDecision("Vous devez Compléter le Laboratoire de Roche et Ballon",
                ["1 - Vous avez formater correctement la première fois, +6 pb",
                "2 - Vous avez formater correctement la deuxième fois, +3 pb",
                "3 - Vous avez formater correctement la troisième fois, +1 pb",
                "4 - Vous avez formater correctement la quatrième fois, -1 pb",
                "5 - Vous avez formater correctement la cinquième fois, -3 pb",
                "6 - Vous avez formater correctement après 6 fois ou plus, -6 pb"],
                [6, 3, 1, -1, -3, -6]
      );
    } else if(cell == 18) { //Gym w Ketchum
      noDecision("Vous avez l'Éducation Physique avec Entraîneur Ketchum",
                ["1 - Vous êtes excellent en sport, +5 pb",
                "2 - Vous êtes normal en sport, +2 pb",
                "3 - Vous êtes normal en sport, +2 pb",
                "4 - Vous êtes normal en sport, +2 pb",
                "5 - Vous êtes terrible en sport, -1 pb",
                "6 - Vous êtes terrible en sport, -1 pb"],
                [5, 2, 2, 2, -1, -1]
      );
    } else if(cell == 20) { //pull tablecloth
      decision("Vous Tiez une Nappe de Table",
              ["1 - Il y a absolutement rien qui bouge, +6 pb",
              "2 - Certaines choses bougent, +3 pb",
              "3 - Certaines choses bougent, +3 pb",
              "4 - Certaines choses bougent, +3 pb",
              "5 - La cuillère frappe ta face, -5 pb",
              "6 - Le couteau frappe ta face, -10 pb"],
              [6, 3, 3, 3, -5, -10]
      );
    } else if(cell == 22) { //fall asleep in class
      noDecision("Vous vous Endormez en Classe",
                ["1 - Vous vous n'êtes pas fait prendre, +1 pb",
                "2 - Vous vous n'êtes pas fait prendre, +1 pb",
                "3 - Vous vous n'êtes pas fait prendre, +1 pb",
                "4 - Vous vous êtes fait prendre, -3 pb",
                "5 - Vous vous êtes fait prendre, -3 pb",
                "6 - Vous vous êtes fait prendre, -3 pb"],
                [1, 1, 1, -3, -3, -3]
      );
    } else if(cell == 31) { //generate quality meme
      noDecision("Vous Produisez des Memes de Qualités",
                ["1 - Meme moyenne, +1 pb",
                "2 - Bon meme, +2 pb",
                "3 - Meme génial, +3 pb",
                "4 - Meme excellent, +4 pb",
                "5 - Meme épicé, +5 pb",
                "6 - Or pur, +6 pb"],
                [1, 2, 3, 4, 5, 6]
      );
    } else if(cell == 44) { //speak eng during Lang
      noDecision("Vous Parlez l’Anglais durant Lang",
                ["1 - Vous vous n'êtes pas fait prendre, +0 pb",
                "2 - Vous vous n'êtes pas fait prendre, +0 pb",
                "3 - Vous vous n'êtes pas fait prendre, +0 pb",
                "4 - Vous vous êtes fait prendre, -3 pb",
                "5 - Vous vous êtes fait prendre, -3 pb",
                "6 - Vous vous êtes fait prendre, -3 pb"],
                [0, 0, 0, -3, -3, -3]
      );
    } else if(cell == 59) { //printer runs out of ink
      noDecision("Les Imprimantes sont à Court d’Encre",
                ["1 - Vous en avez pas besoin, +0 pb",
                "2 - Vous en avez pas besoin, +0 pb",
                "3 - Vous en avez besoin, mais c'est pas urgent, -1 pb",
                "4 - Vous en avez besoin, mais c'est pas urgent, -1 pb",
                "5 - Hum papier est dû en 2 minutes, -4 pb",
                "6 - Journal de vocabulaire de Lang est dû dans 1 minute, -4 pb"],
                [0, 0, -1, -1, -4, -4]
      );
    } else if(cell == 65) { //orientation Olympics
      noDecision("Orientation Olympiques",
                ["1 - Votre section gagne la majorité des événements, +10 pb",
                "2 - Votre section gagne quelques événements, +5 pb",
                "3 - Votre section gagne quelques événements, +5 pb",
                "4 - Votre section gagne peu événements, +2 pb",
                "5 - Votre section gagne peu événements, +2 pb",
                "6 - Vote section gagne aucun événements, -1 pb"],
                [10, 5, 5, 2, 2, -1]
      );
    } else if(cell == 92) { //late to exam bc of snowstorm
      noDecision("Vous êtes en Retard pour un Examen à cause de la Neige",
                ["1 - Vous avez obtenu une note excellente, +6 pb",
                "2 - Vous avez obtenu une note excellente, +6 pb",
                "3 - Vous avez obtenu une note moyenne, +3 pb",
                "4 - Vous avez obtenu une note moyenne, +3 pb",
                "5 - Vous avez obtenu une note terrible, -7 pb",
                "6 - Vous avez obtenu une note terrible, -7 pb"],
                [6, 6, 3, 3, -7, -7]
      );
    } else if(cell == 94) { //do proj @ wpi until 12
      noDecision("Vous Terminez un Projet à WPI jusqu’à Minuit",
                ["1 - Vous ne travaillez pas dans Foisie, -3 pb",
                "2 - Vous ne travaillez pas dans Foisie, -3 pb",
                "3 - Vous ne travaillez pas dans Foisie, -3 pb",
                "4 - Foisie est fermé et vous êtes jeté dehors, -6 pb",
                "5 - Foisie est fermé et vous êtes jeté dehors, -6 pb",
                "6 - Foisie est fermé et vous êtes jeté dehors, -6 pb"],
                [-3, -3, -3, -6, -6, -6]
      );
    } else if(cell == 102) { //prof only scale other section
      noDecision("Professeur Échelle Seulement les Examens de l’Autre Classe",
                ["1 - Vous avez bien completer l'examen alors vous vous en fiche, +0 pb",
                "2 - Vous avez bien completer l'examen alors vous vous en fiche, +0 pb",
                "3 - Vous avez bien completer l'examen alors vous vous en fiche, +0 pb",
                "4 - Vous avez completer l'examen pauvrement et vous voulez une échelle, -5 pb",
                "5 - Vous avez completer l'examen pauvrement et vous voulez une échelle, -5 pb",
                "6 - Vous avez échouer gravement et vous avez vraiment besoin d'une échelle, -9 pb"],
                [0, 0, 0, -5, -5, -9]
      );
    } else if(cell == 110) { //prof scales Exam
      noDecision("Le Professeur Échelle l’Examen",
                ["1 - Vous avez gagné 2 points, +1 pb",
                "2 - Vous avez gagné 2 points, +1 pb",
                "3 - Vous avez gagné 5 points, +3 pb",
                "4 - Vous avez gagné 5 points, +3 pb",
                "5 - Vous avez gagné 8 points, +5 pb",
                "6 - Vous avez gagné 23 points, +10 pb"],
                [1, 1, 3, 3, 5, 10]
      );
    } else if(cell == 116) { //run prog aft writing 100 lines
      decision("Vous Éxecutez le Programme après avoir Ércit 1000 Lignes de Code",
              ["1 - Ça fonctionne parfaitement, +30 pb",
              "2 - Ça fonctionne, mais le comportement est incorrect, +3 pb",
              "3 - Les erreurs prennent 30 minutes pour répaper, -3 pb",
              "4 - Les erreurs prennent 2 heurs pour réparer, -7 pb",
              "5 - Les erreurs prennent 2 heurs pour réparer, -7 pb",
              "6 - Les erreurs prennent 2 heurs pour réparer, -7 pb"],
              [30, 3, -3, -7, -7, -7]
      );
    }
  }
}

function examResult() { //first screen of exam
  var arr = [["Vous avez fair mieux que vous ne le pensez, +7 pb.",
            "Vous avez reçu une note moyenne, +3 pb.",
            "Vous avez reçu une note moyenne, +3 pb.",
            "Vous avez reçu une note terrible, -7 pb.",
            "Vous procrastinez. Continuez à la prochaine page.",
            "Vous procrastinez. Continuez à la prochaine page."],
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
    document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " pb";
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
        document.getElementById(tags[i]).innerHTML = "Joueuer " + plyrs[i].color + " gagne!";
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
