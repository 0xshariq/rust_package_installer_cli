import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
export const createOrder = async (req, res) => {
  const order = await razorpay.orders.create({
    amount: 50000,
    currency: "INR",
    receipt: "receipt#1",
  });
  res.json(order);
};

export const refundPayment =  async (req, res) => {
  const { paymentId, amount } = req.body;
  const refund = await razorpay.payments.refund(paymentId, { amount });
  res.json(refund);
};