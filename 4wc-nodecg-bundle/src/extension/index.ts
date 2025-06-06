/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias').addAlias('@4wc-stream-overlay', require('path').join(__dirname, '..'));

import type NodeCG from '@nodecg/types';
import { Configschema } from '@4wc-stream-overlay/types/schemas';
import { set } from './util/nodecg';

export = (nodecg: NodeCG.ServerAPI<Configschema>): void => {
  /**
   * Because of how `import`s work, it helps to use `require`s to force
   * things to be loaded *after* the NodeCG context is set.
   */
  set(nodecg);
  // require('./matches');
  require('./gosumemory');
  // require('./refereeHelper');
  // require('./sheetsKv');
  // require('./songsFolder');
  // require('./spotify');
  // require('./osuApi');
  // require('./companion');
  require('./jsonData');
  require('./autopick');
};
