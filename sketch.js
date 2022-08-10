const background_color = [50, 50, 50, 255];
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight - 100;
let screenBuffer = 50;

//class traveling salesman problem
class TSP {
  //constructor
  constructor() {
    this.nodes = [];
    this.stepCount = -1;
    this.solvingType = "";
    this.lowerBound, (this.mst = [null, null]);
    this.shortestDistance = Infinity;
    this.shortestPath = [];
  }

  optimizeSolution(alg) {
    if (alg == "opt2") {
      this.solvingType = "opt2";
    }
    if (alg == "opt3") {
      this.solvingType = "opt3";
    }
  }

  solve(alg, an) {
    this.stepCount = -1;
    this.solvingType = "";
    if (alg == "naive") {
      this.solveNaive(an);
    }
    if (alg == "greedy") {
      this.solveGreedy(an);
    }
    if (alg == "dynamic") {
      this.solveDynamic(an);
    }
    if (alg == "aco") {
      this.solveACO(an);
    }
    if (alg == "random") {
      this.solveRandom(an);
    }
  }

  //function to populate nodes
  populateNodes(n) {
    this.nodes = generateNodes(n);
    this.stepCount = -1;
    this.solvingType = "";
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    [this.lowerBound, this.mst] = findMST(this.nodes);
  }

