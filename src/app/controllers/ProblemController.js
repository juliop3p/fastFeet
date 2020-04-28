import * as Yup from 'yup';
import Problem from '../models/Problem';
import Delivery from '../models/Delivery';

class ProblemsController {
  async index(req, res) {
    const problems = await Problem.findAll({
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

    if (!problems) {
      return res.status(400).json({ error: 'Problems not found' });
    }

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
          model: Problem,
          as: 'problem',
          attributes: ['id', 'description'],
        },
      ],
    });

    if (!delivery) {
      return res
        .status(400)
        .json({ error: "Delivery don't have a problem or don't exist" });
    }

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

    const { delivery_id, description } = await Problem.create({
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
