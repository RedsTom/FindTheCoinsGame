import levels from "./levels.json";
import Ref from "./ref";

interface Tile {
  x: number;
  y: number;
  color: "yellow" | "red" | "green";
  type?: "ball" | "tile";
}

const createGame = ({
                      canvas,
                      ctx,
                      pointsElement,
                      points,
                      levelElement,
                      level,
                      showWalls,
                      movesElement,
                      moves,
                      arrowButtons
                    }: {
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  pointsElement: HTMLSpanElement,
  levelElement: HTMLSpanElement,
  movesElement: HTMLSpanElement,
  arrowButtons: HTMLButtonElement[],
  points: Ref<number>,
  level: Ref<number>,
  moves: Ref<number>,
  showWalls: Ref<boolean>,
}) => {
  const screen = 350;
  const side = screen / 7;

  const ball: Tile = {
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
      if (showWalls.value) return;

      ctx.beginPath();
      ctx.arc(offset(tile.x, .5), offset(tile.y, .5), side / 3, -Math.PI, Math.PI);
      ctx.fill();

    } else {
      if (tile.color === "red" && !showWalls.value) return;

      ctx.fillRect(offset(tile.x, 1), offset(tile.y, 1), side, side);
    }
  }

  const redraw = () => {
    reset();

    for (let y = 1; y <= 7; y++) {
      if (!board[y]) continue;

      for (let x = 1; x <= 7; x++) {
        if (board[y][x]) {
          draw(board[y][x]);
        }
      }
    }

    draw(ball);

    if(showWalls.value) {
      arrowButtons.forEach(button => button.disabled = true)
    } else {
      arrowButtons.forEach(button => button.disabled = false)
    }

    pointsElement.textContent = "" + points.value;
    levelElement.textContent = "" + level.value;
    movesElement.textContent = "" + moves.value;
  }

  const checkCollisions = (xOffset: number, yOffset: number): boolean => {
    const x = ball.x + xOffset;
    const y = ball.y + yOffset;

    if (x <= 0 || x > 7 || y <= 0 || y > 7) {
      return false;
    }

    const tile = board[y]?.[x];
    if (tile) {
      if (tile.color === "red") {
        return false;
      } else {
        points.value += Math.floor({yellow: 10, green: 5}[tile.color] - Math.log2(moves.value));
        loadNextLevel();

        return false;
      }
    }

    return true;
  }

  const add = (tile: Tile) => {
    if (!board[tile.y]) board[tile.y] = [];

    board[tile.y][tile.x] = tile;
    redraw();
  }

  const move = (direction: "left" | "right" | "top" | "bottom") => {
    if (showWalls.value) return;

    const xMove = {left: -1, right: 1, top: 0, bottom: 0}[direction];
    const yMove = {left: 0, right: 0, top: -1, bottom: 1}[direction];

    if (checkCollisions(xMove, yMove)) {
      ball.x += xMove;
      ball.y += yMove;

      moves.value++;
    }

    redraw();
  }

  const loadNextLevel = () => {
    level.value++;
    moves.value = 0;
    board.length = 0;

    const loadLevel = (lvl: number[][]) => {
      if (!lvl) {
        loadEnd();
        return;
      }

      for (let y = 0; y < lvl.length; y++) {
        const row = lvl[y];
        for (let x = 0; x < row.length; x++) {
          const el = row[x];

          if (el === 2) {
            ball.x = x + 1;
            ball.y = y + 1;
          }
          if (el !== 0 && el !== 2) {
            const tile: Tile = {
              x: x + 1,
              y: y + 1,
              color: {
                1: "red", 3: "green", 4: "yellow"
              }[el] as "red" | "yellow" | "green"
            };
            add(tile);
          }
        }
      }

      showWalls.value = true;
      setTimeout(() => {
        showWalls.value = false;
        redraw();
      }, 3000)
    }

    loadLevel(levels[level.value - 1]);
  }

  const loadEnd = () => {
    ball.x = 0;
    ball.y = 0;

    redraw();

    ctx.fillStyle = "#2C3A47";
    ctx.fillRect(0, 0, screen, screen);

    alert(`Tu as fini le jeu avec ${points} points ! GG !`);
  }

  return {
    init, reset, offset, draw, redraw, checkCollisions, add, move, loadNextLevel, loadEnd
  }
}

export default createGame;