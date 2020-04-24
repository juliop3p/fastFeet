import * as Yup from 'yup';
import Problems from '../models/Problems';
import Delivery from '../models/Delivery';

class ProblemsController {
  async index(req, res) {
    const problems = await Problems.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: [
            'id',
            'recipient_id',
            'deliveryman_id',
            'product',
            'start_date',
          ],
        },
      ],
    });

    return res.json(problems);
  }

  async show(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      where: {
        id,
        signature_id: null,
        end_date: null,
      },
      attributes: [
        'id',
        'product',
        'start_date',
        'recipient_id',
        'deliveryman_id',
      ],
      include: [
        {
          model: Problems,
          as: 'problems',
          attributes: ['id', 'description'],
        },
      ],
    });

    return res.json(delivery);
  }

  async store(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { delivery_id, description } = await Problems.create({
      delivery_id: id,
      description: req.body.description,
    });

    return res.json({
      id,
      delivery_id,
      description,
    });
  }
}

export default new ProblemsController();