  //function to draw all nodes
  drawNodes() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].draw();
    }
    if (document.getElementById("showMST").checked) {
      this.drawMST();
    }
    //draw an eclipse where node 0 is
    fill(255, 0, 0, 255);
    ellipse(this.nodes[0].x, this.nodes[0].y, 30, 30);
  }

  // optimizing3() {
  //   for (let i = 1; i < this.shortestPath.length; i++) {
  //     for (let j = i + 2; j < this.shortestPath.length; j++) {
  //       for (let _k = j + 2; _k < this.shortestPath.length; _k++) {
  //         let k = _k % this.shortestPath.length;
  //         let A = this.shortestPath[i - 1];
  //         let B = this.shortestPath[i];
  //         let C = this.shortestPath[j - 1];
  //         let D = this.shortestPath[j];
  //         let E = this.shortestPath[k - 1];
  //         let F = this.shortestPath[k];

  //         let d0 = A.distanceTo(B) + C.distanceTo(D) + E.distanceTo(F);
  //         let d1 = A.distanceTo(C) + B.distanceTo(D) + E.distanceTo(F);
  //         let d2 = A.distanceTo(B) + C.distanceTo(E) + D.distanceTo(F);
  //         let d3 = A.distanceTo(D) + E.distanceTo(B) + C.distanceTo(F);
  //         let d4 = F.distanceTo(B) + C.distanceTo(D) + E.distanceTo(A);

  //         if (d0 - 5 > d1) {
  //           let temp = [];
  //           for (let index = 0; index < i; index++) { // [0:i)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = j; index > i - 1; index--) { // [j:i]
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = j + 1; index < this.shortestPath.length; index++) { //(j:end)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           this.shortestPath = temp;
  //           return true;
  //         }

  //         if (d0 - 5 > d2) {
  //           let temp = [];
  //           for (let index = 0; index < j; index++) { // [0:j)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = k; index > j - 1; index--) { // [k:j]
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = k + 1; index < this.shortestPath.length; index++) { //(k:end)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           this.shortestPath = temp;
  //           return true;
  //         }

  //         if (d0 - 5 > d3) {
  //           let temp = [];
  //           for (let index = 0; index < i; index++) { // [0:i)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = k; index > i - 1; index--) { // [k:i]
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = k + 1; index < this.shortestPath.length; index++) { //(k:end)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           this.shortestPath = temp;
  //           return true;
  //         }

  //         if (d0 - 5 > d4) {
  //           let temp = [];
  //           for (let index = 0; index < j; index++) { // [0:j)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = k; index > j - 1; index--) { // [k:j]
  //             temp.push(this.shortestPath[index]);
  //           }
  //           for (let index = k + 1; index < this.shortestPath.length; index++) { //(k:end)
  //             temp.push(this.shortestPath[index]);
  //           }
  //           this.shortestPath = temp;
  //           return true;
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  optimizing2() {
    //console.log("Hello")
    let before = evalPath(this.shortestPath);
    for (let i = 1; i < this.shortestPath.length; i++) {
      for (let j = i + 2; j < this.shortestPath.length; j++) {
        let temp = [];
        for (let index = 0; index < i; index++) {
          temp.push(this.shortestPath[index]);
        }
        for (let index = j - 1; index >= i; index--) {
          temp.push(this.shortestPath[index]);
        }
        for (let index = j; index < this.shortestPath.length; index++) {
          temp.push(this.shortestPath[index]);
        }
        let after = evalPath(temp);
        //console.log(before, after);
        if (after < before) {
          //console.log("heh")
          this.shortestPath = [...temp];
          return true;
        }
      }
    }
    for (let i = 2; i < this.shortestPath.length; i++) {
      let temp = [this.shortestPath[0]];
      for (let index = i; index < this.shortestPath.length; index++) {
        temp.push(this.shortestPath[index]);
      }
      for (let index = i - 1; index > 0; index--) {
        temp.push(this.shortestPath[index]);
      }
      let after = evalPath(temp);
      if (after < before) {
        this.shortestPath = [...temp];
        return true;
      }
    }
    //console.log("Goodbye")
    return false;
  }

  nextStep() {
    if (this.solvingType == "opt2") {
      if (this.optimizing2() == false) {
        this.solvingType = "";
      }
    }
    if (this.solvingType == "opt3") {
      if (this.optimizing3() == false) {
        this.solvingType = "";
      }
    }

    if (this.stepCount != -1) {
      this.stepCount++;
      if (this.solvingType == "naive") {
        if (this.stepCount == this.allPermutationsOfNodes.length) {
          this.stepCount = -1;
          this.solvingType = "";
        } else {
          this.evaluatePermutation(this.allPermutationsOfNodes[this.stepCount]);
        }
      }
      if (this.solvingType == "greedy") {
        this.nextGreedyMove();
        if (this.stepCount == this.nodes.length) {
          this.stepCount = -1;
          this.solvingType = "";
        }
        this.calculateShortestDistance();
      }
      if (this.solvingType == "aco") {
        this.updateAntColonies();
        if (this.stepCount > 10000000) {
          this.stepCount = -1;
          this.solvingType = "";
        }
      }
      if (this.solvingType == "random") {
        let randomNode;
        do {
          randomNode =
            this.nodes[Math.floor(Math.random() * this.nodes.length)];
        } while (this.shortestPath.includes(randomNode));
        this.shortestPath.push(randomNode);
        this.calculateShortestDistance();
        if(this.shortestPath.length == this.nodes.length){
          this.stepCount = -1;
          this.solvingType = "";
        }
      }
    }
    this.calculateShortestDistance();
  }

  calculateShortestDistance() {
    this.shortestDistance = 0;
    for (let i = 0; i < this.shortestPath.length; i++) {
      this.shortestDistance += this.shortestPath[i].distanceTo(
        this.shortestPath[(i + 1) % this.shortestPath.length]
      );
    }
  }

  evaluatePermutation(permutation) {
    drawPath(permutation);
    let distance = 0;
    for (let i = 0; i < permutation.length - 1; i++) {
      distance += permutation[i].distanceTo(permutation[i + 1]);
    }
    distance += permutation[permutation.length - 1].distanceTo(permutation[0]);
    if (distance < this.shortestDistance) {
      this.shortestDistance = distance;
      this.shortestPath = permutation;
    }
  }

  drawShortestPath() {
    drawPath(this.shortestPath, 2, [255, 0, 0, 255]);
  }

  //solve naive function
  solveNaive(isAnimated) {
    findShortestPathDynamic(this.nodes);
    this.allPermutationsOfNodes = permutations(this.nodes);
    if (!this.allPermutationsOfNodes) return;
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "naive";
    } else {
      //solve tsp with brute force
      for (let i = 0; i < this.allPermutationsOfNodes.length; i++) {
        this.evaluatePermutation(this.allPermutationsOfNodes[i]);
      }
    }
  }

  nextGreedyMove() {
    let nextNode = closestNodeToNodeNotINArray(
      this.currentNode,
      this.shortestPath,
      this.nodes
    );
    this.shortestPath.push(this.currentNode);
    this.currentNode = nextNode;
  }

  solveGreedy(isAnimated) {
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    this.currentNode =
      this.nodes[Math.floor(Math.random() * this.nodes.length)];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "greedy";
    } else {
      //solve tsp with greedy algorithm
      for (let i = 0; i < this.nodes.length; i++) {
        this.nextGreedyMove();
      }
      this.calculateShortestDistance();
    }
  }

  drawMST() {
    for (let i = 0; i < this.mst.length; i++) {
      let [u, v] = this.mst[i];
      stroke(0, 255, 0);
      line(this.nodes[u].x, this.nodes[u].y, this.nodes[v].x, this.nodes[v].y);
    }
  }

  solveDynamic(isAnimated) {
    if (this.nodes.length > 20) {
      alert("20 is the max for a reasonable solution of this type");
      return;
    }
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      alert(
        "There is no animation for the DP solution to this, it would look almost exactly the same as the naive solution"
      );
    }
    let tempPath = [];
    [this.shortestDistance, tempPath] = findShortestPathDynamic(this.nodes);
    this.shortestPath = [];
    for (let i = 0; i < tempPath.length; i++) {
      this.shortestPath.push(this.nodes[tempPath[i]]);
    }
  }

  solveRandom(isAnimated) {
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "random";
    } else {
      while (this.shortestPath.length != this.nodes.length) {
        let randomNode;
        do {
          randomNode =
            this.nodes[Math.floor(Math.random() * this.nodes.length)];
        } while (this.shortestPath.includes(randomNode));
        this.shortestPath.push(randomNode);
        this.calculateShortestDistance();
      }
    }
  }

  updateAntColonies() {
    this.ant_r = simulateNAnts(
      this.ant_d,
      this.ant_r,
      this.ant_alpha,
      this.ant_beta,
      this.ant_decay,
      this.ant_number_of_ants,
      this.nodes
    );
    let curr = 0;
    let visited = new Set();
    this.shortestPath = [];
    while (visited.size != this.nodes.length) {
      visited.add(curr);
      this.shortestPath.push(this.nodes[curr]);
      let minn = -Infinity;
      let minnIndex = -1;
      for (let i = 0; i < this.nodes.length; i++) {
        if (!visited.has(i)) {
          if (this.ant_r[curr][i] > minn) {
            minn = this.ant_r[curr][i];
            minnIndex = i;
          }
        }
      }
      curr = minnIndex;
    }
    this.calculateShortestDistance();
  }

  solveACO(isAnimated) {
    this.ant_alpha = document.getElementById("ant_alpha").value;
    this.ant_beta = document.getElementById("ant_beta").value;
    this.ant_decay = document.getElementById("ant_decay").value;
    this.ant_number_of_ants = document.getElementById("ant_number").value;

    this.shortestDistance = Infinity;
    this.shortestPath = [];
    this.stepCount = 0;
    this.solvingType = "aco";
    this.ant_d = [];
    this.ant_r = [];
    for (let i = 0; i < this.nodes.length; i++) {
      this.ant_d.push([]);
      this.ant_r.push([]);
      for (let j = 0; j < this.nodes.length; j++) {
        this.ant_d[i].push(this.nodes[i].distanceTo(this.nodes[j]));
        this.ant_r[i].push(1);
      }
    }
    if (!isAnimated) {
      alert("only in animated does it work");
    }
  }
}

