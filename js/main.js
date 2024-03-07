// Assign the access token
mapboxgl.accessToken = 
        'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

// Declare the map object
let map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 10.6, // Starting zoom
    minZoom: 1,
    center: [-121.986891, 47.549461] // Starting center coordinates (adjust according to your data)
});

// Define the asynchronous function to load GeoJSON data
async function geojsonFetch() {
    let response;
    response = await fetch('assets/FP-TotalPop.geojson'); // Replace 'your_geojson_data.geojson' with your actual file path
    population = await response.json();

    map.on('load', () => {
        // Add GeoJSON data as a source
        map.addSource('population', {
            type: 'geojson',
            data: population
        });

        // Circle Layer
        map.addLayer({
            id: 'population-circle',
            type: 'circle',
            source: 'population',
            paint: {
                'circle-color': '#50C878', // Replace 'your-color-attribute' with the attribute from your GeoJSON data
                'circle-radius': 5,
                'circle-opacity': 0.3
            }
        }, 'waterway-label');

        // Create legend
        const legendContainer = document.getElementById('legend-container');

        // Add legend items
        Object.entries(legendItems).forEach(([category, color]) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.style.backgroundColor = color;
            legendItem.textContent = category;

            // Add click event to toggle layer visibility
            legendItem.addEventListener('click', () => {
                toggleLayerVisibility(category);
            });

            // Append legend item to container
            legendContainer.appendChild(legendItem);
        });
    });
}

function toggleLayerVisibility(category) {
    const visibility = map.getLayoutProperty('population-circle', 'visibility');
    const visibleLayers = visibility === 'visible' ? map.getStyle().layers : [];

    if (visibleLayers.includes('population-circle')) {
        map.setLayoutProperty('population-circle', 'visibility', 'none');
    }

    map.setLayoutProperty('population-circle', 'visibility', 'visible');
    map.setFilter('population-circle', ['==', 'your-color-attribute', category]);
}

// Invoke the function to fetch GeoJSON and set up the map
geojsonFetch();

// Capture the reset element and add a click event to it
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {
    // This event will trigger a page refresh
    location.reload();
});
