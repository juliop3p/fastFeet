import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!deliveries) {
      return res.status(400).json({ error: 'Deliveries not found' });
    }

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      where: { id },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    return res.json(delivery);
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

    const recipient = await Recipient.findByPk(recipient_id);

    const deliveryman = await DeliveryMan.findByPk(deliveryman_id);

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
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      where: { id },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { product, recipient_id, deliveryman_id } = await delivery.update(
      req.body
    );

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      where: { id },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.destroy();

    return res.json();
  }
}

export default new DeliveryController();
