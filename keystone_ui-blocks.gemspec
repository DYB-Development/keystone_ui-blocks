# frozen_string_literal: true

require_relative "lib/keystone_ui/blocks/version"

Gem::Specification.new do |spec|
  spec.name = "keystone_ui-blocks"
  spec.version = KeystoneUi::Blocks::VERSION
  spec.authors = [ "Tyler Schneider" ]
  spec.email = [ "tylercschneider@gmail.com" ]

  spec.summary = "A drag-and-drop block grid for Rails engine gems."
  spec.description = "Block types a host registers, a layout its own record keeps, and a grid a designer arranges blocks on, following keystone_ui's design."
  spec.homepage = "https://github.com/DYB-Development/keystone_ui-blocks"
  spec.license = "MIT"

  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "#{spec.homepage}/blob/main/CHANGELOG.md"
  spec.metadata["bug_tracker_uri"] = "#{spec.homepage}/issues"
  spec.metadata["documentation_uri"] = "#{spec.homepage}#readme"
  spec.metadata["rubygems_mfa_required"] = "true"

  spec.required_ruby_version = ">= 3.2.0"

  spec.files = Dir["lib/**/*", "app/**/*"] + [ "MIT-LICENSE" ]
  spec.require_paths = [ "lib" ]

  spec.add_dependency "railties", ">= 7.0"
  spec.add_dependency "activesupport", ">= 7.0"
  spec.add_dependency "actionview", ">= 7.0"
  spec.add_dependency "keystone_ui-react", ">= 0.1.2"
end
