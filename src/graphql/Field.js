import Type from './Type';
import Rule from '../core/Rule';
import Transformer from '../core/Transformer';
import { isPlainObject, ensureArray } from '../service/app.service';

export default class Field extends Type {
  constructor(schema, model, field) {
    super(schema, field);
    this.model = model;
    this.rules = [];
    this.transformers = [];

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

    if (this.isRequired() && this.getType() !== 'ID') this.rules.push(Rule.required()); // Required rule
  }

  getModel() {
    return this.model;
  }

  cast(value) {
    const casted = Transformer.cast(this.getType())(this, value);
    return this.isArray() ? ensureArray(casted) : casted;
  }

  serialize(value, mapper) {
    return this.transform(value, mapper, true);
  }

  transform(value, mapper = {}, serialize) {
    const modelRef = this.getModelRef();
    const transformers = [...this.transformers];

    // // Delegate transformations to the actual field responsible
    // const field = this.resolveField();
    // if (field !== this) return field.transform(value, mapper);

    // If we're a dataRef field, need to either id(value) or delegate object to model
    if (modelRef) {
      if ((!serialize || !modelRef.isEntity()) && isPlainObject(ensureArray(value)[0])) return modelRef.transform(value, mapper); // delegate
      if (serialize) transformers.push(Transformer.serialize()); // Serializer
      transformers.push(Transformer.id()); // id(value)
    }

    // Perform transformation
    return transformers.reduce((prev, transformer) => {
      const cmp = mapper[transformer.method];
      return transformer(this, prev, cmp);
    }, this.cast(value));
  }

  validate(value, mapper = {}) {
    const modelRef = this.getModelRef();
    const rules = [...this.rules];

    // // Delegate transformations to the actual field responsible
    // const field = this.resolveField();
    // if (field !== this) return field.validate(value, mapper);

    if (modelRef) {
      if (isPlainObject(ensureArray(value)[0])) return modelRef.validate(value, mapper); // Model delegation
      rules.push(Rule.idResolve()); // id(value)
    }

    return Promise.all(rules.map((rule) => {
      const cmp = mapper[rule.method];
      return rule(this, value, cmp);
    }));
  }

  isIdField() {
    return Boolean(this.model.getIdField() === this);
  }
}
