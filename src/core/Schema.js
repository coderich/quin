import { GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import Model from './Model';
import Directive from './Directive';

export default class Schema {
  constructor(typeDef) {
    const typeDefs = [Directive.typeDefs, typeDef];
    const { schemaDirectives } = Directive;
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

  getModel(name) {
    return this.models.find(model => model.getName() === name);
  }
}
