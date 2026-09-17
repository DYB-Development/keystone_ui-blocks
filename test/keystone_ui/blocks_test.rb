# frozen_string_literal: true

require "test_helper"

module KeystoneUi
  module Blocks
    class BlocksTest < ActiveSupport::TestCase
      test "the gem brings the React engine with it, so a host can load the script React comes on" do
        assert defined?(KeystoneUi::React::Engine)
      end
    end
  end
end
