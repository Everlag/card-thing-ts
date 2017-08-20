# card-thing-ts

**experimental do not use**

This implements the basic structure of a magic-like, stack oriented card game.

A backing desire was to see if typescript's typesystem could support a trivially
serializable state without complication. This seems to have been valid.

## Structure

This is based on an ahead of time, registration based system. Everything
has been structured to provide the most type safety to avoid nasty
runtime surprises.

### Locations

Operations against Entities and global state are stored in
`Event/Effects`.

Mutators, which can be used in interceptors are stored in
`Event/Mutators`.

Zones, which hold entities, are kept in `Zone/Zones`.

Entity definitions are kept in `Entity/Entities`.
There are two main flavors of Entities, either `As` or `With`.
The difference is whether the Entity represents the entire structure
of the object or is expected to be composed with additional Entities.

### Idioms

- A directory under `src/` represents a major system. Subdirectories of
those, such as `src/Zone/Zones`, holds definitions of functional units
of those systems. When directory is referenced below, consider it to be
in terms of major systems.

- Most directories have `Header` files. These store the major types of
the directory and are kept separate to decrease build times.

- Testing style needs significant documentation. Everything with a
`_test` suffix is going to include tests. Directories typically have
a single `_test` file which defines `TestCase` type, aggregates the 
subtests, and exposes all cases wrapped with an executing class.

- Where possible, everything has been made statically analyzable.
As the registration systems are dynamic and happens at runtime, we rely
on imports for type safety.