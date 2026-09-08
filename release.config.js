/* eslint-disable no-template-curly-in-string */
const { execFileSync } = require('child_process');

/*
 * Pull requests are merged with the pull request title as the message of the
 * merge commit GitHub creates, so a merged pull request reaches
 * semantic-release twice: once as the merge commit and once as the branch
 * commit(s) it brings in. Both parse as conventional commits, so both are
 * listed in the release notes.
 *
 * `dedupeCommits` is installed as the release notes writer's `finalizeContext`
 * (the conventionalcommits preset does not define one) and drops the redundant
 * entries just before the notes are rendered, keeping the commit that carries
 * the description and the issue references rather than the merge commit.
 */

// `[#10](https://.../issues/10)` -> `#10`: the writer turns issue references
// into links before this runs.
const MARKDOWN_LINK = /\[([^\]]*)\]\([^)]*\)/g;
// ` (#14)`: GitHub appends the pull request number to the title it reuses.
const TRAILING_PR_REF = /\s*\(#\d+\)\s*$/;

const normalizeSubject = (subject) =>
  String(subject || '')
    .replace(MARKDOWN_LINK, '$1')
    .replace(TRAILING_PR_REF, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const getMergeCommits = (hashes) => {
  if (hashes.length === 0) {
    return new Set();
  }

  try {
    const stdout = execFileSync('git', ['rev-list', '--no-walk', '--merges', ...hashes], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return new Set(stdout.split('\n').filter(Boolean));
  } catch {
    // Not fatal: the duplicates are still removed, only the choice of which
    // one to keep becomes less informed.
    return new Set();
  }
};

// Which entry to keep out of a set of duplicates: a regular commit over a
// merge commit, then the one closing the most issues, then the most detailed.
const rank = (commit, mergeCommits) => [
  mergeCommits.has(commit.hash) ? 0 : 1,
  (commit.references || []).length,
  String(commit.body || '').length,
];

const isBetter = (candidate, current) => {
  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] !== current[i]) {
      return candidate[i] > current[i];
    }
  }

  return false;
};

const dedupeCommits = (context) => {
  const commitGroups = context.commitGroups || [];
  const entries = commitGroups.flatMap((group) => group.commits.map((commit) => ({ section: group.title, commit })));
  const mergeCommits = getMergeCommits(
    entries.map(({ commit }) => commit.hash).filter((hash) => typeof hash === 'string'),
  );
  const kept = new Map();

  entries.forEach(({ section, commit }, index) => {
    const subject = normalizeSubject(commit.subject);
    // Without a subject there is nothing to compare on: keep the entry as is.
    const key = subject ? `${section}\n${commit.scope || ''}\n${subject}` : `${index}`;
    const previous = kept.get(key);

    if (!previous || isBetter(rank(commit, mergeCommits), rank(previous, mergeCommits))) {
      kept.set(key, commit);
    }
  });

  const keptCommits = new Set(kept.values());
  const droppedHashes = new Set(
    entries
      .map(({ commit }) => commit)
      .filter((commit) => commit.hash && !keptCommits.has(commit))
      .map((commit) => commit.hash),
  );

  return {
    ...context,
    commitGroups: commitGroups
      .map((group) => ({ ...group, commits: group.commits.filter((commit) => keptCommits.has(commit)) }))
      .filter((group) => group.commits.length > 0),
    // The BREAKING CHANGE notes of a dropped commit are duplicates as well.
    noteGroups: (context.noteGroups || [])
      .map((group) => ({
        ...group,
        notes: group.notes.filter((note) => !(note.commit && droppedHashes.has(note.commit.hash))),
      }))
      .filter((group) => group.notes.length > 0),
  };
};

/*
 * The release workflow can be dispatched with a release type to force, for
 * commits that would otherwise not produce a release (documentation, chores)
 * or that deserve a bigger bump than they describe. `FORCE_RELEASE_TYPE`
 * carries that choice down to here.
 *
 * `analyzeCommits` is run for every plugin that defines it and the highest
 * release type wins, so the forced type is a floor: commits asking for more
 * than the forced type still get their own bump.
 */
const RELEASE_TYPES = ['patch', 'minor', 'major'];

const getForcedReleaseType = (env) => {
  const forced = String((env || {}).FORCE_RELEASE_TYPE || '')
    .trim()
    .toLowerCase();

  // `auto` is what the workflow sends when nothing has to be forced; the
  // input is also empty when the workflow is dispatched through the API.
  if (forced === '' || forced === 'auto') {
    return null;
  }

  if (!RELEASE_TYPES.includes(forced)) {
    throw new Error(`FORCE_RELEASE_TYPE must be one of auto, ${RELEASE_TYPES.join(', ')} (got "${forced}")`);
  }

  return forced;
};

const forceReleaseType = {
  // Reported before anything is analysed, and a typo fails the run here
  // rather than halfway through it.
  verifyConditions: (pluginConfig, { env, logger }) => {
    const forced = getForcedReleaseType(env);

    if (forced) {
      logger.log('Forcing a %s release: the commits alone may not warrant one.', forced);
    }
  },
  analyzeCommits: (pluginConfig, { env }) => getForcedReleaseType(env),
};

module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    forceReleaseType,
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'doc', hidden: false, section: 'Documentation' },
            { type: 'docs', hidden: false, section: 'Documentation' },
            { type: 'chore', hidden: true, section: 'Chores' },
          ],
        },
        writerOpts: {
          finalizeContext: dedupeCommits,
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/exec',
      {
        // `verifyRelease` runs in dry runs too, which is how the pre-release
        // job of the release workflow learns the version it has to tag.
        verifyReleaseCmd:
          'if [ -n "$GITHUB_OUTPUT" ]; then { echo "new_release_published=true"; echo "new_release_version=${nextRelease.version}"; } >> "$GITHUB_OUTPUT"; fi',
        prepareCmd: './scripts/update_readme.sh "${nextRelease.version}" "$GITHUB_REF"',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'README.md', 'package.json', 'package-lock.json', 'npm-shrinkwrap.json'],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'dist/*.js',
      },
    ],
  ],
  preset: 'conventionalcommits',
  branches: [{ name: 'master' }, { name: 'dev', prerelease: true }],
};
