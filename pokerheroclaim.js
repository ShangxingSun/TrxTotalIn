const BigNumber = require('bignumber.js');

const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;

const TRONNODE = "https://api.trongrid.io";
const fullNode = new HttpProvider(TRONNODE);
const solidityNode = new HttpProvider(TRONNODE);
const eventServer = TRONNODE;
const privateKey = process.env.CONTRACT_KEY; 
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

function claim() {
    const gameContractAddress = "TCUM5Dx3A5PVqnBDYtZAgdZhW2sqxMYTMC";
        tronWeb.contract().at(gameContractAddress).then(ctr=>{
            if (ctr == null) {
                logger.error("fail to get game contract");
            } else {
                console.log("try to claim TRX from game contract");
                ctr.claim(273127000000).send();
            }
        }).catch(e=>{
            logger.error("get contract exception:", e);
        });
}

//claim();