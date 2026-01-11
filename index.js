const apiKey = '52YSN8J92D1WK5W2945QJME0YC'; 
const url = 'https://api.climatiq.io/data/v1/estimate';

const data = {
  emission_factor: {
    activity_id: 'consumer_goods-type_butter_and_dry_and_canned_dairy_products',
    year: 2020,
    source_lca_activity: 'cradle_to_gate',
    data_version: '^20',
  },
  parameters: {
    money: 500,
    money_unit: 'usd',
  },
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(json => {
    console.log(json);
  })
  .catch(error => {
    console.error('Error:', error);
  });



