import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execCommand = promisify(exec)
const getPackages = async (/** @type {string} */ command) => {
  const { stdout } = await execCommand(command)
  const packages = /** @type {{name?: string}[]} */ (JSON.parse(stdout))
  return (Array.isArray(packages)) ? packages : []
}

const COMMAND = `pnpm multi list --json --depth=-1`
const packages = await getPackages(COMMAND)
  .then(res => res.map(({ name }) => name?.split(`/`).at(-1)).filter(Boolean))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

/** @type {import('cz-git').UserConfig} */
export default {
  rules: {
    'body-leading-blank': [2, `always`],
    'body-max-line-length': [2, `always`, 72],
    'footer-leading-blank': [1, `always`],
    'footer-max-line-length': [2, `always`, 72],
    'header-max-length': [2, `always`, 50],
    'subject-case': [2, `never`, [
      `sentence-case`,
      `start-case`,
      `pascal-case`,
      `upper-case`,
    ]],
    'subject-empty': [2, `never`],
    'subject-full-stop': [2, `never`, `.`],
    'type-case': [2, `always`, `lower-case`],
    'type-empty': [2, `never`],
    'type-enum': [2, `always`, [
      `build`,
      `chore`,
      `ci`,
      `docs`,
      `feat`,
      `fix`,
      `perf`,
      `refactor`,
      `revert`,
      `style`,
      `test`,
    ]],
    'scope-enum': [2, `always`, [...packages]],
    'scope-case': [2, `always`, `lower-case`],
    'scope-empty': [2, `never`],
  },
  prompt: {
    messages: {
      type: `Select the type of change that you're committing:`,
      scope: `Denote the SCOPE of this change:`,
      customScope: `Denote the SCOPE of this change:`,
      subject: `Write a SHORT, IMPERATIVE tense description of the change:\n`,
      body: `Provide a LONGER description of the change (optional). `
        + `Use '|' to break new line:\n`,
      breaking:
        `List any BREAKING CHANGES (optional). Use '|' to break new line:\n`,
      footerPrefixesSelect:
        `Select the ISSUES type of changeList by this change (optional):`,
      customFooterPrefix: `Input ISSUES prefix:`,
      footer: `List any ISSUES by this change. E.g.: #31, #34:\n`,
      generatingByAI: `Generating your AI commit subject...`,
      generatedSelectByAI: `Select suitable subject by AI generated:`,
      confirmCommit: `Are you sure you want to proceed with the commit above?`,
    },
    types: [
      { value: `feat`, name: `feat: A new feature`, emoji: `:sparkles:` },
      { value: `fix`, name: `fix: A bug fix`, emoji: `:bug:` },
      {
        value: `docs`,
        name: `docs: Documentation only changes`,
        emoji: `:memo:`,
      },
      {
        value: `style`,
        name: `style: Changes that do not affect the meaning of the code`,
        emoji: `:lipstick:`,
      },
      {
        value: `refactor`,
        name:
          `refactor: A code change that neither fixes a bug nor adds a feature`,
        emoji: `:recycle:`,
      },
      {
        value: `perf`,
        name: `perf: A code change that improves performance`,
        emoji: `:zap:`,
      },
      {
        value: `test`,
        name: `test: Adding missing tests or correcting existing tests`,
        emoji: `:white_check_mark:`,
      },
      {
        value: `build`,
        name: `build: Changes that affect the build system `
          + `or external dependencies`,
        emoji: `:package:`,
      },
      {
        value: `ci`,
        name: `ci: Changes to our CI configuration files and scripts`,
        emoji: `:ferris_wheel:`,
      },
      {
        value: `chore`,
        name: `chore: Other changes that don't modify src or test files`,
        emoji: `:hammer:`,
      },
      {
        value: `revert`,
        name: `revert: Reverts a previous commit`,
        emoji: `:rewind:`,
      },
    ],
    useEmoji: false,
    emojiAlign: `center`,
    useAI: false,
    aiNumber: 1,
    themeColorCode: ``,
    allowEmptyScopes: false,
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: [`feat`, `fix`],
    breaklineChar: `|`,
    skipQuestions: [],
    issuePrefixes: [{
      value: `closed`,
      name: `closed: ISSUES has been processed`,
    }],
    customIssuePrefixAlign: `top`,
    emptyIssuePrefixAlias: `skip`,
    customIssuePrefixAlias: `custom`,
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
  },
}
