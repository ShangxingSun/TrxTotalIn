var redis = require('redis');
var schedule = require('node-schedule')
var client = redis.createClient(6379,"seoul-redis.bqjdlm.ng.0001.apn2.cache.amazonaws.com");

const express = require('express')
const app = express();
const port = 3000

const BigNumber = require('bignumber.js');

const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;

const TRONNODE = "https://api.trongrid.io";
const fullNode = new HttpProvider(TRONNODE);
const solidityNode = new HttpProvider(TRONNODE);
const eventServer = TRONNODE;
const privateKey = process.env.CONTRACT_KEY; 
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

client.on('connect', function() {
    console.log('Redis client connected');
});


updateDividend();


/*
var j = schedule.scheduleJob('0 5 0 * * 0', function() {
	    //autoClear();
	//    saveBeforeClear(()=>{
	//          autoClear();
	//              })
		updateDividend();
	 });
*/



function claim(value) {
    value = Math.round(value*1e6);
    const gameContractAddress = "TCUM5Dx3A5PVqnBDYtZAgdZhW2sqxMYTMC";
        tronWeb.contract().at(gameContractAddress).then(ctr=>{
            if (ctr == null) {
                logger.error("fail to get game contract");
            } else {
                console.log("try to claim TRX from game contract");
                ctr.claim(value).send();
            }
        }).catch(e=>{
            logger.error("get contract exception:", e);
        });
}

function updateDividend(){
    client.get('toatalinandout:gameid:10', function (error, result) {
	console.log(result);
	result = JSON.parse(result);
        var current_divident = (result.TotalIn-result.TotalOut)*0.7*0.2;
        var claim_value = (result.TotalIn-result.TotalOut)*0.2;
        result.TotalOut = result.TotalOut+claim_value;
        result.TotalDivident = result.TotalDivident+current_divident;
        console.log("updateDividend",JSON.stringify(totalStats));
        client.SET('toatalinandout:gameid:10', JSON.stringify(result));
        claim(claim_value);
    });
}



