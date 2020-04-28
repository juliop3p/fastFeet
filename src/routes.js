import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import StatusDeliveryController from './app/controllers/StatusDeliveryController';
import TakeOutDeliveryController from './app/controllers/TakeOutDeliveryController';
import ProblemController from './app/controllers/ProblemController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.put('/deliveryman/takeout', TakeOutDeliveryController.update);

routes.get('/deliveryman/deliveries', StatusDeliveryController.index);

routes.put(
  '/deliveryman/signature/:id',
  upload.single('signature'),
  StatusDeliveryController.update
);

routes.post('/deliveryman/delivery/problems/:id', ProblemController.store);

routes.get('/deliveryman/delivery/:id/problems', ProblemController.show);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/deliveryMen', DeliveryManController.store);
routes.get('/deliveryMen', DeliveryManController.index);
routes.put('/deliveryMen/:id', DeliveryManController.update);
routes.delete('/deliveryMen/:id', DeliveryManController.destroy);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.destroy);

routes.get('/delivery/problems', ProblemController.index);

routes.put('/problem/:id/cancel-delivery', CancelDeliveryController.update);

routes.post('/avatar', upload.single('avatar'), FileController.store);

export default routes;
