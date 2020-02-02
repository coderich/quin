import { GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import Model from './Model';

export default class Schema {
  constructor(gql, rules, transformers) {
    //
    this.schema = makeExecutableSchema(gql);
    this.rules = rules.reduce((prev, { name, instance }) => Object.assign(prev, { [name]: instance }), {});
    this.transformers = transformers.reduce((prev, { name, instance }) => Object.assign(prev, { [name]: instance }), {});

    //
    this.models = this.getCustomTypes().map(model => new Model(this, model));
    this.toString = () => gql;
  }

  getModels() {
    return this.models;
  }

  getModel(name) {
    return this.models.find(model => model.getName() === name);
  }

  getModelMap() {
    return this.models.reduce((prev, model) => Object.assign(prev, { [model.getName()]: model }), {});
  }

  getCustomTypes() {
    return Object.entries(this.schema.getTypeMap()).reduce((prev, [key, value]) => {
      if (!key.startsWith('__') && value instanceof GraphQLObjectType) prev.push(value);
      return prev;
    }, []);
  }

  getRules() {
    return this.rules;
  }

  getTransformers() {
    return this.transformers;
  }

  getExecutableSchema() {
    return this.schema;
  }
}
