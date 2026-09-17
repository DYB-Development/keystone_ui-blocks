require "ks_blocks"
require "ks_blocks/grid"

module KsBlocks
  module LayoutHelper
    def block_layout(blocks, columns: Grid::COLUMNS, gap: Grid::GAP, kind: nil, &block)
      tag.div(class: "ks-blocks-layout", style: "--ks-blocks-columns: #{columns}; --ks-blocks-gap: #{gap}px") do
        safe_join(block_layout_shown(blocks, kind).map { |placed| block_layout_block(placed, block_layout_type(placed, kind), &block) })
      end
    end

    private

    def block_layout_shown(blocks, kind)
      shown = kind.nil? ? blocks : blocks.select { |placed| KsBlocks.registry.block_types(kind: kind).any? { |block_type| block_type.key.to_s == placed["type"] } }
      shown.sort_by { |placed| [ placed["y"], placed["x"] ] }
    end

    def block_layout_type(placed, kind)
      KsBlocks.registry.block_types(kind: kind || :blocks).find { |block_type| block_type.key.to_s == placed["type"] }
    end

    def block_layout_block(placed, block_type, &block)
      tag.div(capture(placed, &block), data: { block: placed["id"] }, style: block_layout_placing(placed, block_type))
    end

    def block_layout_placing(placed, block_type)
      "--ks-block-x: #{placed['x']}; --ks-block-y: #{placed['y']}; --ks-block-w: #{placed['w']}; --ks-block-h: #{placed['h']}" \
        "#{block_layout_narrow(block_type)}"
    end

    def block_layout_narrow(block_type)
      return "" if block_type&.narrow_width.nil?

      "; --ks-block-narrow-w: #{block_type.narrow_width}; --ks-block-narrow-h: #{block_type.narrow_height || 1}"
    end
  end
end
