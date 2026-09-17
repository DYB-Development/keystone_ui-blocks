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