//function to find the minimal spanning tree for a set of nodes
function findMST(nodes) {
  let parent = [];
  for (let i = 0; i < nodes.length; i++) {
    parent[i] = i;
  }
  let mst = [];
  let mstWeight = 0;
  let edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push([i, j, nodes[i].distanceTo(nodes[j])]);
    }
  }
  //sort edges by the last element
  edges.sort(function (a, b) {
    return a[2] - b[2];
  });

  function find(v) {
    if (v == parent[v]) {
      return v;
    }
    parent[v] = find(parent[v]);
    return find(parent[v]);
  }

  function union(u, v) {
    let rootU = find(u);
    let rootV = find(v);
    if (rootU != rootV) {
      parent[rootU] = rootV;
    }
  }

  for (let i = 0; i < edges.length; i++) {
    let [u, v, w] = edges[i];
    if (find(u) != find(v)) {
      mst.push([u, v]);
      mstWeight += w;
      union(u, v);
    }
  }

  //draw mst

  return [mstWeight, mst];
}

function evalPath(path) {
  total = 0;
  for (let i = 0; i < path.length; i++) {
    total += path[i].distanceTo(path[(i + 1) % path.length]);
  }
  return total;
}

function findShortestPathDynamic(nodes) {
  let s = 0;
  let d = [];
  for (let i = 0; i < nodes.length; i++) {
    d[i] = [];
    for (let j = 0; j < nodes.length; j++) {
      d[i][j] = nodes[i].distanceTo(nodes[j]);
    }
  }

  let DP = {};
  for (let i = 0; i < nodes.length; i++) {
    DP[i] = {};
  }

  function intHas(bitmask, i) {
    return (bitmask & (1 << i)) !== 0;
  }

  function intAdd(bitmask, i) {
    return bitmask | (1 << i);
  }

  function intRemove(bitmask, i) {
    return bitmask & ~(1 << i);
  }

  function tsp(curr, visited) {
    if (visited == (1 << nodes.length) - 1) {
      DP[curr][visited] = null;
      return [d[curr][0], null];
    }

    if (DP[curr][visited] != undefined) {
      return DP[curr][visited];
    }

    let ans = 100000000;
    let next = null;
    for (let i = 0; i < nodes.length; i++) {
      if (i != curr && !intHas(visited, i)) {
        visited = intAdd(visited, i);
        let [res, something] = tsp(i, visited);
        if (ans > res + d[curr][i]) {
          ans = res + d[curr][i];
          next = i;
        }
        visited = intRemove(visited, i);
      }
    }
    DP[curr][visited] = [ans, next];
    return [ans, next];
  }

  let [ans, next] = tsp(s, 1);
  let path = [];
  let curr = 0;
  let bitmap = 1;
  do {
    path.push(curr);
    curr = DP[curr][bitmap];
    if (curr != null) {
      curr = curr[1];
      bitmap = intAdd(bitmap, curr);
    }
  } while (curr != null);
  return [ans, path];
}

