var email   = require("emailjs");

 function postfixSend(emailInfo, callback) {

    var server  = email.server.connect({
        user:    "shangxingsun@blockfish.io", 
        password: "jttpuizpsoenovqn", 
        host:    "smtp.gmail.com", 
        ssl:     true
    });

    server.send({
        text:    emailInfo.msg, 
        from:    emailInfo.from, 
        to:      emailInfo.to,
        subject: emailInfo.subject
        }, function(err, message) {
            callback(err);
    });

}

exports.postfixSend = postfixSend;

// postfixSend({
//     msg: "this is a test",
//     from: "getenjoy2019@gmail.com",
//     to: "danyang@blockfish.io",
//     subject: "test mail"
// }, (err)=>{
//     console.log("err: ", err)
// })


