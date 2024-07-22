import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order"
import { Service } from "@/models/Service"
const stripe = require("stripe")(process.env.STRIPE_SK)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request")
    return
  }
  const {
    name,
    userId,
    email,
    orderServices,
    orderId,
    type_order,
    type_payment,
  } = req.body
  await mongooseConnect()
  const servicesIds = orderServices
  const uniqueIds = [...new Set(servicesIds)]
  const servicesInfos = await Service.find({ _id: uniqueIds })

  let line_items = []
  for (const serviceId of uniqueIds) {
    const serviceInfo = servicesInfos.find(
      (p) => p._id.toString() === serviceId
    )
    const quantity = servicesIds.filter((id) => id === serviceId)?.length || 0
    if (quantity > 0 && serviceInfo) {
      line_items.push({
        servicesIds: serviceId,
        quantity,
        price_data: {
          currency: "IDR",
          product_data: { name: serviceInfo.title },
          unit_amount: (serviceInfo.price * 100) / 2,
        },
        nama_jasa: serviceInfo.title,
        nilai: serviceInfo.price,
        total: (quantity * serviceInfo.price) / 2,
      })
    }
  }
  let orderDoc
  if (orderId) {
    orderDoc = await Order.findOneAndUpdate(
      { _id: orderId },
      { type_payment, status: "pending" }
    )
  } else {
    orderDoc = await Order.create({
      line_items: line_items.map((item) => {
        return {
          ...item,
          price_data: {
            ...item.price_data,
            product_data: {
              title: item.price_data.product_data.name,
            },
          },
        }
      }),
      userId,
      name,
      email,
      paid: 0,
      type_order,
      type_payment,
      status: "diterima",
    })
  }

  const session = await stripe.checkout.sessions.create({
    line_items: line_items.map((item) => {
      return {
        quantity: item.quantity,
        price_data: item.price_data,
      }
    }),
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/orders?success=1",
    cancel_url: process.env.PUBLIC_URL + "/orders?canceled=1",
    metadata: { orderId: orderDoc._id.toString(), test: "ok" },
  })

  res.json({
    url: session.url,
  })
}
