const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split(/^\r\n/gm);

const parseMonkey = (monkey) => {
  const [_, items, operation, test, ifTure, ifFalse] = monkey.slice().split("\r\n");
  return {
    items: parseItems(items),
    operation: parseOperation(operation),
    test: parseTest(test),
    evaluate: parseEvaluate(ifTure, ifFalse),
    inspected: 0,
  };
};

const parseItems = (line) => {
  return line.slice(18).split(", ").map(Number);
};

const parseOperation = (line) => {
  const [operator, value] = line.slice(23).split(" ");
  switch (operator) {
    case "*":
      return (value === 'old')? old => old * old : (old) => old * Number(value);
    case "+":
      return (value === 'old')? old => old + old : (old) => old + Number(value);

  }

  throw new Error("Unknown operator: " + operator);
};

const parseTest = (line) => {
  const value = Number(line.slice(21));
  return (level) => level % value == 0;
};

const parseEvaluate = (ifTrue, ifFalse) => {
  const trueValue = Number(ifTrue.slice(29));
  const falseValue = Number(ifFalse.slice(30));
  return (test) => (test ? trueValue : falseValue);
};

const inspect = (monkey, item) => {
  const level = monkey.operation(item);
  const calm = Math.floor(level / 3);
  // const calm = level;
  monkey.inspected++;
  return calm;
};

const decide = (monkey, level) => {
  const result = monkey.test(level);
  return monkey.evaluate(result);
}

const inspectAllItems = (activeMonkey, monkeys) => {

  for(let i = 0; i < activeMonkey.items.length; i++) {
    const item = activeMonkey.items[i];
    const level = inspect(activeMonkey, item);
    const next = decide(activeMonkey, level);
    monkeys[next].items.push(level);
  }
  activeMonkey.items = [];
  return monkeys;
};

let monkeys = input.map(parseMonkey);

const round = (monkeys) =>
  monkeys.forEach((activeMonkey, i, monkeys) => inspectAllItems(activeMonkey, monkeys));

for (let i = 0; i < 20; i++) {
  if(i % 10 === 0) console.log(i);
  round(monkeys);
}

const inspected = monkeys.map((monkey) => monkey.inspected);
console.log(inspected);

inspected.sort((a, b) => b - a);
console.log(inspected[0]*inspected[1]);
