import { isBefore, isAfter, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class TakeOutDeliveryController {
  async update(req, res) {
    const { deliveryman_id, delivery_id } = req.query;

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
        canceled_at: null,
        signature_id: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const start_date = new Date();

    if (
      !isAfter(start_date, parseISO('2020-04-23T08:00:00-03:00')) ||
      !isBefore(start_date, parseISO('2020-04-23T18:00:00-03:00'))
    ) {
      return res
        .status(400)
        .json({ error: 'Time must be between 08:00(AM) and 18:00(PM)' });
    }

    const quantity = await Delivery.count({
      where: {
        deliveryman_id,
        canceled_at: null,
        signature_id: null,
        start_date: {
          [Op.between]: [startOfDay(start_date), endOfDay(start_date)],
        },
      },
    });

    if (quantity > 4) {
      return res
        .status(401)
        .json({ error: 'You can make 5 deliveries per day' });
    }

    const { id, product, recipient_id, end_date } = await delivery.update({
      start_date,
    });

    return res.json({
      product_id: id,
      product,
      recipient_id,
      deliveryman_id,
      start_date,
      end_date,
    });
  }
}

export default new TakeOutDeliveryController();
