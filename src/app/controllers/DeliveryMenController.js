import * as Yup from 'yup';
import DeliveryMen from '../models/DeliveryMen';
import File from '../models/File';

class DeliveryMenController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryMen = await DeliveryMen.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'name', 'email'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveryMen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryMan = await DeliveryMen.findOne({
      where: { email: req.body.email },
    });

    if (deliveryMan) {
      return res.status(400).json({ error: 'Delivery men already registered' });
    }

    const { id, name, email } = await DeliveryMen.create({
      name: req.body.name,
      email: req.body.email,
    });

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryMan = await DeliveryMen.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Delivery Man not found' });
    }

    const { id, name, email } = await deliveryMan.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async destroy(req, res) {
    const deliveryMan = await DeliveryMen.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Delivery Man not found' });
    }

    await deliveryMan.destroy();

    return res.json({});
  }
}

export default new DeliveryMenController();
