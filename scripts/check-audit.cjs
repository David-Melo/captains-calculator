const { spawnSync } = require('node:child_process');

const result = spawnSync('yarn', ['audit', '--json'], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    shell: process.platform === 'win32',
});
const reports = (result.stdout || '').split('\n').flatMap(line => {
    try { return [JSON.parse(line)]; } catch { return []; }
});
const counts = reports.find(report => report.type === 'auditSummary')?.data?.vulnerabilities;

// Yarn returns a severity bitmask, including for the documented moderate findings.
// Check the summary explicitly and fail closed when the registry cannot be read.
if (result.error || !counts || !Number.isFinite(counts.high) || !Number.isFinite(counts.critical)) {
    console.error('Dependency audit could not complete. Retry before merging.');
    if (result.error) console.error(result.error.message);
    process.exit(1);
}

console.log('Dependency audit:', JSON.stringify(counts));
const blockers = new Set(reports
    .filter(report => report.type === 'auditAdvisory')
    .map(report => report.data.advisory)
    .filter(advisory => ['high', 'critical'].includes(advisory.severity))
    .map(advisory => `${advisory.module_name}: ${advisory.title} (${advisory.url})`));
for (const blocker of blockers) console.error(blocker);
if (counts.high || counts.critical) process.exit(1);
console.log('No high or critical advisories. Review remaining findings in docs/dependency-security.md.');
