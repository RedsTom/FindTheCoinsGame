export default function generateMaze(rows: number, columns: number): number[][] {
  // Initialize the maze grid with all walls (1)
  const maze: number[][] = [];
  for (let row = 0; row < rows; row++) {
    maze[row] = [];
    for (let col = 0; col < columns; col++) {
      maze[row][col] = 1;
    }
  }

  // Recursive function to carve out the maze
  function carveMaze(row: number, col: number) {
    // Mark the current cell as visited (0)
    maze[row][col] = 0;

    // Define the four possible directions (up, right, down, left)
    const directions = [
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0]
    ];

    // Randomly shuffle the directions
    directions.sort(() => Math.random() - 0.5);

    // Iterate through each direction
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      // Check if the new cell is within bounds and unvisited
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns && maze[newRow][newCol] === 1) {
        // Mark the cell between the current and new cell as visited (0)
        maze[row + dx / 2][col + dy / 2] = 0;
        carveMaze(newRow, newCol);
      }
    }
  }

  // Start carving the maze from the top-left corner (0, 0)
  carveMaze(0, 0);

  return maze;
}