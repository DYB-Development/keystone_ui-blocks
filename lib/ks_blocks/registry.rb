require "ks_blocks/block_type"

module KsBlocks
  class Registry
    def initialize
      @block_types = {}
    end

    def register(block_type, kind: :blocks)
      @block_types[[ kind.to_sym, block_type.key.to_sym ]] = block_type
    end

    def block_types(kind: :blocks)
      @block_types.filter_map { |(registered_kind, _key), block_type| block_type if registered_kind == kind.to_sym }
    end
  end
end
