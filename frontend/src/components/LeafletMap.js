import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';

const LeafletMap = ({ floorPlan }) => {
  useEffect(() => {
    const map = L.map('map').setView([0, 0], 1);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (floorPlan) {
      const fileType = floorPlan.file_type;

      if (fileType === 'application/json') {
        // Assuming the JSON file is in GeoJSON format
        const geoJsonLayer = L.geoJson(floorPlan.content);
        geoJsonLayer.addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
      } else if (fileType.startsWith('image/')) {
        const imageUrl = floorPlan.file_url;
        const imageBounds = [[0, 0], [1000, 1000]]; // You might want to dynamically calculate the bounds
        L.imageOverlay(imageUrl, imageBounds).addTo(map);
        map.fitBounds(imageBounds);
      }
    }

    return () => {
      map.remove();
    };
  }, [floorPlan]);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}></div>
  );
};

LeafletMap.propTypes = {
  floorPlan: PropTypes.shape({
    file_type: PropTypes.string.isRequired,
    file_url: PropTypes.string,
    content: PropTypes.object,
  })
};

export default LeafletMap;
