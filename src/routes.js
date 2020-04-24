import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliveryMenController from './app/controllers/DeliveryMenController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import TakeOutDeliveryController from './app/controllers/TakeOutDeliveryController';
import ProblemsController from './app/controllers/ProblemsController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.put('/takeout', TakeOutDeliveryController.update);

routes.get('/deliveries', DeliveryController.index);

routes.put(
  '/signature/:id',
  upload.single('signature'),
  DeliveryController.update
);

routes.post('/delivery/problems/:id', ProblemsController.store);

routes.get('/delivery/:id/problems', ProblemsController.show);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.post('/deliveryMen', DeliveryMenController.store);
routes.get('/deliveryMen', DeliveryMenController.index);
routes.put('/deliveryMen/:id', DeliveryMenController.update);
routes.delete('/deliveryMen/:id', DeliveryMenController.destroy);

routes.post('/deliveries', DeliveryController.store);

routes.get('/delivery/problems', ProblemsController.index);

routes.put('/problem/:id/cancel-delivery', CancelDeliveryController.update);

routes.post('/avatar', upload.single('avatar'), FileController.store);

export default routes;
