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
