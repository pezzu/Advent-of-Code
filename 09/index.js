const fs = require("fs");

const motions = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(" "));

// let headPos = [0, 0];
// let tailPos = [0, 0];

let visited = new Set();
visited.add([0, 0].join(","));

let rope = Array.from({ length: 10 }, () => [0, 0]);

// motions.forEach((motion) => {
//   const direction = motion[0];
//   const value = parseInt(motion[1]);

//   switch (direction) {
//     case "U":
//       headPos[1] += value;
//       break;
//     case "D":
//       headPos[1] -= value;
//       break;
//     case "L":
//       headPos[0] -= value;
//       break;
//     case "R":
//       headPos[0] += value;
//       break;
//   }

//   updateNextKnot(headPos, tailPos);
// });

function updateNextKnot(headPos, tailPos, visit = false) {
  const xDiff = headPos[0] - tailPos[0];
  const yDiff = headPos[1] - tailPos[1];
  if (xDiff === 0) {
    for (let i = 0; i < Math.abs(yDiff) - 1; i++) {
      tailPos[1] += Math.sign(yDiff);
      if (visit) visited.add([tailPos[0], tailPos[1]].join(","));
    }
  } else if (yDiff === 0) {
    for (let i = 0; i < Math.abs(xDiff) - 1; i++) {
      tailPos[0] += Math.sign(xDiff);
      if (visit) visited.add([tailPos[0], tailPos[1]].join(","));
    }
  } else if (Math.abs(xDiff) > 1) {
    tailPos[0] += Math.sign(xDiff);
    tailPos[1] += Math.sign(yDiff);
    if (visit) visited.add([tailPos[0], tailPos[1]].join(","));
    for (let i = 1; i < Math.abs(xDiff) - 1; i++) {
      tailPos[0] += Math.sign(xDiff);
      if (visit) visited.add([tailPos[0], tailPos[1]].join(","));
    }
  } else if (Math.abs(yDiff) > 1) {
    tailPos[0] += Math.sign(xDiff);
    tailPos[1] += Math.sign(yDiff);
    if (visit) visited.add([tailPos[0], tailPos[1]].join(","));
    for (let i = 1; i < Math.abs(yDiff) - 1; i++) {
      tailPos[1] += Math.sign(yDiff);
      if (visit) visited.add([tailPos[0], tailPos[1]].join(","));
    }
  }
}

motions.forEach((motion) => {
  const direction = motion[0];
  const value = parseInt(motion[1]);

  for (let i = 0; i < value; i++) {
    switch (direction) {
      case "U":
        rope[0][1] += 1;
        break;
      case "D":
        rope[0][1] -= 1;
        break;
      case "L":
        rope[0][0] -= 1;
        break;
      case "R":
        rope[0][0] += 1;
        break;
    }

    for (let j = 0; j < rope.length - 1; j++) {
      updateNextKnot(rope[j], rope[j + 1], j + 1 === rope.length - 1);
    }
  }
});

console.log(visited.size);
