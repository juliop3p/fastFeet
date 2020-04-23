import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipients from '../models/Recipients';
import DeliveryMen from '../models/DeliveryMen';
// import File from '../models/File';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
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
}

export default new DeliveryController();
