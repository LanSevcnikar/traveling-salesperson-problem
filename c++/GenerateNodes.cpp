#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <set>
#include <queue>
#include <map>
#include <fstream>
#include <string.h>
#include <math.h> 
#include <stdio.h>
#include <stdlib.h>
#include <string>
 
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

int main(int argc, char const *argv[]){
  int n, x;
  if(argc < 3){
    cout << "please enter n, x as args" << endl;
    return 0;
  }else{
    n = stoi(argv[1]);
    x = stoi(argv[2]);
  }
  
  cout << n << endl;
    //print into file two numbers between 0 and x random
  FOR(i,0,n){
    cout << rand() % x << " " << rand() % x << endl;
  }
}