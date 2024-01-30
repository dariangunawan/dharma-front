import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Service } from "@/models/Service";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.json('should be a POST request');
        return;
    }
    const {
        name, email, company, orderServices,
    } = req.body;
    await mongooseConnect();
    const servicesIds = orderServices;
    const uniqueIds = [...new Set(servicesIds)];
    const servicesInfos = await Service.find({ _id: uniqueIds });

    let line_items = [];
    for (const serviceId of uniqueIds) {
        const serviceInfo = servicesInfos.find(p => p._id.toString() === serviceId);
        const quantity = servicesIds.filter(id => id === serviceId)?.length || 0;
        if (quantity > 0 && serviceInfo) {
            line_items.push({
                quantity,
                price_data: {
                    currency: 'IDR',
                    product_data: {name:serviceInfo.title},
                    unit_amount: quantity * serviceInfo.price * 100,
                },
            });
        }
    }

    const orderDoc = await Order.create({
        line_items, name, email, company, paid:false,
    });
    
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/orders?success=1',
        cancel_url: process.env.PUBLIC_URL + '/orders?canceled=1',
        metadata: {orderId:orderDoc._id.toString(), test:'ok'},
    });

    res.json({
        url:session.url,
    })
}