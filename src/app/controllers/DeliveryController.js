import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipients from '../models/Recipients';
import DeliveryMen from '../models/DeliveryMen';
import File from '../models/File';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

/*
  TO DO

  1) make this controller only CRUD (admin).

  2) Create another controller for updates and status (deliveryman).
*/

class DeliveryController {
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

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipient = await Recipients.findByPk(recipient_id);

    const deliveryman = await DeliveryMen.findByPk(deliveryman_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery Man not found' });
    }

    const { id } = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    await Queue.add(NewDeliveryMail.key, {
      deliveryman,
      recipient,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
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

export default new DeliveryController();
