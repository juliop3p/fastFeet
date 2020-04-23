import Sequelize from 'sequelize';

import Admin from '../app/models/Admin';
import Recipients from '../app/models/Recipients';
import File from '../app/models/File';
import DeliveryMen from '../app/models/DeliveryMen';
import Delivery from '../app/models/Delivery';

import databaseConfig from '../config/database';

const models = [Admin, Recipients, File, DeliveryMen, Delivery];

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
