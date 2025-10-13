import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma


// const { Sequelize, Model } = require('sequelize');

// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/e-acelera', {
//   dialect: 'postgres',
//   logging: false, 
// });

// const UserModel = require('./models/user')(sequelize);
// const ThemeModel = require('./models/theme')(sequelize);
// const TopicModel = require('./models/topic')(sequelize);
// const ProgressModel = require('./models/progress')(sequelize);

// ThemeModel.hasMany(TopicModel, { foreignKey: 'themeId' });
// TopicModel.belongsTo(ThemeModel, { foreignKey: 'themeId' });

// UserModel.hasMany(ProgressModel, { foreignKey: 'userId' });
// ProgressModel.belongsTo(UserModel, { foreignKey: 'userId' });

// TopicModel.hasMany(ProgressModel, { foreignKey: 'topicId' });
// ProgressModel.belongsTo(TopicModel, { foreignKey: 'topicId' });

// ThemeModel.hasMany(ProgressModel, { foreignKey: 'themeId' });
// ProgressModel.belongsTo(ThemeModel, { foreignKey: 'themeId' });


// module.exports = {
//   sequelize,
//   UserModel,
//   ThemeModel,
//   TopicModel,
//   ProgressModel,
//   Sequelize, 
//   Model,     
// };
