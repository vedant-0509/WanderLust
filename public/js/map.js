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

// public/js/map.js
maptilersdk.config.apiKey = mapToken; // Use the token from EJS

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: listingCoordinates, // Use coordinates from DB
    zoom: 12
});

// Add the marker
new maptilersdk.Marker({ color: "red" })
    .setLngLat(listingCoordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(`<h4>${listingLocation}</h4><p>Exact location provided after booking</p>`)
    )
    .addTo(map);