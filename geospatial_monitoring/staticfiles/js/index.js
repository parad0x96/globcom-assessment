// WebSocket initialization
const socket = new WebSocket('ws://localhost:8000/ws/sensor-data/');

// Create Leaflet map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Create an empty trace
const trace = {
    x: [],
    y: [],
    z: [],
    type: 'heatmap',
    colorscale: 'Viridis'
};

// Define the layout
const layout = {
    title: '',
    xaxis: {
        title: 'Longitude',
        range: [-90, 90]
    },
    yaxis: {
        title: 'Latitude',
        range: [-180, 180]
    }
};

// Create the initial plot
const plotDiv = document.getElementById('plot');
Plotly.newPlot(plotDiv, [trace], layout);

// Store the sensor data
const sensorData = {};


// Store markers for each sensor
const sensorMarkers = {};

// Populate the sensor select dropdown
function populateSensorSelect() {
    const sensorSelect = document.getElementById('sensorSelect');
    const prevSelectedSensor = sensorSelect.value; // Store the current selected sensor
    sensorSelect.innerHTML = ''; // Clear previous options
    for (const sensorId in sensorData) {
        const option = document.createElement('option');
        option.value = sensorId;
        option.textContent = sensorId;
        sensorSelect.appendChild(option);
    }
    sensorSelect.value = prevSelectedSensor; // Restore the selected sensor
}

// Helper function to update the marker position based on the selected sensor
function updateMarkerPosition(selectedSensor) {
    const data = sensorData[selectedSensor];
    const marker = sensorMarkers[selectedSensor];
    marker.setLatLng([data.latitude, data.longitude]);
}

// Helper function to update the plot based on the selected sensor
function updatePlot(selectedSensor) {
    const data = sensorData[selectedSensor];
    trace.x = data.x;
    trace.y = data.y;
    trace.z = data.z;
    Plotly.update(plotDiv, [trace], layout);
}

// Global variable for selected sensor
let selectedSensor = null;

// WebSocket event listener
socket.onmessage = function (event) {
    const newData = JSON.parse(event.data).message;
    console.log("THE SENSOR DATA", sensorData)
    // Store the data by sensor ID
    const sensorId = newData.sensor_id;
    if (!(sensorId.toString() in sensorData)) {
        sensorData[sensorId] = {
            x: [],
            y: [],
            z: [],
            latitude: newData.latitude,
            longitude: newData.longitude
        };
        populateSensorSelect(); // Update the sensor select dropdown
    }

    const data = sensorData[sensorId];

    // Update the position for the sensor
    data.latitude = newData.latitude;
    data.longitude = newData.longitude;

    // Update the data for the sensor
    data.x.push(newData.longitude);
    data.y.push(newData.latitude);
    data.z.push(newData.value);

    // If the selected sensor is currently displayed, update the marker position and plot
    if (selectedSensor && selectedSensor === sensorId) {
        updateMarkerPosition(selectedSensor);
        updatePlot(selectedSensor);
    }

    // Create or update the marker for the sensor
    if (!(sensorId in sensorMarkers)) {
        const marker = L.marker([newData.latitude, newData.longitude]);
        marker.bindPopup(`Sensor ID: ${sensorId}`);
        sensorMarkers[sensorId] = marker.addTo(map);
    }
};

// Event listener for sensor select change
const sensorSelect = document.getElementById('sensorSelect');
sensorSelect.addEventListener('change', function () {
    selectedSensor = this.value;
    updateMarkerPosition(selectedSensor);
    updatePlot(selectedSensor);
});