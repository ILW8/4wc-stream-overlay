# 4WC Stream Overlay

This overlay is intended to be used with [tosu](https://github.com/KotRikD/tosu) `>=4.6.0`.

## Intended OBS scene setup

### `main`

| source        | url/path                                            | width | height | x         | y         |
|---------------|-----------------------------------------------------|-------|--------|-----------|-----------|
| vc_overlay*   |                                                     | 480   | 100    | 0         | 880       |
| osu clients** |                                                     | 480   | 360    | see below | see below |
| accents       | http://127.0.0.1:24050/4wc-stream-overlay/gameplay/ | 1920  | 1080   | 0         | 0         |
| main_overlay  | http://127.0.0.1:24050/4wc-stream-overlay/main/     | 1920  | 1080   | 0         | 0         |

<sup>*url from discord, replace custom css with [vc.css](vc.css)</sup><br>
<sup>**normal 4v4 placement according to the following table:</sup>

| client | x    | y    |
|--------|------|------|
| 0      | 0    | 160  |
| 1      | 480  | 160  |
| 2      | 0    | 520  |
| 3      | 480  | 520  |
| 4      | 960  | 160  |
| 5      | 1440 | 160  |
| 6      | 960  | 520  |
| 7      | 1440 | 520  |

### `mappool`

| source           | url/path                                           | width | height | x | y   |
|------------------|----------------------------------------------------|-------|--------|---|-----|
| vc_overlay       |                                                    | 480   | 100    | 0 | 880 |
| mappool_overlay* | http://127.0.0.1:24050/4wc-stream-overlay/mappool/ | 2220  | 700    | 0 | 0   |
| main_overlay     | http://127.0.0.1:24050/4wc-stream-overlay/main/    | 1920  | 1080   | 0 | 0   |

### `intro`*

| source           | url/path                                           | width | height | x | y   |
|------------------|----------------------------------------------------|-------|--------|---|-----|
| spotify_overlay  | http://127.0.0.1:24050/4wc-stream-overlay/spotify/ | 1920  | 1080   | 0 | 0   |
| intro_overlay    | http://127.0.0.1:24050/4wc-stream-overlay/intro/   | 1920  | 1080   | 0 | 0   |

<sup>*data pulled from `_data/coming_up.json`, requires exchanging between matches</sup>

### `winner`

| source           | url/path                                          | width | height | x | y   |
|------------------|---------------------------------------------------|-------|--------|---|-----|
| winner_overlay   | http://127.0.0.1:24050/4wc-stream-overlay/winner/ | 1920  | 1080   | 0 | 0   |

Intro and winner scenes can also have the vc overlay bottom left if needed

### Transitions

Add a **300ms `linear horizontal` luma wipe** transition between the scenes with **`0.05`** smoothness

### Interacting with the mappool

- Left click: left (red) team pick
- Right click: right (blue) team pick
- Ctrl+Click: ban
- Shift+Click: clear

## Other

### `_data` folder

Includes the following data and configuration files:

- `teams.json`: list of teams, static
- `beatmaps.json`: mappool file, exchanged weekly
- `coming_up.json`: (not provided) time and team names for a match, exchanged every match, used for intro screen; supports array-based version as well
- `streamer.json`: (not provided) your name, as `{"username": "yourname"}`

## Spotify / Now playing

The intro scene uses an overlay to display the currently playing song. This is ideally shown with [spotilocal](https://github.com/jmswrnr/spotilocal)'s websocket output. For users without Spotify, the query parameter `?useOsu=true` can be added to the overlay to instead display the song currently playing in the osu! client.


----------------------------------------


# NodeCG

[![NodeCG](https://raw.githubusercontent.com/nodecg/nodecg/main/media/splash.png)](https://nodecg.dev/)

[![Discord](https://img.shields.io/discord/754749209722486814)](https://discord.gg/nsXXDFGBEt)
[![Build Status](https://github.com/nodecg/nodecg/workflows/CI/badge.svg)](https://github.com/nodecg/nodecg/actions?query=workflow%3ACI)
[![Coverage Status](https://codecov.io/gh/nodecg/nodecg/branch/main/graph/badge.svg)](https://codecov.io/gh/nodecg/nodecg)
[![Docker Build Status](https://ghcr-badge.egpl.dev/nodecg/nodecg/latest_tag)](https://ghcr.io/nodecg/nodecg)

NodeCG is a broadcast graphics framework and application. It enables you to write complex, dynamic broadcast graphics using the web platform. NodeCG has no graphics or drawing primitives of its own. Instead, NodeCG provides a structure for your code and an API to facilitate moving data between the dashboard, the server, and your graphics. It makes few assumptions about how to best code a graphic, and gives you freedom to use whatever libraries, frameworks, tools, and methodologies you want. As such, NodeCG graphics can be rendered in any environment that can render HTML, including:

- [OBS Studio](https://obsproject.com/)
- [vMix](http://www.vmix.com/)
- [XSplit](https://www.xsplit.com/)
- [CasparCG](https://github.com/CasparCG/server/releases) (v2.2.0+)

> Don't see your preferred streaming software on this list? NodeCG graphics require a modern browser engine. If your streaming software's implementation of browser source uses a recent-ish browser engine, chances are that NodeCG graphics will work in it. You can check what version your streaming software uses for its browser sources by opening [whatversion.net/chrome](https://www.whatversion.net/browser/) as a browser source.

Have questions about NodeCG, or just want to say 'hi'? [Join our Discord server](https://discord.gg/nsXXDFGBEt)!

## Documentation & API Reference

Full docs and API reference are available at https://nodecg.dev

## Goals

The NodeCG project exists to accomplish the following goals:

- Make broadcast graphics (also known as "character generation" or "CG") more accessible.
- Remain as close to the web platform as possible.
- Support broadcasts of any size and ambition.

Let's unpack what these statements mean:

### > Make broadcast graphics (also known as "character generation" or "CG") more accessible

Historically, broadcast graphics have been expensive. They either required expensive hardware, expensive software, or both. NodeCG was originally created to provide real-time broadcast graphics for Tip of the Hats, which is an all-volunteer charity fundraiser that had a budget of \$0 for its first several years.

Now, it is possible to create an ambitious broadcast using entirely free software and consumer hardware. The NodeCG project embraces this democratization of broadcast technology.

### > Remain as close to the web platform as possible

NodeCG graphics are just webpages. There is absolutely nothing special or unique about them. This is their greatest strength.

By building on the web platform, and not building too many abstractions on top of it, people developing broadcast graphics with NodeCG have access to the raw potential of the web. New APIs and capabilities are continually being added to the web platform, and NodeCG developers should have access to the entirety of what the web can offer.

### > Support broadcasts of any size and ambition

NodeCG's roots are in small broadcasts with no budget. More recently, NodeCG has begun seeing use in increasingly elaborate productions. We believe that one set of tools can and should be able to scale up from the smallest show all the way to the biggest fathomable show. Whether you're using OBS for everything, or a hardware switcher with a traditional key/fill workflow, NodeCG can be a part of any broadcast graphics system.

## Maintainers

- [Matt "Bluee" McNamara](https://mattmcn.com/)
- [Keiichiro "Hoishin" Amemiya](https://twitter.com/hoishinxii)

## Designers

- [Chris Hanel](http://www.chrishanel.com)

## Acknowledgements

- [Atmo](https://github.com/atmosfar), original dashboard concept and code, the inspiration for toth-overlay
- [Alex "Lange" Van Camp](https://github.com/alvancamp), designer & developer of [toth-overlay](https://github.com/TipoftheHats/toth-overlay), the base on which NodeCG was built


----

# nodecg-vue-ts-template

Template for NodeCG bundles that use Vue.js and TypeScript.


## Technical Details

- Tested with Node.js v22.11.0 and above (as of writing, latest LTS properly tested and supported with NodeCG).
- Extension uses TypeScript.
- Browser uses Vue.js (v3), with TypeScript for the scripting.
    - Includes the [nodecg-vue-composable](https://github.com/Dan-Shields/nodecg-vue-composable) helper composable to help with using replicants; I advise you check it's README for more information.
    - Dashboard also includes Quasar, for easy styling of UI.
        - If you wish to configure Quasar differently, check [the quasar vite-plugin documentation](https://quasar.dev/start/vite-plugin#using-quasar).
    - Builds using Vite, using the [vite-plugin-nodecg](https://github.com/nodecg/vite-plugin-nodecg) plugin.
        - The bundle also overrides `vite` to v6 (dependency asks for v5) as it is tested working.
- ESLint is included for extension/browser/typings.
    - Extends some other recommended configurations.
- I personally use Visual Studio Code with some appropriate extensions so have made sure it works well in that editor.
    - Includes a `.vscode/extensions.json` that will suggest you appropriate extensions.
    - Includes a `.vscode/settings.json` that has some settings that you may find useful.
- The extension/browser files have some example code scattered about that should help in how to use things.

## Limitations

- I don't use any JSON schema specs higher than `draft-07` due to Visual Studio Code not supporting them correctly; see [this issue](https://github.com/microsoft/vscode/issues/98724).

## Package Commands

- `autofix`: Automatically fix any possible linting errors using ESLint.
- `prebuild`: Clean up all built/watched files; will automatically run before `build` if called.
- `build`: Build written code for use in production.
- `clean`: Clean up all built/watched files.
- `lint`: Finds any possible linting errors using ESLint, but does not fix them.
- `schema-types`: Create TypeScript typings for schemas/`Configschema.json` using `nodecg` CLI.
- `start`: Start NodeCG.
- `watch`: Build code and watch for changes, for use in development.

## Changelogs

All changes onwards from v3.0.0 are available on the [releases](../../releases) section. Other changelogs are available below.

### Differences between template v2 and v3...

This is a "brief" list of changes, although in relality it was mostly rewritten from the ground up, so there are probably more.

If you want to see all of the changes, check out the [original PR](https://github.com/zoton2/nodecg-vue-ts-template/pull/24).

- Switched Vite config file to TypeScript (`vite.config.mjs` > `vite.config.ts`).
- Updated how the extension code is built and how it is run in a Node.js context:
    - It now runs using the `module` type.
    - It is built targetting more modern standards (based on `@tsconfig/node22`).
- All updates needed for NodeCG v2, which isn't too many but is still some (mainly type related).
- Bumped `package.json`s `nodecg.compatibleRange` to `^2.3.0`, as that's the first NodeCG version that properly supported Node.js v22.11.0 LTS.
- Use NodeCG types from official dependency.
- Replaced [@vueuse/head](https://github.com/vueuse/head) with [@unhead/vue](https://github.com/unjs/unhead), due to the former's sunsetting.
- ESLint overhaul:
    - Upgraded from ESLint v9 from v8.
    - Switched to using flat configs.
    - A lot was stripped out that I don't think was needed (feel free to report any issues you may have).
    - No longer extends the configuration from airbnb-typescript, as it isn't available for ESLint v9 yet, and I wanted to try without it.
- Reduced the amount of `package.json` scripts/commands by combining some of them and removing the extension/browser/etc. splits.
- Added a `./src/browser_shared` folder with a shared `replicant.ts` helper file for browser contexts.
- Removed MDI CSS being imported by default on dashboard panels.
- Removed the `module-alias` parts as I felt they may have made things too confusing.
- Moved browser `*.ts` entry files into the the respective sub-directories for better organisation.

### Differences between template v1 and v2...

- Upgraded Vue to v3 from v2.
- Uses Vite to build browser code instead of Webpack.
- Uses Quasar for material design styling help instead of Vuetify.
- No TypeScript decorators used in the browser code now as they aren't needed.
- Adds [nodecg-vue-composable](https://github.com/Dan-Shields/nodecg-vue-composable) to help with using/modifying replicants in browser.
- No longer includes any Vue state plugins by default (as no longer needed for replicants), but you can add one if needed (I'd suggest [pinia](https://pinia.vuejs.org/)).
- Includes [@vueuse/head](https://github.com/vueuse/head), in the example code just used to help change the title of each page.
- Uses the [nodecg-types](https://github.com/codeoverflow-org/nodecg-types) package instead of directly referencing the installed NodeCG instance.


