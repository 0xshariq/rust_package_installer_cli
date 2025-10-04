import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const body = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const refund = await razorpay.payments.refund(body.paymentId, {
      amount: body.amount * 100, // optional: full refund if not passed
    });

    return new Response(JSON.stringify(refund), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
