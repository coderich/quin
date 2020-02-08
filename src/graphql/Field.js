import Type from './Type';
import Rule from '../core/Rule';
import Transformer from '../core/Transformer';
import { ensureArray } from '../service/app.service';

export default class Field extends Type {
  constructor(schema, model, field) {
    super(schema, field);
    this.model = model;
    this.rules = [];
    this.transformers = [];
    if (this.isRequired()) this.rules.push(Rule.required());

    Object.entries(this.getDirectiveArgs('quin', {})).forEach(([key, value]) => {
      if (!Array.isArray(value)) value = [value];

      switch (key) {
        case 'enforce': {
          this.rules.push(...value.map(r => schema.getRules()[r]));
          break;
        }
        case 'transform': {
          this.transformers.push(...value.map(t => schema.getTransformers()[t]));
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  cast(value) {
    const casted = Transformer.cast(this.getType())(value);
    return this.isArray() ? ensureArray(casted) : casted;
  }

  transform(value, mapper) {
    if (mapper == null) mapper = {};
    const transformers = [...this.transformers];

    // Delegate transformations to the actual field responsible
    const field = this.resolveField();
    if (field !== this) return field.transform(value, mapper);

    // If we're a dataRef field, need to either id(value) or delegate object to model
    if (this.getDataRef()) {
      const [idOrObj] = ensureArray(value);

      // Delegate check
      if (typeof idOrObj === 'object') {
        const keys = Object.keys(idOrObj);
        const fields = this.model.getFieldNames();
        if (fields.some(f => keys.includes(f))) return this.model.transform(value, mapper);
      }

      // Id(value)
      transformers.push(Transformer.id());
    }

    // Perform transformation
    return transformers.reduce((prev, transformer) => {
      const cmp = mapper[transformer.method];
      return transformer(prev, cmp);
    }, this.cast(value));
  }

  validate(value, mapper) {
    if (mapper == null) mapper = {};

    return Promise.all(this.rules.map((rule) => {
      const cmp = mapper[rule.method];
      return rule(value, cmp);
    }));
  }
}
