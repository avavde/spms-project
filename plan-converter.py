import cv2
import json
import numpy as np
import pytesseract
from pytesseract import Output

# Load the image
image_path = "plan.jpg"
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Threshold the image to get a binary image
_, binary_image = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY)

# Find contours
contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Initialize an empty list to store the rooms
rooms = []

# Loop through the contours and create rooms
for contour in contours:
    x, y, w, h = cv2.boundingRect(contour)
    if w > 50 and h > 50:  # Filter out small contours
        room = {
            "type": "Feature",
            "properties": {
                "name": f"Room {len(rooms) + 1}"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [x, y],
                    [x + w, y],
                    [x + w, y + h],
                    [x, y + h],
                    [x, y]
                ]]
            }
        }
        rooms.append(room)

# Create the GeoJSON structure
geojson = {
    "type": "FeatureCollection",
    "features": rooms
}

# Save the GeoJSON to a file
output_path = "plan.json"
with open(output_path, 'w') as json_file:
    json.dump(geojson, json_file)
