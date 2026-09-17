require "ks_blocks"
require "ks_blocks/grid"

module KsBlocks
  module LayoutHelper
    def block_layout(blocks, columns: Grid::COLUMNS, gap: Grid::GAP, kind: nil, &block)
      tag.div(class: "ks-blocks-layout", style: "--ks-blocks-columns: #{columns}; --ks-blocks-gap: #{gap}px") do
        safe_join(block_layout_shown(blocks, kind).map { |placed| block_layout_block(placed, &block) })
      end
    end

    private

    def block_layout_shown(blocks, kind)
      shown = kind.nil? ? blocks : blocks.select { |placed| KsBlocks.registry.block_types(kind: kind).any? { |block_type| block_type.key.to_s == placed["type"] } }
      shown.sort_by { |placed| [ placed["y"], placed["x"] ] }
    end

    def block_layout_block(placed, &block)
      tag.div(capture(placed, &block), data: { block: placed["id"] }, style: "grid-column: #{placed['x'] + 1} / span #{placed['w']}; grid-row: #{placed['y'] + 1} / span #{placed['h']}")
    end
  end
end
