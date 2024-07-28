var express= require("express");
var mysql2= require("mysql2");
var fileuploader= require("express-fileupload");
// const { CLIENT_RENEG_LIMIT } = require("tls");

let app= express();

app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileuploader());

app.listen(1350,function()
{
    console.log("Server Started Ji :-) ")
})

//----------Connecting Database--------------

// let config = {

//     host:"127.0.0.1",
//     user:"root",
//     password:"kabaddi@2511",
//     database:"project",
//     dateStrings: true
// }

let config = {

    host:"bvgyfdyiedezos4ovyfp-mysql.services.clever-cloud.com",
    user:"uqyf490n8n32nf63",
    password:"aW4OwBFDsSaWmSmv3DP3",
    database:"bvgyfdyiedezos4ovyfp",
    dateStrings: true,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
}

var mysql= mysql2.createConnection(config);

mysql.connect(function(err)
{
    if(err==null)
    {
        console.log("Connected to Database Successfully !!");
    }
    else
    {
        console.log(err.message +"iludbc");
    }
})

//--------------------------------------------------


app.get("/",function(req,resp){

    let path= __dirname + "/public/index.html";
    resp.sendFile(path);

})


app.get("/user-signup",function(req,resp){
// console.log(req.query);
    
    mysql.query("insert into users(email,pwd,utype) values (?,?,?)",[req.query.txtsemail,req.query.txtspwd,req.query.typesselect],function(err){

        if(err==null)
        {
            console.log("Bahut Bahut Badhaii !!");
            resp.send("SignUp Successfull");
        }

        else
        {
            console.log(err.message+"iludbsi");
            resp.send(err.message);
        }

    })

})


app.get("/user-login",function(req,resp){

    // console.log(req.query);

    mysql.query("select status,utype from users where email=? and pwd=?",[req.query.txtlemail,req.query.txtlpwd],function(err,result){

        if(err==null)
        {
            if(result.length==0)
            {
                resp.send("Invalid Email or Password");
            }
            else if(result[0].status==1)
            { 
                resp.send("Logged In Successfully  "+result[0].utype);
            
            }    
            else
            {    
                resp.send("Sorry, you are blocked");
            }
        }
        else
        {
            resp.send(err.message+"ilu");
        }
    })

})

app.get("/influencer-dashboard",function(req,resp){

    let path= __dirname+"/public/infl-dash.html";
    resp.sendFile(path);

})

app.get("/influencer-finder",function(req,resp){

    let path= __dirname+"/public/infl-finder.html";
    resp.sendFile(path);

})

app.get("/index-page",function(req,resp){

    let path= __dirname+"/public/index.html";
    resp.sendFile(path);

})

app.get("/influencer-profile",function(req,resp){

    let path= __dirname+"/public/inf-profile.html";
    resp.sendFile(path);
})

app.post("/influencer-save",function(req,resp){

    let fileName="";
    if(req.files!=null)
        {
            fileName=req.files.photo.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.photo.mv(path);
        }
        else
        fileName="nopic.jpg";

    req.body.photo=fileName;
    console.log(req.body);
    // console.log(req.fileName);

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtemailinf,req.body.txtnameinf,req.body.txtgenderinf,req.body.dobinf,req.body.txtaddinf,req.body.txtcityinf,req.body.txtphninf,req.body.listcategoryi.toString(),req.body.txtinstainf,req.body.txtlinkedinf,req.body.txtyoutubeinf,req.body.txtotherinfoi,fileName],function(err)
    {
            if(err==null)
                    resp.send("Bahut Bahut Badhai.....");
                else
                    resp.send(err.message);
    })

})

app.get("/infl-bookings", function (req, resp) {
    // console.log(req.query);
    let x=2;
    mysql.query("insert into events values(?,?,?,?,?,?,?)",[x,req.query.txtpbemail,req.query.txtpbevent,req.query.txtpbdate,req.query.txtpbtime,req.query.txtpbcity,req.query.txtpbvenue],function(err){
        if(err==null)
            resp.send("Booking posted");
        else
            resp.send(err.message);
    })

})

app.get("/reset-pwd", function (req, resp) {
    console.log(req.query);
    let email = req.query.txtsettingsemail;
    let str = "";
    mysql.query("select pwd from users where email=?", [email], function (err, jsonAry) {
        if (err == null) {
            console.log("Congratulations");
        }
        else
            console.log(err.message);

        if (jsonAry.length == 0) {
            console.log("Incorrect Email")
        }
        else if (jsonAry.length == 1) {
            if (jsonAry[0].pwd != req.query.txtoldpwd) {
                console.log("Incorrect Password");
            }

            if (req.query.txtnewpwd == req.query.txtnewcpwd) {
                console.log("Password being Updated");

                mysql.query("update users set pwd=? where email=?", [req.query.txtnewpwd, email], function (err) {
                    if (err == null)
                        resp.send("Password Updates")
                    else
                        resp.send(err.message);
                })
            }
            else {
                console.log("Try Again");
            }
        }
    })

})

