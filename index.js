const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express()
app.use(express.json())
let port = process.env.PORT || 3001;

//db connection
let db
connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log("App listening on port 3001")
    })
    db = getDb()
  }
})

// app.listen(port, () => {
//   console.log("App listening on port 3001")
// })

app.use(cors());

app.post('/waitlist', async (req,res) => {
  const email = req.body.email;
  const time = new Date();
  if (db.waitlist.find( { email} ).count() > 1){
    db.collection('waitlist')
      .insertOne({email, time})
      .then((result) => {
        sendMail(req,res)
      })
      .catch(err =>  {return res.status(500).json({error: "Could not create a new document"})})
  }
  else{
    return res.status(303);
  }
})

async function sendMail(req,res) {
  if (!req.body.email) {
    return res.status(400).json({ error: "All fields are required" });
  }
  //Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "konfampay@gmail.com",
      pass: "btqipojwgkmohsna",
    },
  });

  // Create mail options
  const mailOptions = {
    from: "konfampay@gmail.com",
    to: req.body.email,
    replyTo: "konfampay@gmail.com",
    subject: `ECC waitlist 🎉`,
    text: "ECC Waitlist",
    html: `
    <div style="margin: 10px auto; text-align: center; background-color: #F1F7FE; padding: 10px; max-width: 640px; font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;">
      <div style="text-align: left;">
        <p style="font-size: 12px; ">Hi there,</p>
        <p style="font-size: 12px; ">Thank you! You&apos;ve been added to the 
          e-commerce complaint waitlist.</p>
        <p style="font-size: 12px; line-height: 20px;">We are on a mission to make shopping experience better for consumers by empowering them with the tools and resources to avoid common scams and make money online purchase as smooth as possible. We are solely driven by the lines of thought that business is not just a transaction but a relationship that allows both parties to benefit.<br>Tell your friends about e-commerce complaint by sharing our link.</p>
        <p style="margin-bottom: 0px;">Yours Sincerely</p>
        <p style="color: #0B63C5; margin-top: 5px;">TEAM ECC</p>
      </div>
      <div style="margin: 20px auto;">
        <a href="https://main.d2cdxlo4ga9bsf.amplifyapp.com/" style="cursor: pointer;" target="_blank">
          <button style="width: 118px; height: 40px; border: none; background-color: #0B63C5; border-radius: 4px; color: white; cursor: pointer;">Share Link</button>
        </a>
      </div>
    </div>
    `,
  };
  try {
    // Send email
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(201).json({ message: "Email sent" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

app.get("/waitlist", (req,res) => {
  let waitlist = []
  //reference a document in the database
  db.collection('waitlist')
    .find()
    .sort({ email: 1 })
    .forEach(email => waitlist.push(email))
    .then(() => {
      res.status(200).json(waitlist)
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch the documents' })
    })
})
