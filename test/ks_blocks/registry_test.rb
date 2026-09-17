require "test_helper"
require "ks_blocks/registry"

module KsBlocks
  class RegistryTest < ActiveSupport::TestCase
    test "registering a block type makes it findable by its key" do
      registry = Registry.new
      registry.register(BlockType.new(key: :heading, name: "Heading", width: 12, height: 1))

      assert_equal [ :heading ], registry.block_types.map(&:key)
    end

    test "only the block types registered for a kind of layout are offered for it" do
      registry = Registry.new
      registry.register(BlockType.new(key: :heading, name: "Heading", width: 12, height: 1), kind: :pages)
      registry.register(BlockType.new(key: :revenue, name: "Revenue", width: 6, height: 2), kind: :dashboards)

      assert_equal [ :heading ], registry.block_types(kind: :pages).map(&:key)
    end
  end
end
