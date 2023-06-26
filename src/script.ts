const canvas: HTMLCanvasElement = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const pointsElement = document.querySelector("#points");
let points = 0;

const levelElement = document.querySelector("#level");
let level = 0;
let showWalls = true;

const movesElements = document.querySelector("#moves");
let moves = 0;


const screen = 350;
const side = screen / 7;

interface Tile {
	x: number;
  y: number;
  color: "yellow" | "red" | "green";
  type?: "ball" | "tile";
}

const ball = {
	x: 1,
  y: 1,
  color: "red",
  type: "ball"
};

const board: Tile[][] = [];

const init = () => {
	canvas.height = screen;
  canvas.width = canvas.height;
  
  ball.x = 1;
  ball.y = 1;
  loadNextLevel();
  
  redraw();
}

const reset = () => {
	ctx.fillStyle = "#2c3e50";
	ctx.fillRect(0, 0, screen, screen);
}

const offset = (coord: number, offset: number) => {
	return (coord - offset) * side;
}

const draw = (tile: Tile) => {

	ctx.fillStyle = {
  	yellow: "#f1c40f",
    green: "#16a085",
    red: "#e74c3c"
  }[tile.color];
  
  if (tile.type === "ball") {
  	ctx.beginPath();
    ctx.arc(offset(tile.x, .5), offset(tile.y, .5), side / 3, -Math.PI, Math.PI);
    ctx.fill();
  
  } else {
  	if(tile.color === "red" && !showWalls) return;
    
  	ctx.fillRect(offset(tile.x, 1), offset(tile.y, 1), side, side);
  }
}

const redraw = () => {
	reset();
  
  for (let y = 1; y <= 7; y++) {
		if(!board[y]) continue;
    
		for (let x = 1; x <= 7; x++) {
    	if(board[y][x]) {
      	draw(board[y][x]);
      }
    }
  }
  
  draw(ball);
  
  pointsElement.textContent = points;
  levelElement.textContent = level;
  movesElements.textContent = moves;
}

const checkCollisions = (xOffset: number, yOffset: number): boolean => {
	const x = ball.x + xOffset;
  const y = ball.y + yOffset;
  
  if (x <= 0 || x > 7 || y <= 0 || y > 7) {
  	return false;
  }
  
  const tile = board[y]?.[x];
  if (tile) {
  	if(tile.color === "red") {
  		return false;
    } else {
    	points += Math.floor({ yellow: 10, green: 5 }[tile.color] - Math.log2(moves));
      loadNextLevel();
      
      return false;
    }
  }
  
  return true;
}

const add = (tile: Tile) => {
	if(!board[tile.y]) board[tile.y] = [];
  
	board[tile.y][tile.x] = tile;
  redraw();
}

const move = (direction: "left" | "right" | "top" | "bottom") {
	if(showWalls) return;

	const xMove = {left: -1, right: 1, top: 0, bottom: 0}[direction];
	const yMove = {left: 0, right: 0, top: -1, bottom: 1}[direction];
  
  if(checkCollisions(xMove, yMove)) {  
  	ball.x += xMove;
  	ball.y += yMove;
    
    moves++;
  }
  
  redraw();
}

const loadNextLevel = () => {
	level++;
  moves = 0;
  board.length = 0;
  
  const levels = [
  	[
			[2, 1, 4, 0, 0, 1, 1],
      [0, 1, 1, 1, 0, 0, 3],
      [0, 1, 0, 0, 0, 1, 1],
      [0, 0, 0, 1, 0, 1, 3],
      [1, 0, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 0, 0, 0],
    ],
    [
      [4, 3, 3, 4, 3, 3, 4],
      [1, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 2, 0, 0, 1]
    ],
    [            
    	[4, 3, 4, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 3],
      [0, 0, 0, 1, 1, 0, 1],
      [0, 1, 0, 0, 0, 1, 0],
      [4, 1, 1, 1, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 2]
    ],
    [
      [0, 2, 0, 1, 1, 4, 0],
      [1, 0, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [3, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 0],
      [1, 0, 1, 0, 1, 0, 1],
      [3, 3, 3, 1, 3, 0, 3]
    ],
    [
      [0, 0, 3, 1, 0, 0, 0],
      [0, 1, 1, 1, 4, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 0, 0],
      [2, 1, 1, 1, 0, 1, 0]
    ],
    [
      [3, 0, 0, 1, 0, 0, 4],
      [0, 0, 1, 0, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 0],
      [3, 0, 0, 1, 0, 0, 3]
    ],
    [
      [2, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 3, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [4, 0, 0, 0, 0, 0, 0]
    ],
    [
      [4, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 1, 0],
      [2, 0, 1, 0, 0, 0, 0]
    ]
  ];
  
  const loadLevel = (lvl) => {
  	if(!lvl) {
      loadEnd();
      return;
    }
    
  	for(let y = 0; y < lvl.length; y++) {
    	const row = lvl[y];
    	for (let x = 0; x < row.length; x++) {
      	const el = row[x];
        
        if(el === 2) {
        	ball.x = x + 1;
          ball.y = y + 1;
        }
        if (el !== 0 && el !== 2) {
      		const tile = {
        		x: x + 1, y: y + 1, color: {1: "red", 3: "green", 4: "yellow"}[el];
        	}
        	add(tile);
      	}
      }
    }
    
    showWalls = true;
    setTimeout(() => {
    	showWalls = false;
      redraw();
    }, 2000)
  }
  
  loadLevel(levels[level - 1]);
}

const loadEnd = () => {
	ball.x = 0;
  ball.y = 0;
    
  redraw();
  
  ctx.fillStyle = "#2C3A47";
	ctx.fillRect(0, 0, screen, screen);
  
  alert(`Tu as fini le jeu avec ${points} points ! GG !`);
}

window.addEventListener("keydown", event => {
	event.preventDefault();
  
	const directions = {
      38: "top",
      37: "left",
      40: "bottom",
      39: "right",
  };
  
  const direction = directions[event.keyCode];
  if (direction) {
  	move(direction);
  }
});

document.querySelector("#reset").onclick = () => {
	level = 0;
  points = 0;
  moves = 0;
  showWalls = true;
  
  loadNextLevel();
}

init();
