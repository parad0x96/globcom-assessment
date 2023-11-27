
const socket = new WebSocket('ws://localhost:8000/ws/sensor-data/');

const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

const trace = {
    x: [],
    y: [],
    z: [],
    type: 'heatmap',
    colorscale: 'Viridis'
};

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

const plotDiv = document.getElementById('plot');
Plotly.newPlot(plotDiv, [trace], layout);
const sensorData = {};

const sensorMarkers = {};

function populateSensorSelect() {
    const sensorSelect = document.getElementById('sensorSelect');
    const prevSelectedSensor = sensorSelect.value;
    sensorSelect.innerHTML = ''; 
    for (const sensorId in sensorData) {
        const option = document.createElement('option');
        option.value = sensorId;
        option.textContent = `Sensor ${sensorId}`;
        sensorSelect.appendChild(option);
    }
    sensorSelect.value = prevSelectedSensor;
}

function updateMarkerPosition(selectedSensor) {
    const data = sensorData[selectedSensor];
    const marker = sensorMarkers[selectedSensor];
    marker.setLatLng([data.latitude, data.longitude]);
}

function updatePlot(selectedSensor) {
    const data = sensorData[selectedSensor];
    trace.x = data.x;
    trace.y = data.y;
    trace.z = data.z;
    Plotly.update(plotDiv, [trace], layout);
}

let selectedSensor = null;

function handleInitialSensorData(data) {
    for (const newData of data) {
        const sensorId = newData.sensor_id;
        if (!(sensorId.toString() in sensorData)) {
            sensorData[sensorId] = {
                x: [],
                y: [],
                z: [],
                latitude: newData.latitude,
                longitude: newData.longitude
            };
        }

        const sensor = sensorData[sensorId];
        sensor.latitude = newData.latitude;
        sensor.longitude = newData.longitude;
        sensor.x.push(newData.longitude);
        sensor.y.push(newData.latitude);
        sensor.z.push(newData.value);

        if (!(sensorId in sensorMarkers)) {
            const marker = L.marker([newData.latitude, newData.longitude]);
            marker.bindPopup(`Sensor ID: ${sensorId}`);
            sensorMarkers[sensorId] = marker.addTo(map);
        }
    }

    populateSensorSelect();
}

socket.onmessage = function (event) {
    const newData = JSON.parse(event.data).message;
    const sensorId = newData.sensor_id;
    if (!(sensorId.toString() in sensorData)) {
        sensorData[sensorId] = {
            x: [],
            y: [],
            z: [],
            latitude: newData.latitude,
            longitude: newData.longitude
        };
        populateSensorSelect();
    }

    const data = sensorData[sensorId];

    data.latitude = newData.latitude;
    data.longitude = newData.longitude;
    data.x.push(newData.longitude);
    data.y.push(newData.latitude);
    data.z.push(newData.value);

    if (selectedSensor && selectedSensor === sensorId) {
        updateMarkerPosition(selectedSensor);
        updatePlot(selectedSensor);
    }

    if (!(sensorId in sensorMarkers)) {
        const marker = L.marker([newData.latitude, newData.longitude]);
        marker.bindPopup(`Sensor ID: ${sensorId}`);
        sensorMarkers[sensorId] = marker.addTo(map);
    }
};

const sensorSelect = document.getElementById('sensorSelect');
sensorSelect.addEventListener('change', function () {
    selectedSensor = this.value;
    updateMarkerPosition(selectedSensor);
    updatePlot(selectedSensor);
});

