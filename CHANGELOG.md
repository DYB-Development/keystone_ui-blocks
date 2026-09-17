# Changelog

## [Unreleased]

### Added
- A registry a host app or gem declares its block types with, each carrying the key it is saved under, the name a designer picks it by, and the width and height in grid cells a block of it starts at.
- A grid that adds a block at a place or the first open one, moves and resizes blocks, fills in a block's content and removes it, refusing with a message naming the block whenever a change would overlap another block, run past the last column, break the sizes its type may be resized between, move or remove a block of a fixed type, or use a type registered for one use twice.
- A host record that keeps its layout in a column of its own, adding a block to it, placing blocks, filling in a block's content and removing a block, and refusing a change made against a version of the layout it no longer has.
- Layout data a host hands its screen, carrying the block types registered for that kind of layout, the blocks saved on it, the shape of its grid, and a version naming the layout as it stands.
