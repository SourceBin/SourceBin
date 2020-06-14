import passport from 'passport';

import { anonymous } from './anonymous';
import { discord } from './discord';
import { github } from './github';
import { jwt } from './jwt';

export function registerStrategies(): void {
  passport
    .use(anonymous)
    .use(discord)
    .use(github)
    .use(jwt);
}
