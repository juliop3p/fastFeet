import Sequelize from 'sequelize';

import Admin from '../app/models/Admin';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import DeliveryMan from '../app/models/DeliveryMan';
import Delivery from '../app/models/Delivery';
import Problem from '../app/models/Problem';

import databaseConfig from '../config/database';

const models = [Admin, Recipient, File, DeliveryMan, Delivery, Problem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
