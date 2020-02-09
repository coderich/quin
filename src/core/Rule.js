import { map, ensureArray } from '../service/app.service';

const jsStringMethods = ['endsWith', 'includes', 'match', 'search', 'startsWith'];

export default class Rule {
  constructor(thunk, ignoreNull = true, name = 'Unknown') {
    return Object.defineProperty((val, cmp = v => thunk(v)) => {
      return new Promise((resolve, reject) => {
        if (ignoreNull) {
          if (val != null) {
            return Promise.all(ensureArray(map(val, async (v) => {
              const err = await cmp(v);
              if (err) return Promise.reject(new Error(`Rule Error: ${name}`));
              return Promise.resolve();
            }))).then(v => resolve()).catch(e => reject(e));
          }
        } else {
          return Promise.all([(async () => {
            const err = await cmp(val);
            if (err) return Promise.reject(new Error(`Rule Error: ${name}`));
            return Promise.resolve();
          })()]).then(v => resolve()).catch(e => reject(e));
        }

        return resolve();
      });

      // if (ignoreNull && val == null) return;
      // if (!ignoreNull && cmp(val)) throw new Error(`Rule Error: ${name}`);
      // if (ignoreNull) map(val, (v) => { if (cmp(v)) throw new Error(`Rule Error: ${name}`); });
    }, 'type', { value: 'rule' });
  }

  static factory(name, thunk, ignoreNull = true, descriptor = {}) {
    return Object.defineProperty(Rule, name, {
      value: (...args) => Object.defineProperty(new Rule(thunk(...args), ignoreNull, name), 'method', { value: name }),
      ...descriptor,
    })[name];
  }
}

// Factory methods
jsStringMethods.forEach(name => Rule.factory(name, (...args) => v => !String(v)[name](...args)));
Rule.factory('idResolve', () => v => false, true, { writable: true });
Rule.factory('required', () => v => v == null, false, { enumerable: true });
Rule.factory('allow', (...args) => v => args.indexOf(v) === -1);
Rule.factory('deny', (...args) => v => args.indexOf(v) > -1);
Rule.factory('range', (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;
  return v => Number.isNaN(v) || v < min || v > max;
});
