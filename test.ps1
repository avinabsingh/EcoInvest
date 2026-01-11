$API_URL = "https://api.climatiq.io/data/v1/estimate"
$API_KEY = "6D0K850P610V309BE8WS7MBQ80"

$headers = @{
    "Authorization" = "Bearer $API_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    "emission_factor"= @{
		"activity_id"= "electronics-type_electronics_for_control_units_market_for_electronics_for_control_units"
		"source"= "ecoinvent"
		"region"= "GLOBAL"
		"year"= 2011
		"source_lca_activity"= "unknown"
		"data_version"= "^20"
	}
	"parameters"= @{
		"weight"= 80
		"weight_unit"= "t"
	}
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri $API_URL -Method Post -Headers $headers -Body $body
$response
