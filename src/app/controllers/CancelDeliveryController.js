import Problem from '../models/Problem';
import Delivery from '../models/Delivery';

class CancelDeliveryController {
  async update(req, res) {
    const { id } = req.params;

    const problem = await Problem.findByPk(id);

    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    const delivery = await Delivery.findByPk(problem.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const {
      id: product_id,
      product,
      start_date,
      canceled_at,
    } = await delivery.update({
      canceled_at: new Date(),
    });

    return res.json({
      id,
      product,
      product_id,
      start_date,
      canceled_at,
    });
  }
}

export default new CancelDeliveryController();
