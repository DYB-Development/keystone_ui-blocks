module KsBlocks
  module ContentHelper
    def block_contents(blocks, &block)
      tag.div(hidden: true, data: { block_contents: true }) do
        safe_join(blocks.map { |placed| tag.div(capture(placed, &block), data: { block_content: placed["id"] }) })
      end
    end
  end
end
