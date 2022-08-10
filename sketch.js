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

  solve(alg, an) {
    this.stepCount = -1;
    this.solvingType = "";
    if (alg == "naive") {
      this.solveNaive(an);
    }
    if (alg == "greedy") {
      this.solveGreedy(an);
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
  }

  nextStep() {
    if (this.stepCount != -1) {
      this.stepCount++;
      if (this.solvingType == "naive") {
        this.evaluatePermutation(this.allPermutationsOfNodes[this.stepCount]);
        if (this.stepCount == this.allPermutationsOfNodes.length) {
          this.stepCount = -1;
          this.solvingType = "";
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
    }
  }

  calculateShortestDistance() {
    this.shortestDistance = 0;
    for (let i = 0; i < this.shortestPath.length; i++) {
      this.shortestDistance += this.shortestPath[i].distanceTo(
        this.shortestPath[(i + 1) % this.shortestPath.length]
      );
    }
    this.shortestDistance += this.shortestPath[0].distanceTo(
      this.shortestPath[this.shortestPath.length - 1]
    );
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
    this.allPermutationsOfNodes = permutations(this.nodes);
    if(!this.allPermutationsOfNodes) return;
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "naive";
    } else {
      //solve tsp with brute force
      for (let i = 0; i < this.allPermutationsOfNodes.length; i++) {
        this.evaluatePermutation(this.allPermutationsOfNodes[i]);
        //console.log(i / this.allPermutationsOfNodes.length);
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
    //draw a circle at the x and y coordinate
    fill(255, 255, 255, 255);
    ellipse(this.x, this.y, 10, 10);
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
  return permute(inputArr);
}

function closestNodeToNodeNotINArray(node, array, nodes) {
  console.log(node, array, nodes);
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
  tsp.populateNodes(6);
  createCanvas(screenWidth, screenHeight);
  background(background_color);
}

//p5js draw function
function draw() {
  background(background_color);
  frameRate(1000);
  //display framerate on screen
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

  tsp.drawNodes();
  tsp.nextStep();
  tsp.drawShortestPath();
}
