import isEmail from 'validator/lib/isEmail';
import Quin from '../src/quin/Quin';
import Rule from '../src/quin/Rule';

const email = Rule.factory('email', () => v => !isEmail(v));
Quin.factory('email', email());
