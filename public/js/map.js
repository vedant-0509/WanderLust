document.addEventListener("DOMContentLoaded", () => {

    const fallback = [19.0760, 72.8777];

    let coords = listingCoordinates;

    let listingLatLng;

    
    if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
    ) {
        // convert [lng, lat] → [lat, lng]
        listingLatLng = [coords[1], coords[0]];
    } else {
        console.warn("Invalid or missing coordinates, using fallback");
        listingLatLng = fallback;
    }

    const map = L.map('map').setView(listingLatLng, 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);


    const redIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -30]
    });

    L.marker(listingLatLng, { icon: redIcon })
        .addTo(map)
        .bindPopup(`<b>${listingTitle}</b>`)
        .openPopup();


    L.control.scale({
        position: "bottomleft",
        metric: true,
        imperial: false
    }).addTo(map);
});