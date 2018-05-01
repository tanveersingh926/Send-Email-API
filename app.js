const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')
const port = 8081;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Allowing CORS
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// open CORS for a specific domain
var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.post('/send', cors(corsOptions),(req,res)=>{
    // Message to send to email
    if(req.headers.origin != "http://example.com"){
        res.status(403).send("You don't have permission to access.");
    } else {
        const output = `
            <p>You have a new message.</p>
            <h3>Contact Details</h3>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Company: ${req.body.company}</li>
                <li>Email: ${req.body.email}</li>
                <li>Phone: ${req.body.phone}</li>
            </ul>
            <h3>Message</h3>
            <p>${req.body.message}</p>
        `;


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'zkjoqsc35ez5klcm@ethereal.email', // generated ethereal user
                pass: 'p8a3hYx1cdT39ZXwhw'  // generated ethereal password
            },
            tls:{
            rejectUnauthorized:false
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Test email send API" tanveerxxxx@gmail.com', // sender address
            to: 'singhxxxx@gmail.com', // list of receivers
            subject: 'Node email API', // Subject line
            text: 'Node email API', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.status(200).send('Email has been sent');
        }); 
    }
})

app.listen(port, () => console.log('Server started at '+port))