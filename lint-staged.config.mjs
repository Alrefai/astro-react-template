export default {
  './{types/*.ts,*.js}': (/** @type string[] */ filenames) => [
    `pnpm run type-check`,
    `pnpm exec eslint ${filenames.join(` `)}`,
    `pnpm run format ${filenames.join(` `)}`,
  ],
  './*.{json,jsonc,md}': (/** @type string[] */ filenames) =>
    `pnpm run format ${filenames.join(` `)}`,
}
