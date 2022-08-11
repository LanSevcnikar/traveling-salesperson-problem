function simulateNAnts(d, r, a, b, g, n, nodes) {
  a = document.getElementById("ant_alpha").value;
  b = document.getElementById("ant_beta").value;
  g = document.getElementById("ant_decay").value;
  c = document.getElementById("ant_c").value;
  n = document.getElementById("ant_number").value;
  
  let p = [];
  let newR = [];
  console.log(r)
  for (let i = 0; i < d.length; i++) {
    p.push([]);
    newR.push([]);
    for (let j = 0; j < d.length; j++) {
      p[i].push(Math.pow(r[i][j], a) / Math.pow(d[i][j], b));
      newR[i].push(r[i][j] * (1-g));
    }
  }

  //given the current node and the visited nodes, find the next node to visit
  function chooseNext(curr, visited) {
    let nextOption = [];
    let sumOfIn = 0;
    //checks all that are an option
    for (let i = 0; i < nodes.length; i++) {
      if (!visited.has(i)) {
        nextOption.push([i, p[curr][i]]);
        sumOfIn += p[curr][i];
      }
    }
    let rand = Math.random() * sumOfIn;
    for (let i = 0; i < nextOption.length; i++) {
      rand -= nextOption[i][1];
      if (rand <= 0) {
        return nextOption[i][0];
      }
    }
  }

  function simAnt(start, curr, visited) {
    if (visited.size == nodes.length) {
      return [d[start][curr], [curr]];
    }
    let next = chooseNext(curr, visited);
    let total = 0;
    let path = [];
    [total, path] = simAnt(start, next, visited.add(next));
    path.push(curr);
    return [total + d[curr][next], path];
  }

  for (let k = 0; k < n; k++) {
    let start = Math.floor(Math.random() * nodes.length);
    let visited = new Set();
    visited.add(start);
    let total = 0;
    let path = [];
    [total, path] = simAnt(start, start, visited);
    total = Math.pow(total, 1.3);
    for (let i = 1; i < path.length; i++) {
      newR[path[i]][path[i - 1]] += c / total;
      newR[path[i - 1]][path[i]] += c / total;
    }
    newR[path[0]][path[path.length - 1]] += c / total;
    newR[path[path.length - 1]][path[0]] += c / total;
  }

  //console.log(newR);
  stroke(100);
  if (document.getElementById("ant_showTrails").checked) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        strokeWeight(newR[i][j] * 1);
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
  return newR;
}
