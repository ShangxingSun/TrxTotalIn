const request = require('request');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
const { logger } = require('./logger');


var redis = require('redis')
redis_client = redis.createClient();


MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
        if(err){
                logger.warn('数据库连接失败！'+ JSON.stringify(err));
                return;
        };


	request('https://tronhero.rovegas.com/totalTrxIn', { json: true }, (err, res, body) => {
                //console.log("err",err);
                //console.log("res",res);
                //console.log("body",body);
                if (err) { return console.log(err); }
                var totalIn = body.TotalIn;
				var totalOut = body.TotalOut;
       			 logger.info(JSON.stringify(body));
				var profit = Math.round((totalIn-totalOut)*1000000);
				logger.info("profit:"+profit);
                /*if (typeof(currentOthermined) == "undefined"){
                        console.log("undefined");
                        client.close();
                        return;
                }*/

	


	getStakeAllTotal("stakefinalalltotal", (data)=>{
    	var stakefinalalltotal = data.toString();
        logger.info("stakefinalalltotal in:"+stakefinalalltotal);

	
		var db = client.db('trondividend');

		var whereStr = {"name":"stakefinalalltotal"};

		db.collection("stakealltotal").find(whereStr).toArray(function(err, result) {
                  	if (err) throw err;

                  	//console.log(result);
                  	//console.log(result.length);
                  	if (result.length == 0){
                        	client.close();
                  	}
                  	else{
                        	//console.log("result[0].stake:",result[0].stake);
                        	stakefinalalltotal = result[0].stake;
				logger.info("stakefinalalltotal in:"+stakefinalalltotal);
				logger.info("====================>TronDividend: 总分红: "+ (profit*0.2*0.49)+" 总抵押:"+stakefinalalltotal+" 每10K分红: " + (1e4/stakefinalalltotal* profit*0.2*0.49));
                }
           	});




		db.collection("stakefinal").find().toArray(function(err, result) {
                        if (err) throw err;
			
			result.forEach(item=>{
                                //console.log("result",result);
				var tronAddr = item.owner;
				var stake = item.stake;


				var whereStr = {"tronAddr":tronAddr};  // 查询条件
                //console.log("item.tronAddr",tronAddr);
                //console.log("item.stake",stake);
				var dividend = Math.floor(stake/stakefinalalltotal*0.2*profit*0.49)
                var updateStr = {$inc: { "dividend" : dividend}};
				logger.info("updateStr: "+tronAddr+" string:"+JSON.stringify(updateStr));
                db.collection("dividend").updateOne(whereStr, updateStr,{upsert: true},function(err, res) {
                    if (err) throw err;
                    logger.info("update successfully: "+item.owner+" "+item.stake,dividend);
                    client.close();
                });

					
			});
		});
	});
	});
});



function getStakeAllTotal(name,callback){
        redis_client.get(name, function (err, reply) {
                console.log(reply.toString());
                var result = reply.toString();
                callback(result);
	});
}
