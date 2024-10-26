const axios = require('axios');

exports.processPayment = async (paymentData) => {
  const response = await axios.post('https://api.payment.com/process', paymentData);
  return response.data;
};
