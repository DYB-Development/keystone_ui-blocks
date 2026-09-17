require "test_helper"
require "ks_blocks/layout"
require "ks_blocks/layout_endpoints"

class Host < ActiveRecord::Base
  self.table_name = "hosts"
  include KsBlocks::Layout
  block_layout :blocks, kind: :pages
end

class KsBlocksHostController < ActionController::Base
  include KsBlocks::LayoutEndpoints

  private

  def block_layout_record
    Host.find(params[:id])
  end
end

module KsBlocks
  class LayoutEndpointsTest < ActionDispatch::IntegrationTest
    setup do
      KsBlocks.block(:heading, name: "Heading", width: 12, height: 1, kind: :pages)
    end

    test "a host's add endpoint puts a block of a registered type at the given place" do
      record = Host.create!(name: "Dashboard")

      with_routing do |routes|
        routes.draw { post "/hosts/:id/blocks", to: "ks_blocks_host#add_block" }
        post "/hosts/#{record.id}/blocks", params: { type: "heading", x: 0, y: 2 }, as: :json
      end

      assert_equal [ [ "heading", 0, 2 ] ], record.reload.blocks.map { |block| block.values_at("type", "x", "y") }
    end

    test "a host's place endpoint stores the positions and sizes it is sent" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)

      with_routing do |routes|
        routes.draw { patch "/hosts/:id/blocks", to: "ks_blocks_host#place_blocks" }
        patch "/hosts/#{record.id}/blocks", params: { layout: [ { id: record.blocks.first["id"], x: 6, y: 1, w: 4, h: 3 } ] }, as: :json
      end

      assert_equal [ 6, 1, 4, 3 ], record.reload.blocks.first.values_at("x", "y", "w", "h")
    end

    test "a host's fill endpoint stores the content it is sent for a block" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)

      with_routing do |routes|
        routes.draw { patch "/hosts/:id/blocks/:block_id", to: "ks_blocks_host#fill_block" }
        patch "/hosts/#{record.id}/blocks/#{record.blocks.first["id"]}", params: { content: { title: "Welcome" } }, as: :json
      end

      assert_equal({ "title" => "Welcome" }, record.reload.blocks.first["content"])
    end

    test "a host's remove endpoint takes the block off its record" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)

      with_routing do |routes|
        routes.draw { delete "/hosts/:id/blocks/:block_id", to: "ks_blocks_host#remove_block" }
        delete "/hosts/#{record.id}/blocks/#{record.blocks.first["id"]}", as: :json
      end

      assert_empty record.reload.blocks
    end

    test "a host's layout endpoint answers with its record's layout data" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)

      with_routing do |routes|
        routes.draw { get "/hosts/:id/layout", to: "ks_blocks_host#layout" }
        get "/hosts/#{record.id}/layout", as: :json

        assert_equal record.reload.blocks, response.parsed_body["blocks"]
      end
    end

    test "a host's place endpoint refuses a layout that does not fit" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)

      with_routing do |routes|
        routes.draw { patch "/hosts/:id/blocks", to: "ks_blocks_host#place_blocks" }
        patch "/hosts/#{record.id}/blocks", params: { layout: [ { id: record.blocks.first["id"], x: 9, y: 0, w: 6, h: 2 } ] }, as: :json

        assert_response :unprocessable_entity
      end
    end

    test "a host's place endpoint says why it refused a layout" do
      KsBlocks.block(:text, name: "Text", width: 6, height: 2)
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)

      with_routing do |routes|
        routes.draw { patch "/hosts/:id/blocks", to: "ks_blocks_host#place_blocks" }
        patch "/hosts/#{record.id}/blocks", params: { layout: [ { id: record.blocks.first["id"], x: 9, y: 0, w: 6, h: 2 } ] }, as: :json

        assert_equal "Text runs past the grid's last column", response.parsed_body["error"]
      end
    end

    test "a refused layout change leaves every stored position and size as it was" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)
      stored = record.blocks

      with_routing do |routes|
        routes.draw { patch "/hosts/:id/blocks", to: "ks_blocks_host#place_blocks" }
        patch "/hosts/#{record.id}/blocks", params: { layout: [ { id: stored.first["id"], x: 9, y: 0, w: 6, h: 2 } ] }, as: :json
      end

      assert_equal stored, record.reload.blocks
    end

    test "a host's add endpoint refuses a block type that is not registered" do
      record = Host.create!(name: "Dashboard")

      with_routing do |routes|
        routes.draw { post "/hosts/:id/blocks", to: "ks_blocks_host#add_block" }
        post "/hosts/#{record.id}/blocks", params: { type: "retired_widget" }, as: :json

        assert_response :unprocessable_entity
      end
    end

    test "a host's add endpoint says which block type it could not find" do
      record = Host.create!(name: "Dashboard")

      with_routing do |routes|
        routes.draw { post "/hosts/:id/blocks", to: "ks_blocks_host#add_block" }
        post "/hosts/#{record.id}/blocks", params: { type: "retired_widget" }, as: :json

        assert_equal "No block type is registered as retired_widget", response.parsed_body["error"]
      end
    end

    test "a host's place endpoint refuses positions sent against a layout version it no longer has" do
      record = Host.create!(name: "Dashboard")
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 0, y: 0)
      drawn = record.layout_data[:version]
      record.add_block(BlockType.new(key: :text, name: "Text", width: 6, height: 2), x: 6, y: 0)

      with_routing do |routes|
        routes.draw { patch "/hosts/:id/blocks", to: "ks_blocks_host#place_blocks" }
        patch "/hosts/#{record.id}/blocks", params: { version: drawn, layout: [ { id: record.blocks.first["id"], x: 0, y: 2, w: 6, h: 2 } ] }, as: :json

        assert_response :unprocessable_entity
      end
    end
  end
end
