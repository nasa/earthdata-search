require 'atomic'

# Rack middleware that keeps track of the number of active requests and can block new requests.
module Middleware
class RackRequestBlocker

  @@num_active_requests = Atomic.new(0)
  @@block_requests = Atomic.new(false)

  # Returns the number of requests the server is currently processing.
  def self.num_active_requests
    @@num_active_requests.value
  end

  # Prevents the server from accepting new requests. Any new requests will return an HTTP
  # 503 status.
  def self.block_requests!
    @@block_requests.value = true
  end

  # Allows the server to accept requests again.
  def self.allow_requests!
    @@block_requests.value = false
  end

  def initialize(app)
    @app = app
  end

  def call(env)
    increment_active_requests
    if block_requests?
      block_request(env)
    else
      @app.call(env)
    end
  ensure
    decrement_active_requests
  end

  private

  def block_requests?
    @@block_requests.value
  end

  def block_request(env)
    [503, {}, []]
  end

  def increment_active_requests
    @@num_active_requests.update { |v| v + 1 }
  end

  def decrement_active_requests
    @@num_active_requests.update { |v| v - 1 }
  end
end
end
