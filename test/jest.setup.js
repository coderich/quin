import isEmail from 'validator/lib/isEmail';
import Quin from '../src/core/Quin';
import Rule from '../src/core/Rule';
import Transformer from '../src/core/Transformer';

// Adding new rules
Rule.factory('email', () => v => !isEmail(v));

// Adding new transform
Transformer.factory('richard', () => v => 'richard');

// Adding Rules/Transformers
Quin.factory('email', Rule.email());
Quin.factory('bookName', Rule.deny('The Bible'));
Quin.factory('bookPrice', Rule.range(0, 100));
Quin.factory('artComment', Rule.allow('yes', 'no', 'maybe'));
Quin.factory('richard', Transformer.richard());

// Adding custom keys
Quin.custom('alias: Mixed');
Quin.custom('onDelete: OnDeleteEnum');
Quin.custom('indexes: [IndexInput!]');
