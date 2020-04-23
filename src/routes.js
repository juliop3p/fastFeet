import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliveryMenController from './app/controllers/DeliveryMenController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.post('/deliveryMen', DeliveryMenController.store);
routes.get('/deliveryMen', DeliveryMenController.index);
routes.put('/deliveryMen/:id', DeliveryMenController.update);
routes.delete('/deliveryMen/:id', DeliveryMenController.destroy);

routes.post('/deliveries', DeliveryController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
