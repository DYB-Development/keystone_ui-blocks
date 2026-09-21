require "active_support/concern"
require "ks_blocks"
require "ks_blocks/grid"

module KsBlocks
  module Layout
    extend ActiveSupport::Concern

    class_methods do
      def block_layout(column, kind: :blocks, columns: Grid::COLUMNS, row_height: Grid::ROW_HEIGHT, gap: Grid::GAP, narrow_columns: nil, narrow_row_height: nil, narrow_gap: nil, narrow_below: Grid::NARROW_BELOW)
        define_method(:add_block) do |block_type, x: nil, y: nil|
          update!(column => Grid.add(public_send(column), block_type, x: x, y: y, columns: columns))
        end

        define_method(:place_blocks) do |positions, version: nil|
          raise InvalidLayout, "This layout changed since it was last drawn" if version && version != KsBlocks.version_of(public_send(column))

          update!(column => Grid.place(public_send(column), positions, columns: columns, types: block_layout_types))
        end

        define_method(:fill_block) do |id, content|
          update!(column => Grid.fill(public_send(column), id, content))
        end

        define_method(:remove_block) do |id|
          update!(column => Grid.remove(public_send(column), id, types: block_layout_types))
        end

        define_method(:block_layout_kind) { kind.respond_to?(:call) ? kind.call(self) : kind }

        define_method(:block_layout_types) { KsBlocks.registry.block_types(kind: block_layout_kind) }

        define_method(:block_layout_offered) { block_layout_types }

        define_method(:layout_data) do
          KsBlocks.layout_data(public_send(column), kind: block_layout_kind, grid: { columns: columns, row_height: row_height, gap: gap, narrow_columns: narrow_columns || columns, narrow_row_height: narrow_row_height || row_height, narrow_gap: narrow_gap || gap, narrow_below: narrow_below }, offered: block_layout_offered)
        end
      end
    end
  end
end
