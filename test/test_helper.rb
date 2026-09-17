# frozen_string_literal: true

ENV["RAILS_ENV"] = "test"

require "minitest/autorun"
require "active_record"
require "action_controller/railtie"
require "action_view/railtie"

class TestApp < Rails::Application
  config.root = File.expand_path("..", __dir__)
  config.eager_load = false
  config.secret_key_base = "keystone_ui_blocks_test"
  config.logger = Logger.new(IO::NULL)
end

TestApp.initialize!

require "rails/test_help"
require "action_view/test_case"
require_relative "../lib/ks_blocks"

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")

ActiveRecord::Schema.verbose = false
ActiveRecord::Schema.define do
  create_table :hosts, force: true do |table|
    table.string :name
    table.json :blocks, default: []
  end
end
