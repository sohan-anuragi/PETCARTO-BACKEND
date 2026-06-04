# include <iostream>
# include <vector>
using namespace std;

int main(){

  vector<int> nums = {10, 5, 8, 2,  6, 4};
  int n = nums.size();
 
  for(int a = 0; a<n-1; a++){
     int SI = a;
     for(int b = a; b<n; b++){
      if(nums[b]< nums[SI]){
        SI = b;
      }
     }
     swap(nums[SI],nums[a]);
  }

  for(int k = 0; k<n; k++){
    cout<<nums[k]<<", ";
  }
 

  return 0;
}