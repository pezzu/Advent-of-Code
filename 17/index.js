const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

const cycle = (shifts) => {
  let i = 0;
  return () => {
    const shift = shifts[i];
    i = (i + 1) % shifts.length;
    return shift;
  };
};

const nextPattern = cycle(input[0]);
const nextFigure = cycle([
  // |..@@@@.|
  [[2, 3, 4, 5]],

  // |...@...|
  // |..@@@..|
  // |...@...|
  [[3], [2, 3, 4], [3]],

  // |....@..|
  // |....@..|
  // |..@@@..|
  [[2, 3, 4], [4], [4]],

  // |..@....|
  // |..@....|
  // |..@....|
  // |..@....|
  [[2], [2], [2], [2]],

  // |..@@...|
  // |..@@...|
  [
    [2, 3],
    [2, 3],
  ],
]);
const chamber = [[0, 1, 2, 3, 4, 5, 6]];

const move = (figure, depth) => {
  const pattern = nextPattern();

  let step = 0;
  let canMove;

  const leftBorder = (level, cell) => {
    if (level <= 0) return 0;
    const position = chamber.at(-level).filter((c) => c < cell).length;
    if (position === 0) {
      return 0;
    } else {
      return chamber.at(-level).at(position - 1) + 1;
    }
  };

  const rightBorder = (level, cell) => {
    if (level <= 0) return 6;
    const position = chamber.at(-level).filter((c) => c < cell).length;
    if (position === chamber.at(-level).length) {
      return 6;
    } else {
      return chamber.at(-level).at(position) - 1;
    }
  };

  if (pattern === "<") {
    step = -1;
    canMove = (layer, i) => layer.at(0) > leftBorder(depth - i, layer.at(0));
  } else if (pattern === ">") {
    step = 1;
    canMove = (layer, i) => layer.at(-1) < rightBorder(depth - i, layer.at(-1));
  } else {
    throw new Error("Invalid pattern");
  }

  if (figure.every((layer, i) => canMove(layer, i))) {
    return figure.map((layer) => layer.map((cell) => cell + step));
  } else {
    return figure;
  }
};

const canFall = (figure, level) => {
  return figure.every((layer, i) => {
    if (i > level) return true;
    return chamber.at(-level - 1 + i).every((floor) => !layer.includes(floor));
  });
};

const updateChamber = (figure, depth) => {
  if (depth < figure.length) {
    for (let i = 0; i < figure.length - depth; i++) chamber.push([]);
    depth = figure.length;
  }
  figure.forEach((layer, i) => {
    chamber.at(-depth + i).push(...layer);
    chamber.at(-depth + i).sort((a, b) => a - b);
  });
};

for (let i = 0; i < 2022; i++) {
  let figure = [0, 1, 2, 4].reduce((figure, _) => move(figure, 0), nextFigure());
  let level = 0;
  while (canFall(figure, level)) {
    level += 1;
    figure = move(figure, level);
  }
  updateChamber(figure, level);
}

console.log(chamber.length - 1);
