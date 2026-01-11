$API_URL = "https://api.climatiq.io/emission-factors"
$API_KEY = "6D0K850P610V309BE8WS7MBQ80"

$headers = @{
    "Authorization" = "Bearer $API_KEY"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri $API_URL -Method Get -Headers $headers
$response
