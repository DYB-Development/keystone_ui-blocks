# Changelog

## [Unreleased]

## [0.7.0] - 2026-09-21

### Fixed
- Holding a block to start arranging works. The grid built a new hold on every redraw, and a block's own click redraws the grid, so the release that should have called the hold off reached a hold that no longer held the timer, and edit mode started from presses that were let go early.
- A panel a card opens, such as the note behind a stat card's information button, is drawn over the blocks beside it rather than under them. Each block is placed with a transform, which makes a stacking context the card could not escape, so the block under the pointer now rises above its neighbours.

### Added
- A hook a host can hold a block with, which keeps one hold across the redraws of whatever draws it.

## [0.6.0] - 2026-09-21

### Added
- A host record's grid declares a second set of numbers for a narrow screen, and the width below which they apply. Each narrow number left out falls back to its wide counterpart, and a record that declares no width uses 640 pixels.
- A grid draws at the narrow numbers when the width it measures is below that width, sizing each block from the narrow size its type declares and packing the blocks in the reading order of the wide layout.
- A block whose type declares no narrow size takes the narrow grid's full width.

### Changed
- A grid narrower than that width cannot be dragged or resized, whether or not edit mode is on. Arranging from a narrow grid comes later.
- The remove target stays on screen while a block is dragged, so a drag down a grid taller than the screen can still reach it.

### Upgrading
- A host that draws the grid inside its own narrow column should declare `narrow_below` rather than rely on the viewport, since the grid measures itself.

## [0.5.1] - 2026-09-21

### Fixed
- A block whose content the host re-rendered is drawn again on the grid. It kept the markup it was first given, so a field filled in after a block was drawn changed nothing a person could see until the page was reloaded.

## [0.5.0] - 2026-09-21

### Changed
- A grid draws no card around itself. Its controls, its error message, its block fields and its remove target sit in the grid's own element, so the only cards on a screen are the ones the host rendered as block contents.

### Upgrading
- A host that relied on the grid's card around the whole grid now draws its own around the mount.

## [0.4.0] - 2026-09-18

### Changed
- A grid shows its blocks and nothing else until a person asks to change it. The list of blocks to add, the way to remove one, and resizing all wait behind edit mode, which starts off.
- A block is the markup the host rendered for it. The grid draws no panel, no padding and no row around it, and the slot the markup is moved into carries no styling.
- A block being edited drags from any point on it. Dragging is refused outright while edit mode is off.
- The list of blocks to add opens as a modal from a control beside Done, keeps its search and its grouping, and closes once a type is chosen.
- A block is removed by dragging it onto a target that appears while the grid is being edited. A block whose type is fixed keeps its place instead.
- A block resizes from its corner alone, where it offered the right edge and the bottom edge as well.

### Added
- A grid takes a prop that decides whether edit mode starts on.
- Holding a block for half a second starts edit mode. Letting go early, or moving off the block, starts nothing, and a press that became a hold reaches nothing under the finger.
- A press on a block being arranged reaches nothing inside it, so a link in a card cannot be followed while cards are being moved.

### Removed
- The drag handle every block carried. The whole block drags instead.
- The Remove button every block carried. The remove target replaces it.
- The stylesheet rules for that handle.

### Upgrading
- A host that relied on the block list sitting beside the grid should expect it in a modal instead.
- A host whose block markup assumed the grid's panel around it now draws its own, since the grid draws none.

## [0.3.0] - 2026-09-17

### Added
- A host record can offer fewer block types than its kind registers, so what a designer may add depends on the record rather than on one setting made when the application starts. A block already on the layout keeps its type's limits whether or not its type is still offered, and a record that says nothing offers every type as before.

## [0.2.2] - 2026-09-17

### Fixed
- A host can load the script React comes on without naming keystone_ui-react itself, because this gem now brings that gem's engine with it. Before, a page asking for that script was refused, since nothing had told the host where it lives.

## [0.2.1] - 2026-09-17

### Fixed
- A host record can work out which kind of layout it keeps from itself, so one model can hold layouts of different kinds, and every limit a block type sets is enforced against that record's own kind.

## [0.2.0] - 2026-09-17

### Changed
- A block is moved by a handle it now carries rather than by dragging anywhere on it, so on a touchscreen a finger anywhere else on a block scrolls the screen instead of moving the block.

### Upgrading
- A screen that drives the grid in a test by dragging a block itself has to take hold of the block's handle instead.

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
