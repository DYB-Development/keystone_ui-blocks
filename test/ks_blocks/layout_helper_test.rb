require "test_helper"
require "ks_blocks/layout_helper"

module KsBlocks
  class LayoutHelperTest < ActionView::TestCase
    include KsBlocks::LayoutHelper

    test "a block is placed at the column and row it was saved at" do
      blocks = [ { "id" => "b1", "type" => "text", "x" => 3, "y" => 2, "w" => 4, "h" => 2 } ]

      rendered = block_layout(blocks, columns: 12) { |block| block["id"] }

      assert_match(/grid-column: ?4 ?\/ ?span 4; ?grid-row: ?3 ?\/ ?span 2/, rendered)
    end

    test "blocks come out in reading order, across the grid and then down" do
      blocks = [
        { "id" => "lower", "type" => "text", "x" => 0, "y" => 2, "w" => 6, "h" => 2 },
        { "id" => "right", "type" => "text", "x" => 6, "y" => 0, "w" => 6, "h" => 2 },
        { "id" => "left", "type" => "text", "x" => 0, "y" => 0, "w" => 6, "h" => 2 }
      ]

      rendered = block_layout(blocks, columns: 12) { |block| block["id"] }

      assert_equal %w[left right lower], rendered.scan(/>(\w+)</).flatten
    end

    test "a block whose type is no longer registered is left out" do
      KsBlocks.block(:still_here, name: "Still here", width: 6, height: 2, kind: :shown_layouts)
      blocks = [
        { "id" => "kept", "type" => "still_here", "x" => 0, "y" => 0, "w" => 6, "h" => 2 },
        { "id" => "gone", "type" => "retired", "x" => 6, "y" => 0, "w" => 6, "h" => 2 }
      ]

      rendered = block_layout(blocks, columns: 12, kind: :shown_layouts) { |block| block["id"] }

      assert_equal %w[kept], rendered.scan(/>(\w+)</).flatten
    end
  end
end
