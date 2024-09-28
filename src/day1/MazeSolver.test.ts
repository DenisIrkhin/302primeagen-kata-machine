import { expect, test } from "bun:test";

// solved by Cursor

interface Point {
  x: number;
  y: number;
}

export default function solve(maze: string[], wall: string, start: Point, end: Point): Point[] {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // Helper function to check if a point is valid
  const isValid = (p: Point): boolean => {
    return p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows && maze[p.y][p.x] !== wall;
  };
  
  // Directions: up, right, down, left
  const directions: Point[] = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
  
  // Queue for BFS
  const queue: Point[] = [start];
  
  // Keep track of visited points and their previous points
  const visited: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const previous: (Point | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  visited[start.y][start.x] = true;
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.x === end.x && current.y === end.y) {
      // Reconstruct the path
      const path: Point[] = [];
      let p: Point | null = current;
      while (p !== null) {
        path.unshift(p);
        p = previous[p.y][p.x];
      }
      return path;
    }
    
    for (const dir of directions) {
      const next: Point = { x: current.x + dir.x, y: current.y + dir.y };
      if (isValid(next) && !visited[next.y][next.x]) {
        queue.push(next);
        visited[next.y][next.x] = true;
        previous[next.y][next.x] = current;
      }
    }
  }
  
  // If no path is found, return an empty array
  return [];
}


test("maze solver", function () {
    const maze = [
        "xxxxxxxxxx x",
        "x        x x",
        "x        x x",
        "x xxxxxxxx x",
        "x          x",
        "x xxxxxxxxxx",
    ];

    const mazeResult = [
        { x: 10, y: 0 },
        { x: 10, y: 1 },
        { x: 10, y: 2 },
        { x: 10, y: 3 },
        { x: 10, y: 4 },
        { x: 9, y: 4 },
        { x: 8, y: 4 },
        { x: 7, y: 4 },
        { x: 6, y: 4 },
        { x: 5, y: 4 },
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
        { x: 1, y: 5 },
    ];

    // there is only one path through
    const result = solve(maze, "x", { x: 10, y: 0 }, { x: 1, y: 5 });
    expect(drawPath(maze, result)).toEqual(drawPath(maze, mazeResult));
});

function drawPath(data: string[], path: Point[]) {
    const data2 = data.map((row) => row.split(""));
    path.forEach((p) => {
        if (data2[p.y] && data2[p.y][p.x]) {
            data2[p.y][p.x] = "*";
        }
    });
    return data2.map((d) => d.join(""));
}

