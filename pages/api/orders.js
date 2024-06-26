import { mongooseConnect } from "@/lib/mongoose"
import { Service } from "@/models/Service"

export default async function handle(req, res) {
  await mongooseConnect()
  const ids = req.body.ids
  res.json(await Service.find({ _id: ids }))
}
