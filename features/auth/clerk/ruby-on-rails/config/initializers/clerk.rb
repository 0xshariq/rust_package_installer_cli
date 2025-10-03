Clerk.configure do |c|
  c.secret_key = ENV["CLERK_SECRET_KEY"]  # or "your_secret_key"
  c.logger     = Logger.new(STDOUT)       # optional, gives you logs
end
