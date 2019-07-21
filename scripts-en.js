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
    document.getElementById("Red").addEventListener("click", function() {
      chooseColors("Red", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Orange").addEventListener("click", function() {
      chooseColors("Orange", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Yellow").addEventListener("click", function() {
      chooseColors("Yellow", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Green").addEventListener("click", function() {
      chooseColors("Green", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Blue").addEventListener("click", function() {
      chooseColors("Blue", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Purple").addEventListener("click", function() {
      chooseColors("Purple", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("Black").addEventListener("click", function() {
      chooseColors("Black", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });

    document.getElementById("White").addEventListener("click", function() {
      chooseColors("White", count++, numPlayers);
      this.removeEventListener('click', arguments.callee);
    });
  }
}

function chooseColors(color, count, numPlayers) {
  gameArea.players[count] = new Player(color);
  displays([], [color]);
  if(count + 1 != numPlayers) { //still more ppl need to choose colors
    document.getElementById("colorTitle").innerHTML = "Player " + (count + 2) + ": Choose color";
  } else { //everyone has chosen colors
    document.getElementById("playerColor").style.display = "none";
    for(var i = 0; i < 2 * gameArea.players.length; i+=2) { //populates the scoreboard with players and scores
      document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
      document.getElementsByTagName("p")[i + 1].innerHTML = "Player " + gameArea.players[i/2].color + " score:";
      document.getElementsByTagName("div")[0].appendChild(document.createElement("p"));
      document.getElementsByTagName("p")[i + 2].innerHTML = "20 hp";
      document.getElementsByTagName("p")[i + 2].id = gameArea.players[i/2].color + "Score";
    }
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("div")[0].appendChild(document.createElement("br"));
    document.getElementsByTagName("div")[0].appendChild(document.createElement("p")); //element for weekend & break notification

    //resume button
    document.getElementsByTagName("div")[0].appendChild(document.createElement("button"));
    document.getElementsByTagName("button")[0].id = "resume";
    document.getElementById("resume").innerHTML = "Resume";
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
  document.getElementById("plyr").innerHTML = "Current player: <br>" + gameArea.players[gameArea.currentPlayer].color; //set current player
  document.getElementById("rollDiceTitle").innerHTML = "Player " + gameArea.players[gameArea.currentPlayer].color + ": Roll dice"; //title for dice roll

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
  gameArea.context.fillText("Start", height / 27, height / 1.04);
  gameArea.context.fillText("Finish", height / 27, height / 18);
  gameArea.context.fillText("Weekend", height / 0.91, height / 1.04);
  gameArea.context.fillText("Weekend", height / 0.821, height / 1.2);
  gameArea.context.fillText("Weekend", height / 55, height / 1.208);
  gameArea.context.fillText("Weekend", height / 1.165, height / 1.42);
  gameArea.context.fillText("Weekend", height / 0.686, height / 1.74);
  gameArea.context.fillText("Weekend", height / 2.65, height / 1.74);
  gameArea.context.fillText("Break", height / 2.54, height / 2.24);
  gameArea.context.fillText("Weekend", height / 0.59, height / 2.26);
  gameArea.context.fillText("Weekend", height / 2, height / 3.15);
  gameArea.context.fillText("Weekend", height / 2, height / 3.15);
  gameArea.context.fillText("Weekend", height / 1.355, height / 5.345);
  gameArea.context.fillText("Weekend", height / 0.747, height / 17);
}

//for cell borders
function drawLine(c, startX, startY, endX, endY) {
  c.beginPath();
  c.moveTo(startX, startY);
  c.lineTo(endX, endY);
  c.stroke();
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
    ctx.fillStyle = this.color;
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
            if(gameArea.cells[plyr.position - 1].text == "Weekend") { //if pass weekend, add 5 hp
              plyr.hp += 5;
              passGreen("Weekend, +5 hp");
            } else if(gameArea.cells[plyr.position - 1].text == "Summer Break") { //if pass break, add 10 hp
              plyr.hp += 10;
              passGreen("Summer Break, +10 hp");
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
  document.getElementById(gameArea.players[gameArea.currentPlayer].color + "Score").innerHTML = gameArea.players[gameArea.currentPlayer].hp + " hp";
  setTimeout(function() { //remove notification after 3 seconds
    document.getElementsByTagName("p")[2 * gameArea.players.length + 1].innerHTML = "";
  }, 3000);
}

//info for all the cells, [cell #, text, points], 99 if decision
var cellInfo = [
  [0, "Start", 0],
  [1, "Read <i>Walden</i>", -7],
  [2, "Make New Friends", 8],
  [3, "CS Diagnostic", 99],
  [4, "Bournedale", 8],
  [5, "Procrastinate", 99],
  [6, "Varsity Sports", 99],
  [7, "First Time using 3D Printer", 5],
  [8, "Rock & Balloon Lab", 99],
  [9, "Weekend", 5],
  [10, "Make a Website", 6],
  [11, "Go Apple Picking", 3],
  [12, "Math Test", 99],
  [13, "Solve Über Problem in One Try", 8],
  [14, "Get Caught Cursing", -4],
  [15, "Launch Ping Pong Ball with Statapult", 1],
  [16, "Late to Physics", -3],
  [17, "Forget to Save Work during HiMCM", -5],
  [18, "Gym with Coach Ketchum", 99],
  [19, "Weekend", 5],
  [20, "Pull Tablecloth from Table", 99],
  [21, "Free Food", 2],
  [22, "Fall Asleep in Class", 99],
  [23, "Make Crêpes with Mr. Regele", 2],
  [24, "Stay Up until 4:30 AM", -4],
  [25, "Procrastinate", 99],
  [26, "Caught Eating in Library", -3],
  [27, "Fight Mr. Regele's \"Smart\" Board", -1],
  [28, "Procrastinate on STEM I", -6],
  [29, "Weekend", 5],
  [30, "Fail ACSL", -5],
  [31, "Generate Quality Meme", 99],
  [32, "Get Extension for Spring Energy Lab", 8],
  [33, "Play the Piano", 3],
  [34, "Fail the Mandelbrot", -5],
  [35, "CS Test", 99],
  [36, "Fail Rotation Motion Test", -8],
  [37, "Weekend", 5],
  [38, "Create a Movie", 7],
  [39, "Study for SAT", -5],
  [40, "Create Assistive Technology for Disabled", 4],
  [41, "Win Slam Poetry Contest", 9],
  [42, "Mr. Ellis Makes a Pun", 4],
  [43, "Get Decent Grade on Hum Essay", 3],
  [44, "Speak English during Lang", 99],
  [45, "Android Studios Crashes Laptop", -9],
  [46, "Confused on Quantum Physics", -2],
  [47, "Weekend", 5],
  [48, "Get Roasted Presenting Math Problem", -3],
  [49, "Procrastinate", 99],
  [50, "Win Programming Competition", 7],
  [51, "Prove a Theorem in Math", 4],
  [52, "Go to ISEF", 10],
  [53, "Stuck on PCMI", -4],
  [54, "Get Lost Finding the ATC", -2],
  [55, "Read & Never Understand \"The Wasteland\"", -1],
  [56, "Weekend", 5],
  [57, "Physics Test", 99],
  [58, "Create Decent Conic Art", 4],
  [59, "Printer Runs Out of Ink", 99],
  [60, "App Breaks an Hour before Fair", -7],
  [61, "Mr. Brunner Leaves", -5],
  [62, "Learn about Space from Prof. Gatsonis", 5],
  [63, "Summer Break", 10],
  [64, "Get Parking Ticket", -7],
  [65, "Orientation Olympics", 99],
  [66, "Prove Fermat's Theorem", 8],
  [67, "Varsity Sports", 99],
  [68, "Forget to Sign In", -2],
  [69, "Procrastinate", 99],
  [70, "Lose Parking Pass", -5],
  [71, "Get Perfect SAT Score", 10],
  [72, "Food stuck in Vending Machine", -3],
  [73, "Exam", 99],
  [74, "Weekend", 5],
  [75, "Mr. Barney Defeats Skunk", 4],
  [76, "Become Friends with People from Other Sections", 7],
  [77, "Wake Up for 8 AM Class", -3],
  [78, "Annoy WPI Students by Playing Fish", -9],
  [79, "Drive to Class during Snowstorm", -4],
  [80, "Varsity Sports", 99],
  [81, "Get a 100 on an Exam", 7],
  [82, "Place first at Math Competition", 9],
  [83, "Mr. Ludt Checks College Essays", 3],
  [84, "Exam", 99],
  [85, "Weekend", 5],
  [86, "Be a Mathematician on Who Wants to be a Mathematician", 10],
  [87, "Procrastinate", 99],
  [88, "Perform at Café Night", 4],
  [89, "Assigned 300 Page Book to Read per Week", -4],
  [90, "Parking Garage Closes Unexpectedly", -7],
  [91, "Wake Up at 10 AM Every Day", 2],
  [92, "Late to Exam Because of Snow", 99],
  [93, "Get Free Cake", 1],
  [94, "Do Project at WPI until 12 AM", 99],
  [95, "Fail at Parallel Parking", -2],
  [96, "Weekend", 5],
  [97, "Get Accepted into College", 5],
  [98, "Place 1st in CyberPatriot", 9],
  [99, "Unexpectedly get an A in a Class", 8],
  [100, "Procrastinate", 99],
  [101, "Write College & Scholarship Essays", -3],
  [102, "Professor Scales Only Other Section's Exam", 99],
  [103, "Walk to WPI in 10­°F Weather", -3],
  [104, "Figure Out How to Pay for College", -5],
  [105, "Go Swimming in WPI's Pool", 6],
  [106, "Professor Loves Your Presentation", 7],
  [107, "Procrastinate", 99],
  [108, "Weekend", 5],
  [109, "No Class Wednesdays", 3],
  [110, "Professor Scales Exam", 99],
  [111, "Rejected from Dream College", -8],
  [112, "Professor Pushes Back Exam", 3],
  [113, "Procrastinate", 99],
  [114, "Form Study Group", 6],
  [115, "Forget ID: Locked Out of MAMS", -1],
  [116, "Run Program after Writing 1000 Lines of Code", 99],
  [117, "Get a Flat Tire", -6],
  [118, "Exam", 99],
  [119, "Graduate", 10]
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
    } else if(cellInfo[i][1].localeCompare("Weekend") == 0 || cellInfo[i][1].localeCompare("Summer Break") == 0) {
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
      document.getElementById("fortunePts").innerHTML = "You lose " + Math.abs(points) + " hp.";
    } else {
      document.getElementById("fortunePts").innerHTML = "You gain " + points + " hp.";
    }
    displays(["orangeCell"], []);
    document.getElementById("okFortuneBtn").addEventListener("click", function() {
      displays([], ["orangeCell"]);
      //add points if not a weekend or summer break space (bc those points already added elsewhere)
      if(gameArea.cells[cell].text != "Weekend" && gameArea.cells[cell].text != "Summer Break") {
        plyr.hp += points;
      }
      document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " hp";
      nextPlayer();
      console.log("NEXT");
      this.removeEventListener('click', arguments.callee);
    });
  } else { //blue
    console.log("LANDED ON BLUE");
    //Test/Exam
    if(gameArea.cells[cell].text == "Exam" || cell == 12 || cell == 35 || cell == 57) {
      var type;
      if(cell == 12) {
        type = "Math Test";
      } else if(cell == 35) {
        type = "CS Test";
      } else if(cell == 57) {
        type = "Physics Test";
      } else {
        type = "Exam";
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
        document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " hp";
        if(gameArea.roll > 4) {
          var points = 0;
          displays(["exam2Cell"], []);

          //third screen for exam
          if(!stayUp) { //not first time running code (so that event listener isn't created again)
            stayUp = true;
            document.getElementById("stayUp").addEventListener("click", function() {
              displays([], ["exam2Cell"]);
              noDecision(type + " - Stay Up All Night",
                        ["1 - Good score, +4 hp",
                        "2 - Good score, +4 hp",
                        "3 - Good score, +4 hp",
                        "4 - Bad score, -5 hp",
                        "5 - Bad score, -5 hp",
                        "6 - Bad score, -5 hp"],
                        [4, 4, 4, -5, -5, -5]
              );
            });
          }
          if(!hopeBest) { //not first time running code (so that event listener isn't created again)
            hopeBest = true;
            document.getElementById("hopeForBest").addEventListener("click", function() {
              displays([], ["exam2Cell"]);
              noDecision(type + " - Hope for the Best",
                        ["1 - Good score, +10 hp",
                        "2 - Good score, +10 hp",
                        "3 - Good score, +10 hp",
                        "4 - Bad score, -10 hp",
                        "5 - Bad score, -10 hp",
                        "6 - Bad score, -10 hp"],
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

    } else if(gameArea.cells[cell].text == "Procrastinate") { //Procrastinate
      decision("Procrastinate",
              ["1 - Complete the assignment with time to spare, +0 hp",
              "2 - Complete the assignment with time to spare, +0 hp",
              "3 - Barely finish assignment, +2 hp",
              "4 - Get an extension, +4 hp",
              "5 - Complete assignment late, -2 hp",
              "6 - Realize there's more than originally thought, turn in incomplete, -6 hp"],
              [0, 0, 2, 4, -2, -6]
      );
    } else if(gameArea.cells[cell].text == "Varsity Sports") { //Sports
      decision("Play Varsity Sports",
              ["1 - Still do well at school, +6 hp",
              "2 - Do okay at school, +3 hp",
              "3 - Do okay at school, +3 hp",
              "4 - Get stressed about school, -3 hp",
              "5 - Get stressed about school, -3 hp",
              "6 - Do terribly at school, -6 hp"],
              [6, 3, 3, -3, -3, -6]
      );
    } else if(cell == 3) { //CS Diagnostic
      noDecision("CS Diagnostic",
                ["1 - Did awesome on it, +3 hp",
                "2 - Did okay on it, +0 hp",
                "3 - Did okay on it, +0 hp",
                "4 - Understood nothing, -5 hp",
                "5 - Understood nothing, -5 hp",
                "6 - Understood nothing, -5 hp"],
                [3, 0, 0, -5, -5, -5]
      );
    } else if(cell == 8) { //Rock & Balloon
      noDecision("Rock & Balloon Lab",
                ["1 - Correctly format in 1 try, +6 hp",
                "2 - Correctly format in 2 tries, +3 hp",
                "3 - Correctly format in 3 tries, +1 hp",
                "4 - Correctly format in 4 tries, -1 hp",
                "5 - Correctly format in 5 tries, -3 hp",
                "6 - Correctly format in 6 or more tries, -6 hp"],
                [6, 3, 1, -1, -3, -6]
      );
    } else if(cell == 18) { //Gym w Ketchum
      noDecision("Gym with Coach Ketchum",
                ["1 - Really good at sports, +5 hp",
                "2 - Okay at sports, +2 hp",
                "3 - Okay at sports, +2 hp",
                "4 - Okay at sports, +2 hp",
                "5 - Terrible at sports, -1 hp",
                "6 - Terrible at sports, -1 hp"],
                [5, 2, 2, 2, -1, -1]
      );
    } else if(cell == 20) { //pull tablecloth
      decision("Pull Tablecloth from Table",
              ["1 - Nothing moves at all, +6 hp",
              "2 - A few things move, +3 hp",
              "3 - A few things move, +3 hp",
              "4 - A few things move, +3 hp",
              "5 - Spoon hits your face, -5 hp",
              "6 - Knife hits your face, -10 hp"],
              [6, 3, 3, 3, -5, -10]
      );
    } else if(cell == 22) { //fall asleep in class
      noDecision("Fall Asleep in Class",
                ["1 - Not caught, +1 hp",
                "2 - Not caught, +1 hp",
                "3 - Not caught, +1 hp",
                "4 - Caught, -3 hp",
                "5 - Caught, -3 hp",
                "6 - Caught, -3 hp"],
                [1, 1, 1, -3, -3, -3]
      );
    } else if(cell == 31) { //generate quality meme
      noDecision("Generate Quality Meme",
                ["1 - Ok meme, +1 hp",
                "2 - Good meme, +2 hp",
                "3 - Great meme, +3 hp",
                "4 - Excellent meme, +4 hp",
                "5 - Spicy meme, +5 hp",
                "6 - Pure gold, +6 hp"],
                [1, 2, 3, 4, 5, 6]
      );
    } else if(cell == 44) { //speak eng during Lang
      noDecision("Speak English during Lang",
                ["1 - Not caught, +0 hp",
                "2 - Not caught, +0 hp",
                "3 - Not caught, +0 hp",
                "4 - Caught, -3 hp",
                "5 - Caught, -3 hp",
                "6 - Caught, -3 hp"],
                [0, 0, 0, -3, -3, -3]
      );
    } else if(cell == 59) { //printer runs out of ink
      noDecision("Printer Runs Out of Ink",
                ["1 - Don't even need it now, +0 hp",
                "2 - Don't even need it now, +0 hp",
                "3 - Need to print but not urgent, -1 hp",
                "4 - Need to print but not urgent, -1 hp",
                "5 - Hum essay due in 2 minutes, -4 hp",
                "6 - Lang vocab journal due in 1 minute, -4 hp"],
                [0, 0, -1, -1, -4, -4]
      );
    } else if(cell == 65) { //orientation Olympics
      noDecision("Orientation Olympics",
                ["1 - Section wins most events, +10 hp",
                "2 - Section wins some events, +5 hp",
                "3 - Section wins some events, +5 hp",
                "4 - Section wins a few events, +2 hp",
                "5 - Section wins a few events, +2 hp",
                "6 - Section wins no events, -1 hp"],
                [10, 5, 5, 2, 2, -1]
      );
    } else if(cell == 92) { //late to exam bc of snowstorm
      noDecision("Late to Exam Because of Snowstorm",
                ["1 - Still did really well, +6 hp",
                "2 - Still did really well, +6 hp",
                "3 - Did okay, +3 hp",
                "4 - Did okay, +3 hp",
                "5 - Did terribly, -7 hp",
                "6 - Did terribly, -7 hp"],
                [6, 6, 3, 3, -7, -7]
      );
    } else if(cell == 94) { //do proj @ wpi until 12
      noDecision("Do Project at WPI until 12 AM",
                ["1 - Not doing it in Foisie, -3 hp",
                "2 - Not doing it in Foisie, -3 hp",
                "3 - Not doing it in Foisie, -3 hp",
                "4 - Foisie closes & gets kicked out, -6 hp",
                "5 - Foisie closes & gets kicked out, -6 hp",
                "6 - Foisie closes & gets kicked out, -6 hp"],
                [-3, -3, -3, -6, -6, -6]
      );
    } else if(cell == 102) { //prof only scale other section
      noDecision("Professor Scales Only Other Section's Exam",
                ["1 - Did well so don't care, +0 hp",
                "2 - Did well so don't care, +0 hp",
                "3 - Did well so don't care, +0 hp",
                "4 - Did badly & want scale, -5 hp",
                "5 - Did badly & want scale, -5 hp",
                "6 - Did super badly & really need scale, -9 hp"],
                [0, 0, 0, -5, -5, -9]
      );
    } else if(cell == 110) { //prof scales Exam
      noDecision("Professor Scales Exam",
                ["1 - Gained 2 points, +1 hp",
                "2 - Gained 2 points, +1 hp",
                "3 - Gained 5 points, +3 hp",
                "4 - Gained 5 points, +3 hp",
                "5 - Gained 8 points, +5 hp",
                "6 - Gained 23 points, +10 hp"],
                [1, 1, 3, 3, 5, 10]
      );
    } else if(cell == 116) { //run prog aft writing 100 lines
      decision("Test Program after Writing 1000 Lines of Code",
              ["1 - It works perfectly, +30 hp",
              "2 - Runs but behavior is incorrect, +3 hp",
              "3 - Errors take 30 minutes to fix, -3 hp",
              "4 - Errors take 2 hours to fix, -7 hp",
              "5 - Errors take 2 hours to fix, -7 hp",
              "6 - Errors take 2 hours to fix, -7 hp"],
              [30, 3, -3, -7, -7, -7]
      );
    }
  }
}

function examResult() { //first screen of exam
  var arr = [["You did better than you thought, gain +7 hp.",
            "You get an ok score, gain +3 hp.",
            "You get an ok score, gain +3 hp.",
            "You get a terrible score, lose -7 hp.",
            "You procrastinate. Continue to next screen.",
            "You procrastinate. Continue to next screen."],
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
    document.getElementById("opResult").innerHTML = "You chose not to " + title.toLowerCase() + " , +0 hp";
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
    document.getElementById(plyr.color + "Score").innerHTML = plyr.hp + " hp";
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
        document.getElementById(tags[i]).innerHTML = "Player " + plyrs[i].color + " wins!";
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
