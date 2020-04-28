import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import File from '../models/File';

class StatusDeliveryController {
  async index(req, res) {
    const { id, delivered = false } = req.query;

    if (delivered) {
      const deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          canceled_at: null,
          signature_id: { [Op.ne]: null },
        },
      });

      return res.json(deliveries);
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
      },
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const file = await File.create({
      name,
      path,
    });

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      start_date,
      end_date,
    } = await delivery.update({
      signature_id: file.id,
      end_date: new Date(),
    });

    return res.json({
      id,
      deliveryman_id,
      recipient_id,
      signature_id,
      product,
      start_date,
      end_date,
      url: file.url,
    });
  }
}

export default new StatusDeliveryController();
