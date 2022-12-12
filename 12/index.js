const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

const start = (input) => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "S") {
        return [i, j];
      }
    }
  }
  throw new Error("No start found");
};

const allStarts = (input) => {
  const result = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "S" || input[i][j] === "a") {
        result.push([i, j]);
      }
    }
  }
  return result;
};

const elevationAcceptable = (start, end) => {
  if (start === "S") start = "a";
  if (start === "E") start = "z";
  if (end === "S") end = "a";
  if (end === "E") end = "z";
  return end.charCodeAt(0) - start.charCodeAt(0) <= 1;
};

const neighbours = (input, row, col) => {
  const result = [];
  if (row > 0) {
    result.push([row - 1, col]);
  }
  if (row < input.length - 1) {
    result.push([row + 1, col]);
  }
  if (col > 0) {
    result.push([row, col - 1]);
  }
  if (col < input[row].length - 1) {
    result.push([row, col + 1]);
  }
  return result.filter(([newRow, newCol]) =>
    elevationAcceptable(input[row][col], input[newRow][newCol])
  );
};

const isFinish = (input, row, col) => {
  return input[row][col] === "E";
};

const shortestPath = (input, [startRow, startCol]) => {
  const visited = Array.from({ length: input.length }, () => Array(input[0].length).fill(false));
  const queue = [[startRow, startCol, 0]];

  while (queue.length > 0) {
    const [row, col, step] = queue.shift();
    if (visited[row][col]) {
      continue;
    }
    visited[row][col] = true;
    if (isFinish(input, row, col)) {
      return step;
    }
    queue.push(
      ...neighbours(input, row, col).map(([newRow, newCol]) => [newRow, newCol, step + 1])
    );
  }
  return Infinity;
}

console.log(shortestPath(input, start(input)));

const minPath = allStarts(input)
  .map((start) => shortestPath(input, start))
  .reduce((min, current) => Math.min(min, current), Infinity);
console.log(minPath);
