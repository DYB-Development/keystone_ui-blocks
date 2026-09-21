# keystone_ui-blocks

A drag-and-drop block grid for Rails engine gems, following
[keystone_ui](https://github.com/DYB-Development/keystone_ui)'s design. A host
app or gem declares the block types it offers, keeps a layout on one of its own
records, and puts the grid on one of its own screens, where a designer adds
blocks, drags and resizes them, fills in their content, and removes them.

Host apps do not install this gem directly. An engine with a block grid depends
on it, and the host gets it with that engine.

## Requirements

- Rails 7.0 or later
- [keystone_ui-react](https://github.com/DYB-Development/keystone_ui-react),
  which the grid draws with

## Declaring block types

A host declares each type it offers, under a kind of layout of its own naming:

```ruby
KsBlocks.block(:heading, name: "Heading", width: 12, height: 1, kind: :pages)
KsBlocks.block(:text, name: "Text", width: 6, height: 2, kind: :pages)
```

The width and height are in grid cells, and are the size a block of that type
starts at.

A type can also carry the size it renders at on a screen narrower than 640
pixels, where blocks are drawn one after another in the order they were saved:

```ruby
KsBlocks.block(:revenue, name: "Revenue", width: 6, height: 4, kind: :dashboards,
               narrow_width: 12, narrow_height: 2)
```

A type registered without one takes the full width on a narrow screen. Only one
layout is ever saved or arranged.

## What one record offers

A record offers every type registered for its kind. A record that offers fewer
says which:

```ruby
def block_layout_offered
  block_layout_types.select { |block_type| sources.include?(block_type.key) }
end
```

The list beside the grid shows only those, and a block already on the layout
keeps its type's limits whether or not its type is still offered.

## A layout on a host's record

A host keeps the layout in a column of its own and says which kind of layout it
is:

```ruby
class Page < ApplicationRecord
  include KsBlocks::Layout

  block_layout :blocks, kind: :pages
end
```

A record whose kind varies row by row gives something to work it out with:

```ruby
block_layout :blocks, kind: ->(record) { record.dashboard_type.to_sym }
```

The grid's shape is the host's to declare, in columns, pixels of row height and
pixels of gap. A second set of numbers applies below a width the host names, and
each one that is left out falls back to its wide counterpart:

```ruby
block_layout :blocks, kind: :pages,
  columns: 12, row_height: 60, gap: 10,
  narrow_columns: 4, narrow_row_height: 80, narrow_gap: 6, narrow_below: 640
```

A record that declares no shape is drawn at twelve columns of sixty pixel rows
with a ten pixel gap, and `narrow_below` defaults to 640.

## Putting the grid on a screen

The grid is a React interface, installed as an npm package from this
repository's release tag alongside the gem:

```json
"dependencies": {
  "keystone_ui-blocks": "https://github.com/DYB-Development/keystone_ui-blocks/archive/refs/tags/v0.1.0.tar.gz"
}
```

An engine registers it as a React UI and draws it on a screen of its own, the
way [keystone_ui-react](https://github.com/DYB-Development/keystone_ui-react)
mounts any React UI.

## Development

```bash
bundle install

bundle exec rake test
bin/rubocop
```

## Releasing

See [RELEASING.md](RELEASING.md).

## License

MIT. See [MIT-LICENSE](MIT-LICENSE).
