require("dotenv").config();
const tw_acc_sid = process.env.TWILIO_ACCOUNT_SID;
const tw_auth_token = process.env.TWILIO_AUTH_TOKEN;
const tw_number = process.env.TWILIO_NUMBER;

const client = require("twilio")(tw_acc_sid, tw_auth_token);
function sendSms(number,otp) {
    client.messages
  .create({
    body: `Hello from twilio your access code is ${otp}`,
    to: number, // Text this number
    from: tw_number, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

module.exports = {sendSms};
