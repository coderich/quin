import Type from './Type';
import Rule from '../core/Rule';
import Transformer from '../core/Transformer';
import { ensureArray } from '../service/app.service';

export default class Field extends Type {
  constructor(schema, field) {
    super(field);
    this.schema = schema;
    this.transforms = [];
    this.rules = [];
    if (this.isRequired()) this.rules.push(Rule.required());

    Object.entries(this.getDirectiveArgs('quin', {})).forEach(([key, value]) => {
      if (!Array.isArray(value)) value = [value];

      switch (key) {
        case 'enforce': {
          this.rules.push(...value.map(r => schema.getRules()[r]));
          break;
        }
        case 'transform': {
          this.transforms.push(...value.map(t => schema.getTransformers()[t]));
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  getModelRef() {
    return this.schema.getModels()[this.getDataRef()];
  }

  cast(value) {
    const casted = Transformer.cast(this.getType())(value);
    return this.isArray() ? ensureArray(casted) : casted;
  }

  transform(value, mapper) {
    if (mapper == null) mapper = {};

    value = this.cast(value);

    return this.transforms.reduce((prev, transform) => {
      const cmp = mapper[transform.method];
      return transform(prev, cmp);
    }, value);
  }

  validate(value, mapper) {
    if (mapper == null) mapper = {};

    return Promise.all(this.rules.map((rule) => {
      const cmp = mapper[rule.method];
      return rule(value, cmp);
    }));
  }
}
