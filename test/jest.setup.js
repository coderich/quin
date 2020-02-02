import isEmail from 'validator/lib/isEmail';
import Quin from '../src/quin/Quin';
import Rule from '../src/quin/Rule';

// Adding new rules
Rule.factory('email', () => v => !isEmail(v));

// Adding to @quin
Quin.factory('email', Rule.email());
Quin.factory('bookName', Rule.deny('The Bible'));
Quin.factory('bookPrice', Rule.range(0, 100));
Quin.factory('artComment', Rule.allow('yes', 'no', 'maybe'));
