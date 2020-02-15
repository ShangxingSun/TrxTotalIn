const pfm = require("./sendMail")

pfm.postfixSend({
        msg: "this is a test",
        from: "shangxingsun@blockfish.io",
        to: "shangxingsun2019@gmail.com",
        subject: "test mail"
    }, (err)=>{
        console.log("err: ", err)
    })