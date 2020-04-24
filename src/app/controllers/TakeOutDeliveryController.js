import {
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  setSeconds,
  setMinutes,
  setHours,
} from 'date-fns';
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
    const initial_date = setSeconds(setMinutes(setHours(start_date, 8), 0), 0);
    const terminate_date = setSeconds(
      setMinutes(setHours(start_date, 18), 0),
      0
    );

    if (
      !isAfter(start_date, initial_date) ||
      !isBefore(start_date, terminate_date)
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
