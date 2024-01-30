import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handle(req, res) {
    await mongooseConnect();

    if (req.method === 'POST') {
        const { title, description, stars, service } = req.body;
        res.json(await Review.create({ title, description, stars, service }));
    }

    if (req.method === 'GET') {
        const { service } = req.query;
        res.json(await Review.find({ service }, null, { sort: { createdAt: -1 } }));
    }
}