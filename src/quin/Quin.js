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

// const transformers = Transformer.defaults().map(name => ({ name, instance: Transformer[name]() })); // Create default instances
// const rules = Rule.defaults().map(name => ({ name, instance: Rule[name]() })); // Create default instances
// const instances = [...transformers, ...rules];

export default class Quin {
  constructor() {
    const transformers = Object.entries(Transformer).map(([name, method]) => ({ name, instance: method() })); // Create default instances
    const rules = Object.entries(Rule).map(([name, method]) => ({ name, instance: method() })); // Create default instances
    this.instances = [...transformers, ...rules];
  }

  register(name, instance) {
    const invalidArg = () => { throw new Error('Invalid argument; expected Rule|Transformer factory instance'); };
    const { method = invalidArg(), type = invalidArg() } = instance;
    const factoryMethod = (type === 'rule' ? Rule[method] : Transformer[method]);
    if (!factoryMethod) invalidArg();
    this.instances.push({ name, instance });
    return instance;
  }

  mergeSchema(schema) {
    // Identify instances
    const rules = this.instances.filter(({ instance }) => instance.type === 'rule');
    const transformers = this.instances.filter(({ instance }) => instance.type === 'transformer');

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

  static factory(name, instance) {
    const invalidArg = () => { throw new Error('Invalid argument; expected Rule|Transformer factory instance'); };
    const { method = invalidArg(), type = invalidArg() } = instance;
    const factoryMethod = (type === 'rule' ? Rule[method] : Transformer[method]);
    if (!factoryMethod) invalidArg();
    return Object.defineProperty(Quin, name, { value: instance, enumerable: true })[name];
  }
}
