import { buildSchema, GraphQLObjectType } from 'graphql';
import Model from './Model';

export default class Schema {
  constructor(typeDefs) {
    this.schema = buildSchema(typeDefs);
    this.models = Object.entries(this.getCustomTypes()).map(([modelName, modelAST]) => new Model(this, modelName, modelAST));
  }

  getCustomTypes() {
    return Object.entries(this.schema.getTypeMap()).reduce((prev, [key, value]) => {
      if (!key.startsWith('__') && value instanceof GraphQLObjectType) Object.assign(prev, { [key]: value });
      return prev;
    }, {});
  }

  getModels() {
    return this.models;
  }

  getModel(name) {
    return this.models.find(model => model.getName() === name);
  }
}
