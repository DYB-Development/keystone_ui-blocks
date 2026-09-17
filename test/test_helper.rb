# frozen_string_literal: true

require "minitest/autorun"
require "active_support"
require "active_support/test_case"
require "active_record"
require_relative "../lib/ks_blocks"

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")

ActiveRecord::Schema.verbose = false
ActiveRecord::Schema.define do
  create_table :hosts, force: true do |table|
    table.string :name
    table.json :blocks, default: []
  end
end
