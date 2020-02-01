import Type from './Type';
import { isScalarDataType } from '../service/app.service';
import TransformService from '../service/transform.service';
import RuleService from '../service/rule.service';

export default class Field extends Type {
  constructor(schema, field) {
    super(field);
    this.schema = schema;
    this.transforms = [];
    this.rules = [];
    this.cast = TransformService.cast(this.getType());

    // Populate transform and rule thunks
    if (this.isRequired()) this.rules.push(RuleService.required());

    Object.entries(this.getDirectiveArgs('quin', {})).forEach(([key, value]) => {
      if (!Array.isArray(value)) value = [value];

      switch (key) {
        case 'allow': case 'deny': case 'norepeat': case 'range': {
          this.rules.push(RuleService[key](...value));
          break;
        }
        case 'enforce': {
          this.rules.push(...value.map(r => RuleService[r]()));
          break;
        }
        case 'transform': {
          this.transforms.push(...value.map(t => TransformService[t]()));
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  getDataType() {
    const type = this.getType();
    if (!this.isArray()) return type;
    const isSet = this.getDirectiveArg('quin', 'transform', '').indexOf('dedupe') > -1;
    return Object.assign([type], { isSet });
  }

  getSimpleType() {
    return this.getType();
  }

  getDataRef() {
    const ref = this.getSimpleType();
    return isScalarDataType(ref) ? null : ref;
  }

  getModelRef() {
    return this.schema.getModel(this.getDataRef());
  }

  getVirtualRef() {
    return this.getDirectiveArg('quin', 'materializeBy');
  }

  getVirtualModel() {
    return this.schema.getModel(this.getSimpleType());
  }

  getVirtualField() {
    return this.getVirtualModel().getField(this.getVirtualRef());
  }

  getTransforms() {
    return this.transforms;
  }

  getRules() {
    return this.rules;
  }

  isCreateField() {
    return this.getSimpleType() !== 'ID' && !this.isVirtual();
  }

  isUpdateField() {
    return this.isCreateField() && !this.isImmutable();
  }

  isVirtual() {
    return this.isMaterialized();
  }

  isMaterialized() {
    return Boolean(this.getDirectiveArg('quin', 'materializeBy'));
  }

  isImmutable() {
    return this.getDirectiveArg('quin', 'enforce', '').indexOf('immutable') > -1;
  }

  isEmbedded() {
    return Boolean(this.getDirectiveArg('quin', 'embedded'));
  }

  transform(value, mapper) {
    if (mapper == null) mapper = {};

    return this.transforms.concat(this.cast).reduce((prev, transform) => {
      const cmp = mapper[transform.name];
      if (Array.isArray(prev)) return prev.map(p => transform(p, cmp));
      return transform(prev, cmp);
    }, value);
  }

  validate(value, mapper) {
    if (mapper == null) mapper = {};

    return Promise.all(this.rules.map((rule) => {
      const cmp = mapper[rule.name];
      if (Array.isArray(value)) return value.map(v => rule(v, cmp));
      return rule(value, cmp);
    }));
  }
}
