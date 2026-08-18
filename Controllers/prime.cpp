// Online C++ compiler to run C++ program online
#include <iostream>
#include <vector>
using namespace std;

 // function
   bool isPrime(int n){
     for(int a = 2; a*a<=n; a++){
        if(n%a == 0){
            return true;
        }
     }
     return false;
   }

int main() {
    // Write C++ code here
    int n = 20;
 vector<bool> Primes(n,true);
      int count = 1;

      for(int a = 2; a<n ; a++){

        if(!Primes[a]){
            continue;
        }
     
        else if(isPrime(a)){
            count++;
            for(int b = a*2; b<=n; b =+ a){
               Primes[b] = false;
            }
        } else{
            Primes[a] = false;
        }
      }

       cout<<count;

   

}