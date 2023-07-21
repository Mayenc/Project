import requests
import json

# API endpoint URL
url = "https://api.midjourney.com/draw"

# API key
api_key = "<your_api_key>"

# Data payload for the request
data = {
    "text": "a cute cat sitting on a table",
    "model": "default",
    "apiKey": api_key
}

# Send the API request
response = requests.post(url, data=data)

# Get the response data as JSON
response_data = json.loads(response.content)

# Get the image URL from the response data
image_url = response_data.get("image_url")

# Download the image
image_response = requests.get(image_url)

# Save the image to a file
with open("cat.png", "wb") as f:
    f.write(image_response.content)