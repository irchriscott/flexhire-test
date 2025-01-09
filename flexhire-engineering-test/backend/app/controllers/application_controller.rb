class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  require 'httparty'

  # Handle CORS preflight requests
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }

  FLEXHIRE_API_URL = "https://flexhire.com/api/v2"

  # Proxy GraphQL request to Flexhire API
  def graphql_proxy_request
    request_body = JSON.parse(request.body.read)
    headers = request.headers
    query = request_body["query"]
    variables = request_body["variables"] || {}
    api_key = headers["Authorization"]

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
      "FLEXHIRE-API-KEY" => api_key
    }

    body = {
      query: query,
      variables: variables
    }.to_json

    response = HTTParty.post(FLEXHIRE_API_URL, headers: headers, body: body)

    { status: response.code, body: response.parsed_response }
  end
end
