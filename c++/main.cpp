#include <iostream>
#include <algorithm>
#include <vector>
#include<graphics.h>
#include <stack>
#include <set>
#include <queue>
#include <map>
#include <fstream>
#include <string.h>
#include <math.h> 
 
using namespace std;
typedef long long LL;
typedef long double LD;
typedef vector<LL> vi;
 
#define inf 999999999999;
#define FOR(i,n,m) for(LL i = n; i < m; i++)
#define pb push_back
#define mp make_pair
#define fs first
#define sc second
#define sz(x) (x).size()
#define all(v) (v).begin(),(v).end()
template<typename T> void PV(T v) {
	for(const auto e : v) cout<<e<<" "; cout<<endl;
}

struct Visited{
  int visited = 0;
  Visited(int v){
    visited = (1 << v);
  }
  bool hasVisited(int v){
    return (visited & (1 << v)) != 0;
  }

  void addNode(int v){
    visited |= (1 << v);
  }

  void removeNode(int v){
    visited &= ~(1 << v);
  }
};

struct Node{
  double x, y;
  int id;
  Node(double _x, double _y, int _id){
    x = _x;
    y = _y;
    id = _id;
  }
  Node(int _id){
    id = _id;
    //choose two random doubles between 0 and 800
    x = rand() % 800;
    y = rand() % 800;
  }
  Node(){
    id = -1;
    x = -1;
    y = -1;
  }
};

double distanceBetweenNodes(Node a, Node b){
  return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}

struct TSP{
  vector<Node> nodes;
  int n;
  TSP(int _n){
    n = _n;
    nodes.resize(n);
    for(int i = 0; i < n; i++){
      nodes[i] = Node(i);
    }
  }
  TSP(){
    n = 0;
  }
};


struct dynamicSolution{
  TSP tsp;
  int n;
  double d[50][50];
  double DP[20][33000];
  int next[20][33000];
  // Maximum 15 nodes

  dynamicSolution(TSP _tsp){
    tsp = _tsp;
    n = tsp.n;
    for(int i = 0; i < n; i++){
      for(int j = 0; j < n; j++){
          d[i][j] = distanceBetweenNodes(tsp.nodes[i], tsp.nodes[j]);
      }
    }
  }

  double rec(int curr, Visited visited){
    if(DP[curr][visited.visited] != -1){
      return DP[curr][visited.visited];
    }
    if(visited.visited == (1 << tsp.n) - 1){
      return d[curr][0];
    }

    double mn = 10000000;
    int nxt = -1;
    for(int i = 0; i < tsp.n; i++){
      if(visited.hasVisited(i)){
        continue;
      }
      visited.addNode(i);
      double dist = d[curr][i] + rec(i, visited);
      if(dist < mn){
        mn = dist;
        nxt = i;
      }
      visited.removeNode(i);
    }

    DP[curr][visited.visited] = mn;
    next[curr][visited.visited] = nxt;
    return mn;
  }

  pair<double, vector<Node>> solve(){
    for(int i = 0; i < n+1; i++){
      for(int j = 0; j < 33000; j++){
        DP[i][j] = -1;
        next[i][j] = -1;
      }
    }

    vector<Node> path;
    double ans = rec(0, Visited(0));
    int curr = 0;
    Visited visited(0);
    while(true){
      path.pb(tsp.nodes[curr]);
      curr = next[curr][visited.visited];
      if(curr == -1) break;
      visited.addNode(curr);
    }
    
    pair<double, vector<Node>> ansPair(ans, path);
    return ansPair;
  }
};


int main(int argc, char const *argv[]){
  int n, m;
  if(argc < 3){
    n = 15;
    m = 1;
  }else{
    n = atoi(argv[1]);
    m = atoi(argv[2]);
  }
  
  while(m--){
    TSP tsp = TSP(n);
    dynamicSolution ds(tsp);
    pair<double, vector<Node>> ans = ds.solve();
    cout<<"The minimum distance is "<<ans.fs<< " and the path is ";
    for(auto e : ans.sc){
      cout<<e.id<<" ";
    }
    cout<<endl;

  }
  cout << "Hello World!" << endl;
}