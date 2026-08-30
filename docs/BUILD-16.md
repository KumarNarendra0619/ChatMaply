# ChatMaply — BUILD-16: Import Test Lab + Parser QA

## Purpose
Make import quality measurable before claiming that a platform export is production-ready.

## QA outputs
- expected vs actual message count
- expected vs actual media count
- expected vs actual mapped-location count
- coordinate-record count
- mapping-rate metric
- pass/fail status

## Test philosophy
The fixtures are synthetic. Real exports should be tested locally by the user or a controlled research team and should not be committed to GitHub.

## Platform gate
A platform should only move from `baseline` to `verified` after at least one representative real export passes message, timestamp, media-linkage and location checks.

## Important metric caveat
`mapping_rate` is a diagnostic ratio, not an accuracy score. A low mapping rate can be correct when few messages contain explicit coordinates.

## Privacy gate
Do not upload or commit private chat exports, phone numbers, contact lists, personal media, tokens or credentials. Use consented/synthetic fixtures for automated regression testing.
