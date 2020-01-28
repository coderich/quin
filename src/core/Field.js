import Type from './Type';
import { isScalarDataType } from '../service/app.service';
import * as TransformService from '../service/transform.service';
import * as RuleService from '../service/rule.service';

export default class Field extends Type {
  constructor(schema, field) {
    super(field);
    this.schema = schema;
    this.transforms = [];
    this.rules = [];

    // Populate transform and rule thunks
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
    const isSet = this.getDirectiveArg('quin', 'enforce', '').indexOf('distinct') > -1;
    return Object.assign([type], { isSet });
  }

  getSimpleType() {
    return this.getType();
  }

  // getGQLType(suffix) {
  //   let type = this.getSimpleType();
  //   if (suffix && !isScalarDataType(type)) type = this.options.embedded ? `${type}${suffix}` : 'ID';
  //   if (this.options.enum) type = `${this.model.getName()}${ucFirst(this.getName())}Enum`;
  //   type = this.isArray() ? `[${type}]` : type;
  //   if (suffix !== 'InputUpdate' && this.isRequired()) type += '!';
  //   return type;
  // }

  // getGQLDefinition() {
  //   const fieldName = this.getName();
  //   const type = this.getGQLType();
  //   const ref = this.getDataRef();

  //   if (ref) {
  //     if (this.isArray()) return `${fieldName}(first: Int after: String lfield: Int before: String query: ${ref}InputQuery): Connection`;
  //     return `${fieldName}(query: ${ref}InputQuery): ${type}`;
  //   }

  //   return `${fieldName}: ${type}`;
  // }

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

  getOnDelete() {
    return this.getDirectiveArg('quin', 'onDelete');
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

    return this.transforms.reduce((prev, t) => {
      return t(prev);
    }, value);
  }

  validate(value, mapper) {
    if (mapper == null) mapper = {};
    return Promise.all(this.rules.map(r => r(value)));
  }
}
