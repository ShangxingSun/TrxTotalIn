#here is what runDividendTest2.sh do: It will run the following scripts in sequence, each in 10s interval.
--by shangxing
----
### runDividendTest2.js
This script 
1. get profit from trxTotalIn api
2. get finalstakealltotal( which means all valid staked tmev) from mangodb
3. calculate each user's profit
4. update each user's total profit in mangodb

----
### runMergeTest2.js
1. add each user's new staked tmev into his total staked mev 
2. update total tmev staked
3. send new staked mev to account TGsceyaevZPMjpadWM8KodCQmNV4RKnJv8
----
### TrxDividend.js
1. calculate profit and total trx number which need to be claimed from contract, then update total profit
2. claim trx from contract
3. send trx to dividend account
