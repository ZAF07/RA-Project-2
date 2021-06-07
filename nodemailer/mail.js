import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export default async function main(user, employerEmail) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'halppsg@outlook.com',
      pass: 'halppsingapore00221199243',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Halpp 🌟" <halppsg@outlook.com>', // sender address
    to: 'zaffere07@gmail.com', // list of receivers
    subject: 'Your job received an interest! ✔', // Subject line
    text: `Good news! Looks like ${user} is interested in your job!  `, // plain text body
    html: `<b>Good news! Looks like someone is interested in your job!
    <br> 
    --> employee ID ${user}
    --> should send mail to ${employerEmail}
    --> Link: http://localhost:3000/jobs/details/${user}
    </b>`, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
