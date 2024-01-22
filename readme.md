# Personal Website

A minimalist personal website (most of my engineering efforts are spent building [Tunnel](https://github.com/Tunnel-Labs) :)

## Technologies 

- Nuxt 3 (a Vue 3 meta-framework) w/ [patch to support monorepos](#why-is-nuxtjs-patched)
- TailwindCSS
- [Convex](https://convex.dev) w/ [corvex](https://github.com/Tunnel-Labs/corvex) (a small wrapper ORM + utilities around Convex)

### Why is Nuxt.js patched?

I couldn't get vanilla Nuxt.js to work with my TypeScript monorepo setup (the generated `dev/index.mjs` bundle didn't transform the relative import path in `packages/database/$.ts`, causing nitro to fail to resolve the imports from `@-/database`).

Instead of trying to fix the bundling logic, I wanted nitro to support importing `@-/database` directly from a JavaScript file, which requires registering a Node.js ESM loader like [tsx](https://github.com/privatenumber/tsx). However, the nitro server uses `node:worker_threads` to execute the bundled file, which [currently doesn't support custom loaders](https://github.com/nodejs/node/issues/47747).

Until Node.js releases support for loaders in a worker thread, I'm using a [patch](./patches/nitropack@2.8.1.patch) that makes nitro use `child_process#fork` instead (this patch is auto-generated via [this script](./packages/patching/patches/nitropack/2.8.1/$patch.ts)).

I also probably could've just used Next.js but I wanted to use Vue and not React /shrug
