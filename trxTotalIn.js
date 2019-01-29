var redis = require('redis');
var client = redis.createClient();

const express = require('express')
const app = express()
const port = 3000

client.on('connect', function() {
    console.log('Redis client connected');
});

app.get('/trxTotalIn', (req, res) => {
    client.get('toatalinandout:gameid:10', function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('GET result ->' + result);
        res.send(result);
    });
    
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
