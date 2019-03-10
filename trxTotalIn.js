var redis = require('redis');
var client = redis.createClient(6379,"seoul-redis.bqjdlm.ng.0001.apn2.cache.amazonaws.com");

const express = require('express')
const app = express();
const port = 3000

var hasUpdate = false;

client.on('connect', function() {
    console.log('Redis client connected');
});

setInterval(()=>{
  let currDate = new Date();
  let currWeekDay = currDate.getUTCDay();
  let currHour = currDate.getUTCHours()
  let currMinute = currDate.getUTCMinutes()
  if (currWeekDay == 0 && currHour == 0 && currMinute < 5) {
    if(hasUpdate==false){
        updateDividend();
        hasUpdate = true;
    }
  } else {
      hasUpdate = false;
  }
},1000);



app.get('/', (req, res) => {
	console.log("get address");
    client.get('toatalinandout:gameid:10', function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
       // console.log('GET result ->' + result);
        res.send(result);
    });
    
});

function updateDividend(){
    client.get('toatalinandout:gameid:10', function (error, result) {
        var current_divident = (result.TotalIn-result.TotalOut)*0.7*0.2;
        var totalStats = {
            PlayerMined : result.PlayerMined,
            OtherMined : result.OtherMined,
            TotalIn : result.TotalIn,
            TotalOut : result.TotalOut+current_divident
        };
        console.log("updateDividend",JSON.stringify(totalStats));
        client.SET('toatalinandout:gameid:10', JSON.stringify(totalStats));
    });
}




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
