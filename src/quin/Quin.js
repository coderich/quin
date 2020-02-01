import { SchemaDirectiveVisitor } from 'graphql-tools';
import Schema from '../graphql/Schema';

class QuinDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

export default class Quin {
  constructor(gql = {}) {
    gql.typeDefs = gql.typeDefs || [];
    gql.schemaDirectives = gql.schemaDirectives || {};
    this.gql = gql;
    this.quins = [];
  }

  register(...args) {
    this.quins.push(...args);
    return this;
  }

  createSchema() {
    const rules = this.quins.filter(quin => quin.type === 'rule');
    const transformers = this.quins.filter(quin => quin.type === 'transformer');

    // Push new typeDef
    this.gql.typeDefs.push(`
      scalar QuinMixed
      enum QuinEnforceEnum { ${rules.map(rule => rule.name).join(' ')} }
      enum QuinTransformEnum  { ${transformers.map(transformer => transformer.name).join(' ')} }

      directive @quin(
        enforce: [QuinEnforceEnum!]
        transform: [QuinTransformEnum!]
      ) on OBJECT | FIELD_DEFINITION
    `);

    // Merge in schemaDirectives
    Object.assign(this.gql.schemaDirectives, { quin: QuinDirective });

    // Return new Schema
    return new Schema(this.gql);
  }
}
