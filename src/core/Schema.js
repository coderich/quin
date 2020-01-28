import { uniqWith } from 'lodash';
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

    const identifyOnDeletes = (parentModel) => {
      return this.models.reduce((prev, model) => {
        model.getOnDeleteFields().forEach((field) => {
          if (`${field.getModelRef()}` === `${parentModel}`) {
            if (model.isVisible()) {
              prev.push({ model, field, isArray: field.isArray(), op: field.getOnDelete() });
            } else {
              prev.push(...identifyOnDeletes(model).map(od => Object.assign(od, { fieldRef: field, isArray: field.isArray(), op: field.getOnDelete() })));
            }
          }
        });

        // Assign model referential integrity
        return uniqWith(prev, (a, b) => `${a.model}:${a.field}:${a.fieldRef}:${a.op}` === `${b.model}:${b.field}:${b.fieldRef}:${b.op}`);
      }, []);
    };

    this.models.forEach(model => model.referentialIntegrity(identifyOnDeletes(model)));
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
