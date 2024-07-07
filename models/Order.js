import { model, models, Schema } from "mongoose"

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    type_order: String,
    type_payment: String,
    status: String,
    paid: Number,
  },
  {
    timestamps: true,
  }
)

export const Order = models?.Order || model("Order", OrderSchema)
