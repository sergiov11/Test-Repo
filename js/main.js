// Assign the access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

// Declare the map object
const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 10.6, // Starting zoom
    minZoom: 1,
    center: [-121.986891, 47.549461] // Starting center coordinates (adjust according to your data)
});

// Define the asynchronous function to load GeoJSON data
async function geojsonFetch() {
    try {
        // Fetch GeoJSON data for population, floodways, and high-risk areas
        const response1 = await fetch('assets/FP-TotalPop.geojson');
        const fpTotalPopData = await response1.json();

        const response2 = await fetch('assets/floodways.geojson');
        const floodwaysData = await response2.json();

        const response3 = await fetch('assets/high-risk.geojson');
        const highRiskData = await response3.json();

        // Once GeoJSON data is fetched, set up map layers and legend
        map.on('load', () => {
            // Add GeoJSON data as sources
            map.addSource('population', {
                type: 'geojson',
                data: fpTotalPopData
            });

            map.addSource('floodway', {
                type: 'geojson',
                data: floodwaysData
            });

            map.addSource('floodrisk', {
                type: 'geojson',
                data: highRiskData
            });

            // Circle Layer for population
            map.addLayer({
                id: 'population-circle',
                type: 'circle',
                source: 'population',
                paint: {
                    'circle-color': '#50C878',
                    'circle-radius': 5,
                    'circle-opacity': 0.5
                },
                layout: {
                    'visibility': 'visible' // Make population circle layer initially visible
                }
            }, 'waterway-label');

            // Line Layer for high-risk areas
            map.addLayer({
                id: 'risk-line',
                type: 'line',
                source: 'floodrisk',
                paint: {
                    'line-color': '#EE4B2B',
                    'line-opacity': 0.7
                },
                layout: {
                    'visibility': 'none' // Make risk line layer initially hidden
                }
            }, 'waterway-label');

            // Line Layer for floodways
            map.addLayer({
                id: 'flood-line',
                type: 'line',
                source: 'floodway',
                paint: {
                    'line-color': '#5C4033',
                    'line-opacity': 0.7
                },
                layout: {
                    'visibility': 'none' // Make flood line layer initially hidden
                }
            }, 'waterway-label');

            // Create legend
            const legendContainer = document.getElementById('legend-container');

            // Define legend items with appropriate categories and colors
            const legendItems = {
                'Population': '#50C878',
                'High Risk': '#EE4B2B',
                'Floodways': '#5C4033'
            };

            // Add legend items with click event to toggle layer visibility
            Object.entries(legendItems).forEach(([category, color]) => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.style.backgroundColor = color;
                legendItem.textContent = category;
                legendItem.addEventListener('click', () => {
                    toggleLayerVisibility(category);
                });
                legendContainer.appendChild(legendItem);
            });
        });
    } catch (error) {
        console.error('Error loading GeoJSON data:', error);
    }
}

// Function to toggle layer visibility based on selected category
function toggleLayerVisibility(category) {
    // Toggle visibility for all layers based on the selected category
    ['population-circle', 'risk-line', 'flood-line'].forEach(layerId => {
        // Check if the layerId contains the category name
        const isMatchingLayer = layerId.includes(category.toLowerCase());

        // Set visibility based on whether the layer matches the selected category
        const visibility = isMatchingLayer ? 'visible' : 'none';
        map.setLayoutProperty(layerId, 'visibility', visibility);
    });
}

// Invoke the function to fetch GeoJSON and set up the map
geojsonFetch();

// Capture the reset element and add a click event to it
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {
    // This event will trigger a page refresh
    location.reload();
});

