import Ref, {ref} from "./ref";
import generateMaze from "./maze";

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
                      arrowButtons,
                      helpButton,
                    }: {
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  pointsElement: HTMLSpanElement,
  levelElement: HTMLSpanElement,
  movesElement: HTMLSpanElement,
  arrowButtons: HTMLButtonElement[],
  helpButton: HTMLButtonElement,
  points: Ref<number>,
  level: Ref<number>,
  moves: Ref<number>,
  showWalls: Ref<boolean>,
}) => {
  const screen = 350;
  let gridSize = 7, side = screen / gridSize;

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

    for (let y = 1; y <= gridSize; y++) {
      if (!board[y]) continue;

      for (let x = 1; x <= gridSize; x++) {
        if (board[y][x]) {
          draw(board[y][x]);
        }
      }
    }

    draw(ball);

    if (showWalls.value) {
      arrowButtons.forEach(button => button.disabled = true)
    } else {
      arrowButtons.forEach(button => button.disabled = false)
    }

    helpButton.disabled = points.value < 3 || showWalls.value;

    pointsElement.textContent = "" + points.value;
    levelElement.textContent = "" + level.value;

    movesElement.textContent = "" + moves.value;
  }

  const checkCollisions = (xOffset: number, yOffset: number): boolean => {
    const x = ball.x + xOffset;
    const y = ball.y + yOffset;

    if (x <= 0 || x > gridSize || y <= 0 || y > gridSize) {
      return false;
    }

    const tile = board[y]?.[x];
    if (tile) {
      if (tile.color === "red") {
        points.value = Math.max(0, points.value - 1);
        if(points.value <= 0) {
          loadEnd();
        }

        return false;
      } else {
        const pts = {yellow: 10, green: 5}[tile.color];

        points.value += Math.floor(pts - Math.log2((moves.value * pts / 10) + 1));
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

    gridSize = 7 + (Math.floor(level.value / 5));
    side = screen / gridSize;

    const generateLevel = (): number[][] => {
      const level: number[][] = generateMaze(gridSize, gridSize);

      const greenAmount = gridSize / 10;
      const yellowAmount = gridSize / 20;

      for (let i = 0; i < greenAmount; i++) {
        do {
          const x = Math.floor(Math.random() * gridSize);
          const y = Math.floor(Math.random() * gridSize);

          if (level[y][x] === 0) {
            level[y][x] = 3;
            break;
          }
        } while (true);
      }

      for (let i = 0; i < yellowAmount; i++) {
        do {
          const x = Math.floor(Math.random() * gridSize);
          const y = Math.floor(Math.random() * gridSize);

          if (level[y][x] === 0) {
            level[y][x] = 4;
            break;
          }
        } while (true);
      }

      do {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);

        if (level[y][x] === 0) {
          level[y][x] = 2;
          break;
        }
      } while (true);

      return level;
    }

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

      showHelp();
    }

    loadLevel(generateLevel());
  }

  const loadEnd = () => {
    ball.x = 0;
    ball.y = 0;

    redraw();

    ctx.fillStyle = "#2C3A47";
    ctx.fillRect(0, 0, screen, screen);

    if(window.confirm(`Looks like your are dead ! ☠️`)) {
      reset();
      loadNextLevel();
    } else {
      reset();
      loadNextLevel();
    }
  }


  let timeout: NodeJS.Timeout | undefined = undefined;
  const showHelp = () => {
    showWalls.value = true;
    redraw();

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      showWalls.value = false;
      redraw();
    }, 3000 + (Math.floor(level.value / 5) * 2000))
  }

  const isHelpShown = () => {
    return timeout !== undefined;
  }

  return {
    init, reset, offset, draw, redraw, checkCollisions, add, move, loadNextLevel, loadEnd, showHelp, isHelpShown
  }
}

export default createGame;