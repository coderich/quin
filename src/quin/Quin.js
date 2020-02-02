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
  constructor(schema) {
    // Identify instances
    const defaultTransformers = Object.entries(Transformer).map(([name, method]) => ({ name, instance: method() })); // Create default instances
    const defaultRules = Object.entries(Rule).map(([name, method]) => ({ name, instance: method() })); // Create default instances
    const customInstances = Object.entries(Quin).map(([name, instance]) => ({ name, instance }));
    const customRules = customInstances.filter(({ instance }) => instance.type === 'rule');
    const customTransformers = customInstances.filter(({ instance }) => instance.type === 'transformer');
    const rules = defaultRules.concat(customRules);
    const transformers = defaultTransformers.concat(customTransformers);

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
    return new Schema(schema, rules, transformers);
  }

  static factory(name, instance) {
    const invalidArg = () => { throw new Error('Invalid argument; expected Rule|Transformer factory instance'); };
    const { method = invalidArg(), type = invalidArg() } = instance;
    const factoryMethod = (type === 'rule' ? Rule[method] : Transformer[method]);
    if (!factoryMethod) invalidArg();
    return Object.defineProperty(Quin, name, { value: instance, enumerable: true })[name];
  }
}
