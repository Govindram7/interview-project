
const nodemailer = require('nodemailer');
//1. cofigure mail and send it
const sendMail = async(data,req,res)=>{
   const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.emailUserid,
            pass: process.env.emailPassword
        }
    })

    //2. send email
    try {
       const result = await transporter.sendMail({
        from:'lk2gurjar@gmail.com',
        to:data.To,
        subject: data.subject,
        text: data.text,
        html:data.html
    });
       console.log('Eamil sent successfully on this gmail is : ',result.accepted)
  
    } catch (error) {
        console.log('Email send failed with error:', error)
    }
}

module.exports = sendMail;

