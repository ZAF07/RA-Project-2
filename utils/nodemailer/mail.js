/* eslint-disable no-console */
import nodemailer from 'nodemailer';

/**
 * Sends email to employer notifying of job interest
 * @param {int} user Employee id
 * @param {str} employerEmail Employer Email
 */
export const sendInterestMail = async function main(employeeId, employerEmail, employerId) {
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'halppsg@outlook.com',
      pass: 'halppsingapore00221199243',
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Halpp 🌟" <halppsg@outlook.com>', // sender address
    // to: `${employerEmail}`, // list of receivers
    to: 'zaffere07@gmail.com',
    subject: 'Your job received an interest! ✔', // Subject line
    text: `Good news! Looks like ${employeeId} is interested in your job!  `, // plain text body
    html: `<b>Good news! Looks like someone is interested in your job!
    <br> 
      Wow! Looks like someone is interested in your job! 😎
    </b>
    </b>
    employerId = ${employerId}
      employee ID -> ${employeeId}
      should send mail to ${employerEmail}
      <a href="https://arcane-fortress-47417.herokuapp.com/jobs/details/${employerId}">View your job here</a>
    </b>`, // html body
  });
  // --> employee ID ${user}
  //   --> should send mail to ${employerEmail}
  //   --> Link: http://localhost:3000/jobs/details/${employerId}
  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

/**
 * Sends email to employer notifying job completed
 * @param {int} user Employee id
 * @param {str} employerEmail Employer Email
 */
export const sendCompleteMail = async function main(employeeId, employerEmail, employerId) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'halppsg@outlook.com',
      pass: 'halppsingapore00221199243',
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Halpp 🌟" <halppsg@outlook.com>', // sender address
    // to: `${employerEmail}`, // list of receivers
    to: 'zaffere07@gmail.com',
    subject: 'Your booking is confirmed! ✔', // Subject line
    text: `Good news! Looks like ${employeeId} is interested in your job!  `, // plain text body
    html: `<b>Good news! Your guy is booked!
    <br> 
      Have a great time with you guy tonight! ♥️

    </b>
    </b>
      employerId = ${employerId}
      employee ID ${employeeId}
      should send mail to ${employerEmail}

      <a href="https://arcane-fortress-47417.herokuapp.com/jobs/details/${employerId}">View your job here</a>
    </b>`, // html body
  });
  // --> employee ID ${user}
  //   --> should send mail to ${employerEmail}
  //   --> Link: http://localhost:3000/jobs/details/${employerId}
  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
