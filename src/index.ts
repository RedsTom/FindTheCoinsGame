import "./styles/style.scss";
import Ref, {ref} from "./script/ref";
import createGame from "./script/game";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

const pointsElement = document.querySelector<HTMLSpanElement>("#points") as HTMLSpanElement;
let points: Ref<number> = ref(10);

const levelElement = document.querySelector<HTMLSpanElement>("#level") as HTMLSpanElement;
let level: Ref<number> = ref(0);
let showWalls: Ref<boolean> = ref(true);

const movesElement = document.querySelector<HTMLSpanElement>("#moves") as HTMLSpanElement;
let moves: Ref<number> = ref(0);

const arrowButtons = ["left", "right", "up", "down"].map(dir => document.querySelector(`#${dir}`) as HTMLButtonElement);

const helpButton = document.querySelector<HTMLButtonElement>("#help") as HTMLButtonElement;

const game = createGame({
  canvas, ctx, points, movesElement, level, levelElement, pointsElement, moves, showWalls, arrowButtons, helpButton
});

window.addEventListener("keydown", event => {

  const directions: { [key: string]: "top" | "left" | "bottom" | "right" } = {
    ArrowUp: "top",
    ArrowLeft: "left",
    ArrowDown: "bottom",
    ArrowRight: "right",
  };

  const direction = directions[event.key];
  if (direction) {
    event.preventDefault();
    game.move(direction);
  }
});
arrowButtons.forEach(btn => btn.addEventListener("click", () => {
  game.move({
    left: "left",
    right: "right",
    up: "top",
    down: "bottom",
  }[btn.id] as "left" | "right" | "top" | "bottom");
}));

document.querySelector("#reset")?.addEventListener("click", () => {
  if (window.confirm("Are you sure you want to reset the game?")) {
    level.value = 0;
    points.value = 10;
    moves.value = 0;
    showWalls.value = true;

    game.loadNextLevel();
  }
});
helpButton?.addEventListener("click", () => {
  if (points.value < 3) return;

  points.value -= 3;
  if (points.value <= 0) {
    game.loadEnd();
    return;
  }

  game.showHelp();
})

game.init();

