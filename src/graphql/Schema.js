import { GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import Model from './Model';

export default class Schema {
  constructor(gql, rules, transformers) {
    //
    this.toString = () => gql;
    this.schema = makeExecutableSchema(gql);
    this.rules = rules.reduce((prev, { name, instance }) => Object.assign(prev, { [name]: instance }), {});
    this.transformers = transformers.reduce((prev, { name, instance }) => Object.assign(prev, { [name]: instance }), {});
    this.models = Object.entries(this.schema.getTypeMap()).reduce((prev, [key, value]) => {
      if (!key.startsWith('__') && value instanceof GraphQLObjectType) Object.assign(prev, { [key]: new Model(this, value) });
      return prev;
    }, {});
  }

  getModels() {
    return this.models;
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
