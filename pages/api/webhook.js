import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order"
const stripe = require("stripe")(process.env.STRIPE_SK)
import { buffer } from "micro"

const endpointSecret =
  "whsec_d66bb7653545255cf3e8e32f90fd01f40d9b0a1cc03661aa4c50a89f445fdf2a"

export default async function handler(req, res) {
  await mongooseConnect()
  const sig = req.headers["stripe-signature"]

  let event

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    )
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }
  console.log(event, "event")
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const data = event.data.object
      const orderId = data.metadada.orderId
      console.log(data, "data")
      const paid = data.payment_status === "paid"
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: 1,
        })
      }
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).send("ok")
}

export const config = {
  api: { bodyParser: false },
}
