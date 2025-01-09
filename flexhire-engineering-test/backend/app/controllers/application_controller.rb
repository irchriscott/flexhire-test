class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  require 'httparty'

  FLEXHIRE_API_URL = "https://flexhire.com/api/v2"
  FLEXHIRE_API_KEY = "v5m1lwwt4h7kuor3"

  # Proxy GraphQL request to Flexhire API
  def proxy_request
    request_body = JSON.parse(request.body.read)
    query = request_body["query"]
    variables = request_body["variables"] || {}
    api_key = request_body["apiKey"] || FLEXHIRE_API_KEY

    if api_key.nil? || api_key.strip.empty?
      render json: { error: "API key is required" }, status: :unauthorized
      return
    end

    response = send_request_to_flexhire(query, variables, api_key)
    render json: response[:body], status: response[:status]
  end

  private

  def send_request_to_flexhire(query, variables, api_key)
    headers = {
      "Content-Type" => "application/json",
      "FLEXHIRE-API-KEY" => FLEXHIRE_API_KEY
    }

    body = {
      query: query,
      variables: variables
    }.to_json

    response = HTTParty.post(FLEXHIRE_API_URL, headers: headers, body: body)

    { status: response.code, body: response.parsed_response }
  end

  # CORS handling for preflight requests
  def handle_options
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization'
    head :ok
  end
end
