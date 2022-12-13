const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""));

const start = (input) => {
  const starts = browse(input, (node) => node === "S");
  if (starts.length === 0) {
    throw new Error("No start found");
  }
  if (starts.length > 1) {
    throw new Error("Multiple starts found");
  }
  return starts[0];
};

const lowestElevations = (input) => browse(input, (node) => node === "S" || node === "a");

const browse = (input, isStart) => {
  const result = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (isStart(input[i][j], input[i][j])) {
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

const neighbours =
  (graph) =>
  ([row, col]) => {
    const result = [];
    if (row > 0) {
      result.push([row - 1, col]);
    }
    if (row < graph.length - 1) {
      result.push([row + 1, col]);
    }
    if (col > 0) {
      result.push([row, col - 1]);
    }
    if (col < graph[row].length - 1) {
      result.push([row, col + 1]);
    }
    return result.filter(([newRow, newCol]) =>
      elevationAcceptable(graph[row][col], graph[newRow][newCol])
    );
  };

const isFinish =
  (graph) =>
  ([row, col]) => {
    return graph[row][col] === "E";
  };

const isVisited = (graph) => {
  const visited = Array.from({ length: graph.length }, () => Array(graph[0].length).fill(false));

  return ([row, col]) => {
    const isVisited = visited[row][col];
    visited[row][col] = true;
    return isVisited;
  };
};

const shortestPath = (startNode, neighbours, isFinish, isVisited) => {
  const shortestPathRecursive = (nodes, step) => {
    if (nodes.length === 0) {
      return Infinity;
    }
    const notVisited = nodes.filter((node) => !isVisited(node));
    if (notVisited.find(isFinish)) {
      return step;
    } else {
      return shortestPathRecursive(notVisited.flatMap(neighbours), step + 1);
    }
  };

  return shortestPathRecursive([startNode], 0);
};

console.log(shortestPath(start(input), neighbours(input), isFinish(input), isVisited(input)));

const minPath = lowestElevations(input)
  .map((start) => shortestPath(start, neighbours(input), isFinish(input), isVisited(input)))
  .reduce((min, current) => Math.min(min, current), Infinity);
console.log(minPath);
