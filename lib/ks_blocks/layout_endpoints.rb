require "active_support/concern"
require "ks_blocks"
require "ks_blocks/grid"

module KsBlocks
  module LayoutEndpoints
    extend ActiveSupport::Concern

    included do
      rescue_from KsBlocks::InvalidLayout do |refusal|
        render json: { error: refusal.message }, status: :unprocessable_entity
      end
    end

    def layout
      data = block_layout_record.layout_data
      render json: data.merge(contents: block_contents(data[:blocks]))
    end

    def add_block
      block_type = KsBlocks.registry.block_types(kind: block_layout_record.block_layout_kind).find { |registered| registered.key.to_s == params[:type] }
      raise InvalidLayout, "No block type is registered as #{params[:type]}" unless block_type

      block_layout_record.add_block(block_type, x: params[:x], y: params[:y])
      head :no_content
    end

    def fill_block
      block_layout_record.fill_block(params[:block_id], params.require(:content).permit!.to_h)
      head :no_content
    end

    def remove_block
      block_layout_record.remove_block(params[:block_id])
      head :no_content
    end

    def block_contents(blocks)
      blocks.to_h { |block| [ block["id"], block_content(block) ] }.compact
    end

    def block_content(_block)
      nil
    end

    def place_blocks
      block_layout_record.place_blocks(params.require(:layout).map { |position| position.permit(:id, :x, :y, :w, :h).to_h }, version: params[:version])
      head :no_content
    end
  end
end
