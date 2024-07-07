import { mongooseConnect } from "@/lib/mongoose"
import { Order } from "@/models/Order"
import { Service } from "@/models/Service"

export default async function handle(req, res) {
  await mongooseConnect()

  if (req.method === "POST") {
    const { ids, type } = req.body
    if (type == "order") {
      res.json(await Order.find({ email: ids }))
    } else {
      res.json(await Service.find({ _id: ids }))
    }
  }
}
