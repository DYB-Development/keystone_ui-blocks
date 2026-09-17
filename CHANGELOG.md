# Changelog

## [Unreleased]

### Changed
- A block is moved by a handle it now carries rather than by dragging anywhere on it, so on a touchscreen a finger anywhere else on a block scrolls the screen instead of moving the block.

### Added
- A block type can carry the width and height it renders at on a screen narrower than 640 pixels, and a drawn layout uses that size there. A type registered without one takes the full width on a narrow screen, as before, and blocks are still drawn one after another in the order they were saved.

## [0.1.0] - 2026-09-16

### Added
- A registry a host app or gem declares its block types with, each carrying the key it is saved under, the name a designer picks it by, and the width and height in grid cells a block of it starts at.
- A grid that adds a block at a place or the first open one, moves and resizes blocks, fills in a block's content and removes it, refusing with a message naming the block whenever a change would overlap another block, run past the last column, break the sizes its type may be resized between, move or remove a block of a fixed type, or use a type registered for one use twice.
- A host record that keeps its layout in a column of its own, adding a block to it, placing blocks, filling in a block's content and removing a block, and refusing a change made against a version of the layout it no longer has.
- Helpers a host draws a saved layout with on any screen of its own, placing each block where it was saved, in reading order, leaving out a block whose type is no longer registered, and stacking them one under another on a narrow screen.
- Endpoints a host adds to a controller of its own, which add a block, place blocks, fill in a block's content, remove a block, and answer with the layout, and which answer a refused change with the reason it was refused.
- A block grid a designer arranges blocks on, with the block types listed beside it to search, group, drag onto the grid or add with a button, and where a block is dragged, resized by a corner, selected to fill in its content, and removed, every change saved as it is made and put back as it was when the server refuses one.
- Layout data a host hands its screen, carrying the block types registered for that kind of layout, the blocks saved on it, the shape of its grid, and a version naming the layout as it stands.
