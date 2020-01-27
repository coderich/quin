import { GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import Model from './Model';
import DirectiveService from '../service/directive.service';

export default class Schema {
  constructor(typeDef) {
    const typeDefs = [DirectiveService.typeDefs, typeDef];
    const { schemaDirectives } = DirectiveService;
    this.schema = makeExecutableSchema({ typeDefs, schemaDirectives });
    this.models = this.getCustomTypes().map(model => new Model(this, model));
  }

  getCustomTypes() {
    return Object.entries(this.schema.getTypeMap()).reduce((prev, [key, value]) => {
      if (!key.startsWith('__') && value instanceof GraphQLObjectType) prev.push(value);
      return prev;
    }, []);
  }

  getModels() {
    return this.models;
  }

  getModelMap() {
    return this.models.reduce((prev, model) => Object.assign(prev, { [model.getName()]: model }), {});
  }

  getModel(name) {
    return this.models.find(model => model.getName() === name);
  }
}
