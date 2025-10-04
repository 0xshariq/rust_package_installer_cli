require "clerk"

# make sure config setup code has run (see previous step)

sdk = Clerk::SDK.new

# Create a user
create_user_request = Clerk::SDK::CreateUserRequest.new(
  first_name: "John",
  last_name: "Doe",
  email_address: ["john.doe@example.com"],
  password: "password"
)

user = sdk.users.create(create_user_request)

# List users
user_list = sdk.users.get_user_list(limit: 1)
first_user = user_list.first

# Lock that user
sdk.users.lock_user(first_user["id"])

# Unlock the user
sdk.users.unlock_user(first_user["id"])

require_relative "clerk_setup"
require "clerk"

sdk = Clerk::SDK.new

create_user_req = Clerk::SDK::CreateUserRequest.new(
  first_name: "Alice",
  last_name: "Smith",
  email_address: ["alice@example.com"],
  password: "securepassword"
)

user = sdk.users.create(create_user_req)
puts "Created user: #{user}"

users = sdk.users.get_user_list(limit: 5)
puts "User list: #{users}"

if (u = users.first)
  sdk.users.lock_user(u["id"])
  puts "Locked user #{u['id']}"
  sdk.users.unlock_user(u["id"])
  puts "Unlocked user #{u['id']}"
end
