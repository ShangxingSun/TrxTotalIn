var redis = require('redis');
var client = redis.createClient();
client.get('toatalinandout:gameid:test', function (error, result) {
	console.log(result);
	result = JSON.parse(result);
    //var current_divident = (result.TotalIn-result.TotalOut)*0.7*0.2;
	
    var totalStats = {
        PlayerMined : 358561.25,
        OtherMined : 538187.1,
        TotalIn :50172320,
        TotalOut : 49079808.4496,
	TotalDivident: 418478.499
    };
    
    console.log(totalStats);
    console.log("updateDividend",JSON.stringify(totalStats));
    client.SET('toatalinandout:gameid:test', JSON.stringify(totalStats));
});
