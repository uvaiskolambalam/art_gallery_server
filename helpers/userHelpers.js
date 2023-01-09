// "AC9aa030d08ef3dc18933486841b234059",
// "d38ff446639127d15b6d93b40dec156e"
// const serviceId = "VAabb443ddb86ac9db96bfa19ef0992f0a";
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const client = require('twilio')(process.env.TWILIOACCOUNTSID,process.env.AUTHTOKEN);
const serviceId = process.env.SERVICEID;

module.exports = {
  doSMS: (userData) => {
    
    return new Promise(async (resolve, reject) => {
      try {
        console.log(userData);
        let res = {};
      await client.verify
      .services(serviceId)
      .verifications.create({
        to: `+91${userData.mobile}`,
        channel: "sms",
      })
      .then((reeee) => {
        res.valid = true;
        resolve(res);
      })
        .catch((err) => {
        console.log(err);
      });
      } catch (error) {
        res.status(500).json(error)
      }
      
    });
  },
  otpVerify: (userData) => {
    let mobile = userData.location.state.mobile;
    let OTP = userData.otp;
    return new Promise(async (resolve, reject) => {
      await client.verify
        .services(serviceId)
        .verificationChecks.create({
          to: `+91${mobile}`,
          code: OTP,
        })
        .then((verifications) => {
          if (verifications) {
            resolve(verifications.valid);
          } else {
            resolve({ varificeationError: true });
          }
        });
    });
  },
};
