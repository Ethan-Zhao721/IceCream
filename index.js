// business address (street, city) excerpt from a review of that business 
// name of the person that wrote the review business information should be 
// output in the order received from the API response
const axios = require('axios');
let icecreamShops = [];
const token = "hy8b79T_zjNFr1EcgBD90s8JDLxOamROtan_p1ouSgm6OPb36AqmFB0ORKLnF1sA7KGw0yvD26oloJeVmlIrFZYLV1J27eyjxkBmydJxjWeiCSTiURZXkaoZFIfUXXYx"
const AuthStr = 'Bearer ' + token;

function getIceCreamList (category='icecream', location='Alpharetta', sortName='rating', limitBy=5) {
      const URL = `https://api.yelp.com/v3/businesses/search?term=${category}&location=${location}&sort_by=${sortName}&limit=${limitBy}`;
      console.log(`\nThis is the list of top ${limitBy} ${category} shops around ${location} area\n`);
      return new Promise(function(resolve, reject) {
        axios.get(URL, { headers: { Authorization: AuthStr } })
          .then(response => {
            if(response){
              let data = response.data;
              data.businesses.forEach(function(el, index){
              getReviewInfo(el.id).then((res)=>{
              if(res){
                  console.log(` * Business name is: ${el.name}`);
                  console.log(` * Address is: ${el.location.display_address}`);
                  console.log(` * Rating is: ${el.rating}`);
                  console.log(` * User name is: ${res.name}`);
                  console.log(` * User text is: ${res.text} \n`);
                  resolve('Success');
                }            
              }).catch((error)=>{
                console.log('error ' + error);    
              });
            });
            }else{
              reject(`Not get the ${icecream} data`);
            }            
          })
          .catch((error) => {
            console.log('error ' + error);
          });
      })
  }

function getReviewInfo(id){
  const baseUrl = `https://api.yelp.com/v3/businesses/${id}/reviews`;
  return new Promise(function(resolve, reject) {
    axios.get(baseUrl, { headers: { Authorization: AuthStr } })
          .then(response => {
            let data = response.data;
            if(data){
              let review = data.reviews[0];
              let user = {
                "name": review.user.name,
                "text": review.text
            }
              if(user){
                resolve(user);    
              }               
            }else{
              reject('Not get review data');
            }                        
          })
          .catch((error) => {
            console.log('error ' + error);
      });
  })
}
function main (){
  getIceCreamList();
}
main();
