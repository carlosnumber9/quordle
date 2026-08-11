# ADR-0005: on-demand final definitions

## Status

Accepted, 2026-08-11.

## Decision

After a game ends, the browser requests one definition payload for each of the
four solutions from a local server endpoint. The endpoint uses Apertium's
Spanish morphological analyzer to recover lemmas and grammatical forms, then
uses the unofficial `rae-api.com` service to retrieve dictionary senses. Only
the first sense matching each valid lexical reading is returned.

The game dictionary intentionally removes vowel diacritics. The service
therefore analyzes the unaccented spelling and every plausible acute-accent and
diaeresis variant. It returns all valid readings rather than guessing which
homograph or accented form was intended.

Provider contracts remain server-side behind the stable
`WordDefinitionPayload` type. The RAE API key is a server secret and is required
in production. Successful responses use a one-day shared cache with a
seven-day stale-while-revalidate window. The browser also persists successful
payloads in one versioned Local Storage record scoped to the game ID, date, and
ordered solutions. Definitions are not stored in the repository.

## Rationale

Storing all definitions beside the 9,300-word dictionary would create a large,
stale dataset and would still require separate morphology metadata. Fetching
only four words after completion keeps the initial game fast and avoids
revealing any additional solution data before the result screen.

Apertium retains ambiguous readings such as the noun and verb analyses of
`CANTO`. The unofficial RAE API supplies structured RAE senses and complete
verb entries, while the local endpoint isolates the UI from both providers and
keeps credentials private.

## Consequences

Definitions are best-effort. Either provider can fail, rate-limit requests, or
change its response. The result cards therefore render their word and outcome
without waiting, show a skeleton only in the definition area, and silently
contract when a definition is unavailable. Failed lookups are not persisted;
successful lookups survive closing or reloading the site and avoid another API
request for the same game.

The source is suitable for this personal, non-commercial project but has no
official RAE relationship or availability guarantee. Commercial use requires
separate authorization from the RAE. A future licensed source can replace the
server adapters without changing the browser contract.
