// public/js/map.js

window.addEventListener("load", function () {
    const mapDiv = document.getElementById("map");

    if (!mapDiv) return;

    const key = "yMgpqYhUEzM34PVZvagy";

    // Static (Malibu)
    const coordinates = [77.2088, 28.6139];


    maptilersdk.config.apiKey = key;

    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: coordinates,
        zoom: 13
    });

    new maptilersdk.Marker()
        .setLngLat(coordinates)
        .addTo(map);
});