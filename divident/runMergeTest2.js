var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
const fs = require('fs');
const { logger } = require('./logger');


const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;

const TRONNODE = "https://api.trongrid.io";
const fullNode = new HttpProvider(TRONNODE);
const solidityNode = new HttpProvider(TRONNODE);
const eventServer = TRONNODE;
//const privateKey = "ab8da504a23cc84127f71b9d1a16b2ef14085a6d907a2a633d604489b5415b10";
const privateKey = "bd95fb0e0a68b71b13e885dd3df848eaa33d63cce76a66671c78b7567ecccdbf";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
setTimeout(()=>{
    mergeTest();
},10000);

function mergeTest(){
    MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
        if(err){
                logger.warn('数据库连接失败！');
                return;
        };


    var db = client.db('trondividend');

    //the following function clears the stake table of this week and add its number to total stake table 

    db.collection("stake").find().toArray(function(err, result) {
                    if (err) throw err;
        
        result.forEach(item=>{
                            //console.log("result",result);
            var owner = item.owner;
            var stake = item.stake;
            //console.log("owner",owner,"stake".stake);
            var whereStr = {"owner":owner}; 
            logger.info("尝试数据插入stakefinal"+owner+" "+stake);
//
            db.collection("stakefinal").find(whereStr).toArray(function(err, result) {
            	if (result.length == 0){
                                    	//logger.info("owner "+owner+" stake "+stake);
                                    	db.collection('stakefinal').insertOne({"owner":owner,"stake":stake},(err,result)=>{
                                            	if(err){
                                                    	logger.warn('数据插入失败！');
                                                    	client.close();
                                                    	return;
                                            	};

                                            	//console.log(result);
                                            	logger.info("数据插入stakefinal成功"+owner+" "+stake);

            			//stake清零
            			//client.close();
                                    	});

                            	}
                            	else{
                                    	var whereStr = {"owner":owner};  // 查询条件
                                    	//console.log("item.owner",owner);
                                    	//console.log("item.stake",owner);
                                    	var updateStr = {$inc: { "stake" : item.stake }};
                                    db.collection("stakefinal").updateOne(whereStr, updateStr, function(err, res) {
                                           if (err) throw err;
                                    	logger.info("update successfully"+item.owner+" "+item.stake);
                            //      client.close();
                                    });

            	}

                var whereStr = {"owner":owner};  // 查询条件
                                   // console.log("item.owner",owner);
                                   //console.log("item.stake",owner);
                                   	var updateStr = {$set: { "stake" : 0 }};
                
                db.collection("stake").updateOne(whereStr, updateStr, function(err, res) {
                                           if (err) throw err;
                                            logger.info("stake table clear successfully");
                                   // client.close();
                                    });

            });
//
        
        });
    
    
    
    
    
    });


    //update stake final all total table to record total stake number
    db.collection("stakealltotal").find().toArray(function(err, result) {
                    if (err) throw err;

        var whereStr = {"name":"stakefinalalltotal"};  // 查询条件
        //console.log("result[0].stake",result[0].stake);
        //console.log("result[1].stake",result[1].stake);
        var updateStr = {$set: { "stake" : result[0].stake+result[1].stake }};
        
        logger.info("stakefinalalltotal update successfully"+result[0].stake+" "+result[1].stake);
//			
        db.collection("stakealltotal").updateOne(whereStr, updateStr, function(err, res) {
            		if (err) throw err;
            		logger.info("stakefinalalltotal update successfully"+result[0].stake+" "+result[1].stake);
        });


         const stakeFinalAddr = "TGsceyaevZPMjpadWM8KodCQmNV4RKnJv8";
         const tmevContractAddress = "TUE1tNZd8drQCemnTdBLXBSPJnQomNB2ju";


        tronWeb.contract().at(tmevContractAddress).then(ctr=>{
                    if (ctr == null) {
                            logger.error("fail to get tmev contract");
                    } else {
                            logger.info("transfer mev: "+result[0].stake);
                            //console.log("transfer return",ctr.transfer(stakeFinalAddr,1).send());
                            ctr.transfer(stakeFinalAddr,result[0].stake).send().then(data=>{console.log(data)});
                    }
            }).catch(e=>{
                            //console.log("error",e);
                            logger.error("get contract exception:"+JSON.stringify(e));
            });


        // //not actually working code
        // whereStr = {"name":"stakealltotal"};  // 查询条件
                  //  console.log("result[0].stake",result[0].stake);
                  //  console.log("result[1].stake",result[1].stake);
                    var updateStr = {$set: { "stake" : 0 }};
        
        db.collection("stakealltotal").updateOne(whereStr, updateStr, function(err, res) {
                            if (err) throw err;
                            console.log("update successfully",result[0].stake,result[1].stake);
        			});
//
    });


            


});

}
