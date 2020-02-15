var redis = require('redis');
var schedule = require('node-schedule')
const { logger } = require('./logger');

var client = redis.createClient(6379, 'seoul-redis.bqjdlm.ng.0001.apn2.cache.amazonaws.com');
//var client = redis.createClient();

const express = require('express')
const app = express();
const port = 3000

//const BigNumber = require('bignumber.js');

const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;

const TRONNODE = "https://api.trongrid.io";
const fullNode = new HttpProvider(TRONNODE);
const solidityNode = new HttpProvider(TRONNODE);
const eventServer = TRONNODE;
const privateKey = "aae9e4502f28e06b8d086a1b952affe1dddf6b89e8cb4613ca9bf2c219747c47";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

client.on('connect', function () {
	logger.info('Redis client connected');
	setTimeout(() => {
		updateDividend();
	}, 20000);
});


//claim(1);

async function transferTrx(value){
	value = Math.round(value*0.5)
	const sendTransaction = await tronWeb.transactionBuilder.sendTrx("TDR17tL4gcLzYhUGuAGH4zpknZKaZaDmcb", value);
	const signedTransaction = await tronWeb.trx.sign(sendTransaction);
	const sendRaw = await tronWeb.trx.sendRawTransaction(signedTransaction);
	client.rpush("totaldivident:history", JSON.stringify(Date.now()+": "+value+":"+sendRaw.transaction.txID), ()=>{});
	logger.info("totaldivident:history: "+JSON.stringify(Date.now()+": "+value+":"+sendRaw.transaction.txID));
}

function claim(value) {
	value = Math.round(value * 1e6);	
	//console.log(value);
	const gameContractAddress = "TJH7Vq8UDeX6WQ3yc4SncNjwgieCH4uJa7";
	tronWeb.contract().at(gameContractAddress).then(ctr => {
		if (ctr == null) {
			logger.warn("fail to get game contract");
		} else {
			logger.info("try to claim TRX from game contract");
			ctr.claim(value).send().then((res)=>{
				logger.info("claim result "+res);
				setTimeout(()=>{
					transferTrx(value);
				},10000);
			});

		}
	}).catch(e => {
		logger.warn("get contract exception: "+JSON.stringify(e));
	});
}

function updateDividend() {
	client.get('toatalinandout:gameid:10', function (err1, resultStr) {
		client.get("totalinandout:game:blackjack",(err2,bjStr)=>{
			client.get("totalinandout:game:jackorbetter",(err3,jbStr)=>{
				if(err1!=null||err2!=null||err3!=null){
					logger.warn("read data from redis error!");
					return;
				}
				logger.info("gameid:10"+resultStr);
				logger.info("gameid:blackjack"+jbStr);
				logger.info("gameid:jackorbetter"+bjStr);

				result = JSON.parse(resultStr);

				bj = JSON.parse(bjStr);
				jb = JSON.parse(jbStr);

				
				var sumIn = result.TotalIn + bj.TotalIn + jb.TotalIn;
				var sumOut = result.TotalOut + bj.TotalOut + jb.TotalOut;
					
				var current_divident = (sumIn - sumOut) * 0.5 * 0.2;
				var claim_value = (sumIn - sumOut) * 0.2;
				if(claim_value<0){
					logger.warn("error!"+claim_value);
					return;
				}
				logger.info("totalclaim "+claim_value);
				result.TotalOut = result.TotalOut + claim_value;
				result.TotalDivident = result.TotalDivident + current_divident;
				logger.info("updateDividend "+JSON.stringify(result));
				client.SET('toatalinandout:gameid:10', JSON.stringify(result));
				claim(claim_value);
				//claim(1);
			});
		});
	});

}



