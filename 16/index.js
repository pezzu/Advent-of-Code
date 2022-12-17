const fs = require("fs");
const { disconnect } = require("process");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

function parseValve(line) {
  const [id, ...leadTo] = line.match(/[A-Z][A-Z]/g);
  const rate = Number(line.match(/rate=(\d+)/)[1]);
  return { id, rate, leadTo };
}

const valves = input.map(parseValve);
const rates = valves.map((v) => v.rate);

const distances = Array.from({ length: valves.length }, () =>
  Array.from({ length: valves.length }, () => Infinity)
);

valves.forEach((valve, i) => {
  distances[i][i] = 0;
  valve.leadTo.forEach((connection) => {
    const connectionIndex = valves.findIndex((v) => v.id === connection);
    distances[i][connectionIndex] = 1;
  });
});

for (let k = 0; k < valves.length; k++) {
  for (let i = 0; i < valves.length; i++) {
    for (let j = 0; j < valves.length; j++) {
      distances[i][j] = Math.min(distances[i][j], distances[i][k] + distances[k][j]);
    }
  }
}

const AA = valves.findIndex((v) => v.id === "AA");

const max = (array) => array.reduce((a, b) => Math.max(a, b), 0);

const maxFlow = (current, rest, time) => {
  return max(
    rest
      .filter((next) => distances[current][next] < time)
      .map((next) => {
        return (
          rates[next] * (time - distances[current][next] - 1) +
          maxFlow(
            next,
            rest.filter((v) => v !== next),
            time - distances[current][next] - 1
          )
        );
      })
  );
};

console.log(
  maxFlow(
    AA,
    valves
      .map((v, i) => [i, v.rate])
      .filter((v) => v[1] > 0)
      .map((v) => v[0]),
    30
  )
);

const maxFlow2 = (current, rest, timeLeft) => {
  return max(
    rest
      .filter((next) => distances[current][next] < timeLeft)
      .map((next) => {
        const timeToNext = distances[current][next];
        return rates[next] * (timeLeft - timeToNext - 1) + maxFlow2(next, rest.filter((v) => v !== next), timeLeft - timeToNext - 1);
      })
      .concat(maxFlow(AA, rest, 26))
  );
};

console.log(
  maxFlow2(
    AA,
    valves
      .map((v, i) => [i, v.rate])
      .filter((v) => v[1] > 0)
      .map((v) => v[0]),
    26
  )
);
