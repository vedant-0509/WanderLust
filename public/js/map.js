// public/js/map.js

window.addEventListener("load", function () {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const key = "yMgpqYhUEzM34PVZvagy";
    maptilersdk.config.apiKey = key;


    // ✅ Default fallback (Delhi)
    let defaultCoords = [77.1025, 28.7041];

    // ✅ Get listing coordinates (if available from EJS)
    let listingCoords = window.listingCoordinates || defaultCoords;

    // ✅ Initialize map
    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.STREETS,
        center: listingCoords,
        zoom: 13
    });

    // 📍 Add listing marker
    new maptilersdk.Marker({ color: "blue" })
        .setLngLat(listingCoords)
        .setPopup(
            new maptilersdk.Popup().setText("Listing Location 📍")
        )
        .addTo(map);
});