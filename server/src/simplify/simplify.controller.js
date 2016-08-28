var config = require('config');

var Simplify = require("simplify-commerce"),
  client = Simplify.getClient({
    publicKey: config.SIMPLIFY_PUBLIC_KEY,
    privateKey: config.SIMPLIFY_PRIVATE_KEY
  });


exports.chargeCard = function(req, res, next) {
  var user = req.params.user;
  var amount = req.params.amount;

  // client.payment.create({
  //   amount : "1000",
  //   token : "f21da65e-f0ab-45cb-b8e6-40b493c3671f",
  //   description : "payment description",
  //   currency : "USD"
  // }, function(errData, data){
  //   if(errData){
  //     console.error("Error Message: " + errData.data.error.message);
  //     // handle the error
  //     return;
  //   }
  //   console.log("Payment Status: " + data.paymentStatus);
  // });

  client.payment.create({
    amount : "3123",
    description : "payment description",
    card : {
      expMonth : "11",
      expYear : "19",
      cvc : "123",
      number : "5555555555554444"
    },
    currency : "USD"
  }, function(errData, data){
    if(errData){
      console.error("Error Message: " + errData.data.error.message);
      // handle the error
      // return;
    }
    console.log("Payment Status: " + data.paymentStatus);
    console.log(JSON.stringify(data));
    res.status(200).json(data);
  });
};

exports.createCard = function(req, res, next) {
  // Thing.find(function(err, things) {
  //   if (err) {
  //     return next(err);
  //   }
    var user = req.params.user;

  client.cardtoken.create({
    card : {
      addressState : "MO",
      expMonth : "11",
      expYear : "19",
      addressCity : "OFallon",
      cvc : "123",
      number : "5105105105105100"
    }
  }, function(errData, data){

    if(errData){
      console.error("Error Message: " + errData.data.error.message);
      // handle the error
      // return;
    }

    console.log("Success Response: " + JSON.stringify(data));
  });

    res.status(200).json("hello");
  // });
};
