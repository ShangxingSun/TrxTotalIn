var redis = require('redis');
var client = redis.createClient(6379,"seoul-redis.bqjdlm.ng.0001.apn2.cache.amazonaws.com");
client.get('toatalinandout:gameid:10', function (error, result) {
    var current_divident = 227288.978000;
    var totalStats = {
        PlayerMined : result.PlayerMined,
        OtherMined : result.OtherMined,
        TotalIn : result.TotalIn,
        TotalOut : result.TotalOut+current_divident
    };
    console.log("updateDividend",JSON.stringify(totalStats));
    client.SET('toatalinandout:gameid:10', JSON.stringify(totalStats));
});