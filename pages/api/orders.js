import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order"
import { Service } from "@/models/Service"

export default async function handle(req, res) {
  await mongooseConnect()

  if (req.method === "POST") {
    const ids = req.body.ids
    res.json(await Service.find({ _id: ids }))
  }
  if (req.method === "GET") {
    const { userId } = req.body
    res.json(await Order.find({ userId }).sort({ createdAt: -1 }))
  }
}
