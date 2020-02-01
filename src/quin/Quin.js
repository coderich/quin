import { SchemaDirectiveVisitor } from 'graphql-tools';
import Transformer from './Transformer';
import Rule from './Rule';
import Schema from '../graphql/Schema';

class QuinDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

export default class Quin {
  constructor() {
    const transformers = Transformer.defaults().map(name => ({ name, quin: new Transformer(Transformer[name]()) }));
    const rules = Rule.defaults().map(name => ({ name, quin: new Rule(Rule[name]()) }));
    this.quins = [...transformers, ...rules];
  }

  register(name, quin) {
    this.quins.push({ name, quin });
    return this;
  }

  mergeSchema(schema) {
    // Identify quin
    const rules = this.quins.filter(({ quin }) => quin.type === 'rule');
    const transformers = this.quins.filter(({ quin }) => quin.type === 'transformer');

    // Ensure schema
    schema.typeDefs = schema.typeDefs || [];
    schema.schemaDirectives = Object.assign(schema.schemaDirectives || {}, { quin: QuinDirective });
    schema.typeDefs = Array.isArray(schema.typeDefs) ? schema.typeDefs : [schema.typeDefs];

    // Merge schema
    schema.typeDefs.push(`
      scalar QuinMixed
      enum QuinEnforceEnum { null ${rules.map(({ name }) => name).join(' ')} }
      enum QuinTransformEnum  { null ${transformers.map(({ name }) => name).join(' ')} }

      directive @quin(
        enforce: [QuinEnforceEnum!]
        transform: [QuinTransformEnum!]
      ) on OBJECT | FIELD_DEFINITION
    `);

    // Return new Schema
    return new Schema(schema);
  }
}
