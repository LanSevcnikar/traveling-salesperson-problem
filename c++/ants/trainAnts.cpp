#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstring>
#include <stdio.h>
#include <stdlib.h>
 
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
	for(const auto e : v) cout<<e<<"\n"; cout<<endl;
}

int main(int argc, char const *argv[]){
  int n, m;
  if(argc < 3){
    cout << "please enter n, m as args" << endl;
    return 0;
  }else{
    n = stoi(argv[1]);
    m = stoi(argv[2]);
  }

  double a = 1;
  double b = 2;
  double c = 1;
  double d = 0.01;

  double da = 0.15;
  double db = 0.15;
  double dc = 0.15;
  double dd = 0.0015;
  FOR(i,0,10){
    cout << i << "-th iteration" << endl;
    FOR(j,0,4){
      vector<double> results;
      vector<double> results1;
      vector<double> results2;
      FOR(k,1,m+1){
        string command = 
          "./AntTSP " 
          + to_string(a) + " " 
          + to_string(b) + " " 
          + to_string(c) + " " 
          + to_string(d) + 
          " 150 50 < \"../input/nodes" + 
          to_string(k) + 
          ".txt\" > \"temp/result" + 
          to_string(k) + ".txt\""; 
        string command1 = 
          "./AntTSP " 
          + to_string(a + (i == 0 ? da : 0)) + " " 
          + to_string(b + (i == 0 ? db : 0)) + " " 
          + to_string(c + (i == 0 ? dc : 0)) + " " 
          + to_string(d + (i == 0 ? dd : 0)) + 
          " 150 50 < \"../input/nodes" + 
          to_string(k) + 
          ".txt\" > \"temp/result" + 
          to_string(k) + ".txt\""; 
        string command2 = 
          "./AntTSP " 
          + to_string(a - (i == 0 ? da : 0)) + " " 
          + to_string(b - (i == 0 ? db : 0)) + " " 
          + to_string(c - (i == 0 ? dc : 0)) + " " 
          + to_string(d - (i == 0 ? dd : 0)) + 
          " 150 50 < \"../input/nodes" + 
          to_string(k) + 
          ".txt\" > \"temp/result" + 
          to_string(k) + ".txt\""; 


        system(command.c_str());
        string fileName = "temp/result" + to_string(k) + ".txt";
        ifstream file(fileName);
        double result;
        file >> result;
        results.pb(result);

        system(command1.c_str());
        ifstream file1(fileName);
        result;
        file1 >> result;
        results1.pb(result);

        system(command2.c_str());
        ifstream file2(fileName);
        result;
        file2 >> result;
        results2.pb(result);
      }

      double total0 = 0;
      double total1 = 0;
      double total2 = 0;

      FOR(k,0,m){
        total0 += results[k];
        total1 += results1[k];
        total2 += results2[k];
      }
      
      printf("total: %f, %f, %f, %f, %f, %f, %f\n", total0, total1, total2, a, b, c, d);

      if(total0 < total1 && total0 < total2){
        continue;
      }

      if(j == 0){
        if(total1 < total2){
          a += da;
        }
        else{
          a -= da;
        }
      }
      if(j == 1){
        if(total1 < total2){
          b += db;
        }
        else{
          b -= db;
        }
      }
      if(j == 2){
        if(total1 < total2){
          c += dc;
        }
        else{
          c -= dc;
        }
      }
      if(j == 3){
        if(total1 < total2){
          d += dd;
        }
        else{
          d -= dd;
        }
      }
    }
  }
}
