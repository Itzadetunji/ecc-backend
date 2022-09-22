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
  const email = req.body

  db.collection('waitlist')
    .insertOne(email)
    .then((result) => {
      sendMail(req,res)
    })
    .catch(err =>  {return res.status(500).json({error: "Could not create a new document"})})
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
    <div style="margin: 10px auto; text-align: center;">
      <svg width="66" height="23" viewBox="0 0 66 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2558 13.7183C15.7217 15.5783 11.7359 16.0301 7.72345 15.9769C7.37801 15.9769 7.35143 16.6678 7.53744 16.9601C11.3904 19.1922 17.7678 16.8538 21.4879 15.1C22.1257 14.8078 22.604 15.6049 22.2851 16.2958C20.5047 20.3348 11.8422 22.6732 7.6703 22.062C4.4019 21.3711 2.06354 19.8565 0.814636 17.5181C-0.0356794 15.9238 -0.0622517 14.5686 0.0440376 12.7883C0.123755 11.4596 0.41605 10.2639 1.00064 9.06812C1.26637 8.5101 1.63838 7.73951 1.98382 7.23463C12.347 -8.44306 35.8636 4.94941 19.2558 13.7449V13.7183ZM8.9192 8.0318C9.45065 7.34092 10.115 6.7829 10.7261 6.33117C11.3373 5.90601 11.8687 5.61372 12.4799 5.34799C13.0911 5.10884 13.7819 4.89626 14.4462 4.89626C15.1106 4.89626 15.7483 5.13542 16.2 5.42771C16.6518 5.72001 16.9175 6.03887 17.1035 6.38432C17.2629 6.72976 17.3426 7.04862 17.3426 7.39406C17.3426 7.73951 17.2629 8.08495 17.1035 8.40381C16.9175 8.72268 16.6518 8.98841 16.1203 9.30727C15.5889 9.62614 14.7651 9.99815 13.9945 10.2905C13.2239 10.5827 12.4533 10.8219 11.6827 11.0079C10.8856 11.1939 10.0884 11.3268 9.47722 11.4065C8.86606 11.4596 8.49404 11.4596 8.20175 11.2471C7.90945 11.061 7.75002 10.6625 7.85631 10.0779C7.9626 9.49328 8.38775 8.72268 8.9192 8.0318Z" fill="#2C65AE"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.8063 20.6533C41.2873 20.6533 43.7054 19.3513 45.1137 17.943L44.4228 17.2521C44.0508 16.8801 43.7054 16.5346 43.3865 16.2423C43.1208 15.9766 42.8816 15.7375 42.6691 15.5249C42.4565 15.3123 42.2439 15.1263 42.0579 14.9403C41.739 14.6214 41.4467 14.3557 41.2076 14.1165L41.1013 14.0103C40.5433 14.5151 39.8524 14.8871 39.0286 15.0466C38.5769 15.1794 38.1252 15.2326 37.6469 15.2326C34.8568 15.2326 32.6247 13.0537 32.6247 10.3433C32.6247 7.63289 34.8834 5.45396 37.6469 5.45396C38.0986 5.45396 38.5503 5.50711 38.9489 5.6134C39.8258 5.74626 40.5698 6.11827 41.1544 6.64972L41.2341 6.57C41.4733 6.33085 41.7656 6.06513 42.0845 5.74626C42.2705 5.56025 42.4565 5.37424 42.6956 5.16167C42.9082 4.94909 43.1474 4.70994 43.4131 4.44421C43.7319 4.15192 44.0774 3.80648 44.4494 3.43446L45.1669 2.74358C43.7585 1.30868 41.3404 0.0332031 37.8595 0.0332031C31.6947 0.0332031 27.0977 4.20506 27.0977 10.3433C27.0977 16.5346 31.6947 20.7065 37.8595 20.7065L37.8063 20.6533Z" fill="#2966AF"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M57.7614 20.6533C61.2424 20.6533 63.6604 19.3513 65.0688 17.943L64.3779 17.2521C64.0059 16.8801 63.6605 16.5346 63.3416 16.2423C63.0759 15.9766 62.8367 15.7375 62.6241 15.5249C62.4115 15.3123 62.199 15.1263 62.013 14.9403C61.6941 14.6214 61.4018 14.3557 61.1627 14.1165L61.0564 14.0103C60.4983 14.5151 59.8075 14.8871 58.9837 15.0466C58.532 15.1794 58.0803 15.2326 57.602 15.2326C54.8119 15.2326 52.5798 13.0537 52.5798 10.3433C52.5798 7.63289 54.8384 5.45396 57.602 5.45396C58.0537 5.45396 58.5054 5.50711 58.904 5.6134C59.7809 5.74626 60.5249 6.11827 61.1095 6.64972L61.1892 6.57C61.4284 6.33085 61.7207 6.06513 62.0395 5.74626C62.2255 5.56025 62.4115 5.37424 62.6507 5.16167C62.8633 4.94909 63.1024 4.70994 63.3682 4.44421C63.687 4.15192 64.0325 3.80648 64.4045 3.43446L65.1219 2.74358C63.7136 1.30868 61.2955 0.0332031 57.8145 0.0332031C51.6497 0.0332031 47.0527 4.20506 47.0527 10.3433C47.0527 16.5346 51.6497 20.7065 57.8145 20.7065L57.7614 20.6533Z" fill="#2C65AE"/>
      </svg>
      <div style="text-align: left;">
        <p style="font-size: 12px; ">Hi there,</p>
        <p style="font-size: 12px; ">Thank you! You&apos;ve been added to the 
          e-commerce complaint waitlist.</p>
        <p style="font-size: 12px; ">We are on a mission to make shopping experi
          ence better for consumers by empowering 
          them with the tools and resources to avoid 
          common scams and make money online pur
          chase as smooth as possible. We are solely 
          driven by the lines of thought that business is 
          not just a transaction but a relationship that 
          allows both parties to benefit.
          <br>
          Tell your friends about e-commerce complaint
          by sharing our link.</p>
        <p>Yours Sincerely <br><span style="color: #0B63C5;">TEAM ECC</span></p>
      </div>
      <div style="margin: 20px auto;">
        <a href="https://main.d2cdxlo4ga9bsf.amplifyapp.com/" style="cursor: pointer;" target="_blank">
          <button style="width: 118px; height: 40px; border: none; background-color: #0B63C5; border-radius: 10px; color: white; cursor: pointer;">Share Link</button>
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
