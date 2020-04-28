import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveryman = await DeliveryMan.findAll({
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

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (deliveryman) {
      return res.status(400).json({ error: 'Delivery men already registered' });
    }

    const { id, name, email } = await DeliveryMan.create({
      name: req.body.name,
      email: req.body.email,
    });

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const deliveryman = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery Man not found' });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, name, email } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async destroy(req, res) {
    const deliveryman = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery Man not found' });
    }

    await deliveryman.destroy();

    return res.json({});
  }
}

export default new DeliveryManController();
