var redis = require('redis');
var client = redis.createClient(6379,"seoul-redis.bqjdlm.ng.0001.apn2.cache.amazonaws.com");
client.get('toatalinandout:gameid:10', function (error, result) {
	console.log(result);
	result = JSON.parse(result);
    var current_divident = (result.TotalIn-result.TotalOut)*0.7*0.2;

   	/* 
    var totalStats = {
        PlayerMined : result.PlayerMined,
        OtherMined : result.OtherMined,
        TotalIn :result.TotalIn,
        TotalOut : result.TotalOut+current_divident/0.7*0.3,
	TotalDivident: current_divident+result.TotalDivident
    };
 	*/
	
    var totalStats = {
        PlayerMined : 358561.25,
        OtherMined : 538187.1,
        TotalIn :50172320,
        TotalOut : 49079808.4496,
	TotalDivident: 418478.499
    };
    
    console.log(totalStats);
    console.log("updateDividend",JSON.stringify(totalStats));
    client.SET('toatalinandout:gameid:10', JSON.stringify(totalStats));
});