//class node, having an x and y coordinate as well as draw function
class Node {
  //constructor function
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  //draw function
  draw() {
    //set radious to the inverse of the logarithm of the number of all nodes
    let r = 20 / Math.log(tsp.nodes.length) / Math.log(2);
    //draw a circle at the x and y coordinate
    fill(255, 255, 255, 255);
    ellipse(this.x, this.y, r, r);
  }

  //distanceTo function
  distanceTo(node) {
    //return the distance between two nodes
    return sqrt(pow(this.x - node.x, 2) + pow(this.y - node.y, 2));
  }
}

//function to generate an array of n nodes
function generateNodes(n) {
  let nodes = [];
  for (let i = 0; i < n; i++) {
    let x = random(screenWidth - screenBuffer * 2);
    let y = random(screenHeight - screenBuffer * 2);
    //check if any node is within the radius of another node
    let r = 20;
    for (let j = 0; j < nodes.length; j++) {
      if (sqrt(pow(x - nodes[j].x, 2) + pow(y - nodes[j].y, 2)) < 2 * r) {
        x = random(screenWidth - screenBuffer * 2);
        y = random(screenHeight - screenBuffer * 2);
        j = 0;
      }
    }
    nodes.push(new Node(x + screenBuffer, y + screenBuffer, i));
  }
  return nodes;
}

//function that takes as input an array and returns all permutations of it
function permutations(inputArr) {
  if (inputArr.length > 8) {
    //make a window popup saying that 10 is the max
    alert("8 is the max");
    return;
  }
  var results = [];
  function permute(arr, memo) {
    var cur,
      memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }
  //filter out all permutations that do not start with the first node
  return permute(inputArr).filter(function (permutation) {
    return permutation[0] == inputArr[0];
  });
}

function closestNodeToNodeNotINArray(node, array, nodes) {
  let closestNode = null;
  let closestDistance = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    if (node != nodes[i] && array.indexOf(nodes[i]) == -1) {
      let distance = node.distanceTo(nodes[i]);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNode = nodes[i];
      }
    }
  }
  return closestNode;
}

function drawPath(path, sw, sc) {
  if (!sw) sw = 1;
  if (!sc) sc = [255, 255, 255, 255];
  if (!path || path.length < 2) return;
  //draw a line between each node in the path
  for (let i = 0; i < path.length - 1; i++) {
    stroke(sc);
    strokeWeight(sw);
    line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
  }
  line(path[0].x, path[0].y, path[path.length - 1].x, path[path.length - 1].y);
}

let tsp = new TSP();
let solvingType = "";

//p5js setup function
function setup() {
  frameRate(20);
  tsp.populateNodes(10);
  createCanvas(screenWidth, screenHeight);
  background(background_color);
}

//p5js draw function
function draw() {
  background(background_color);
  frameRate(parseInt(document.getElementById("speed").value));
  //display framerate on screen

  tsp.drawNodes();
  tsp.nextStep();
  tsp.drawShortestPath();

  //DEBUGGING INFO
  fill(255, 255, 255, 255);
  noStroke();
  textSize(20);
  text("FPS: " + frameRate().toFixed(2), 10, 20);
  //display tsp.shortestpath on screen rounded to two decimals
  if (tsp.shortestDistance) {
    text("Shortest Path: " + tsp.shortestDistance.toFixed(2), 10, 40);
  }
  text("Lower bound: " + tsp.lowerBound.toFixed(2), 10, 60);
  //display ratio between lower bound and shortest path on screen rounded to two decimals
  if (tsp.shortestDistance) {
    text(
      "Ratio: " + (tsp.shortestDistance / tsp.lowerBound).toFixed(2),
      10,
      80
    );
  }

  if (document.getElementById("algorithm").value == "aco") {
    document.getElementById("acoInput").style.visibility = "visible";
  } else {
    document.getElementById("acoInput").style.visibility = "hidden";
  }
}
