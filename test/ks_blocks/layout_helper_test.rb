require "test_helper"
require "ks_blocks/layout_helper"

module KsBlocks
  class LayoutHelperTest < ActionView::TestCase
    include KsBlocks::LayoutHelper

    test "a block is placed at the column and row it was saved at" do
      blocks = [ { "id" => "b1", "type" => "text", "x" => 3, "y" => 2, "w" => 4, "h" => 2 } ]

      rendered = block_layout(blocks, columns: 12) { |block| block["id"] }

      assert_match(/--ks-block-x: ?3; ?--ks-block-y: ?2; ?--ks-block-w: ?4; ?--ks-block-h: ?2/, rendered)
    end

    test "a block carries the size its type renders at on a narrow screen" do
      KsBlocks.block(:narrow_shown, name: "Narrow", width: 6, height: 4, kind: :narrow_shown, narrow_width: 12, narrow_height: 2)
      blocks = [ { "id" => "b1", "type" => "narrow_shown", "x" => 0, "y" => 0, "w" => 6, "h" => 4 } ]

      rendered = block_layout(blocks, columns: 12, kind: :narrow_shown) { |block| block["id"] }

      assert_match(/--ks-block-narrow-w: ?12; ?--ks-block-narrow-h: ?2/, rendered)
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
