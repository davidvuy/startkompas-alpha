// One reporting shape for every check, so their output is predictable and a
// failure always looks the same. Three scripts had their own copy of this.
//
// Conventions these checks follow:
//   - a PROBLEM fails the run (exit 1). It must be actionable: say what is
//     wrong and where.
//   - a WARNING never fails the run. Use it where the right response is a
//     human look, not a red build — a 403 from an official portal, a pack
//     carrying open topics.
//   - a NOTE is context printed before the verdict (counts, budgets).

/**
 * @param {{ok: string}} messages `ok` is printed when nothing failed.
 */
export function createReport({ok}) {
  const problems = [];
  const warnings = [];
  const notes = [];

  const label = (where, message) => (where ? `${where}: ${message}` : message);

  return {
    /** Context line, printed before the verdict. */
    note: (message) => notes.push(message),

    /** Needs a human look, but does not fail the run. */
    warn: (where, message) => warnings.push(label(where, message)),

    /** Fails the run. Say what is wrong and where. */
    fail: (where, message) => problems.push(label(where, message)),

    get problemCount() {
      return problems.length;
    },

    /**
     * Prints notes, warnings and the verdict. Sets exit code 1 on any problem.
     * @returns {boolean} true when nothing failed
     */
    finish() {
      for (const note of notes) console.log(`  ${note}`);

      if (warnings.length) {
        console.log(`\n${warnings.length} warning(s) — reported, not failures:`);
        for (const warning of warnings) console.log(`  - ${warning}`);
      }

      if (problems.length === 0) {
        console.log(`\nOK: ${ok}`);
        return true;
      }

      console.error(`\n${problems.length} problem(s):`);
      for (const problem of problems) console.error(`  - ${problem}`);
      process.exitCode = 1;
      return false;
    },
  };
}
