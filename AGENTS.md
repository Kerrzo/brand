## Development

Before starting a development server, check whether its intended port is already in use. If a compatible server is already running, reuse it. Never kill or replace a process merely because its port is occupied.

Prefer foreground development servers that the user can stop and restart directly. Agents may restart a server when needed for testing, but must leave server lifecycle control clear and accessible to the user. Do not start Astro in detached/background mode unless the user explicitly asks for it.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Visual convention

Do not use decorative horizontal rules to separate sections or editorial items. Use spacing, typography, labels, imagery and background changes instead. Preserve structural rules in navigation/list rows, Keep Exploring, tables and architecture/data lists. Existing site-wide divider cleanup is deferred to the global polish pass.
