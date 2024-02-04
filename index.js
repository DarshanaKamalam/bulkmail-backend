const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://philomath:123@cluster0.rheumzn.mongodb.net/passkey?retryWrites=true&w=majority")
.then(function(){console.log("connected to DB...")})
.catch(function(){console.log("Failed to connect DB..")})

const credential = mongoose.model("credential",{},"bulkmail")


app.post("/sendmail", function (req, res) {
    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function(data){
        console.log(data[0].toJSON())
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass
            }
        })
        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: "kdarshanakamalam@gmail.com",
                        to: emailList[i],
                        subject: "Testing bulk mail app",
                        text: msg
                    })
                    console.log("Email sent to: " + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("failed")
            }
    
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
    })
    .catch(function(error){console.log(error)})
})

app.listen(5000, function () {
    console.log("Server started... ")
})