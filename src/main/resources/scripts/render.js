<script>

    var genericMarkerObjs = [];
    var genericFenceObjs = [];
    var genericPathObjs = [];
    var genericCircleObjs = [];

    var DEFAULT_CENTRE = [12.9160463,77.5967117];
    var DEFAULT_RADIUS = 2500;

    var map = null;
    var markerClusterGroup = null;
    var fencesGroup = null;
    var circlesGroup = null;
    var pathsGroup = null;

    var markers = []
    var fences = []
    var paths = []
    var circles = []

    var isLoading = false;
    var layers = "bikes,parking"


    function bootstrap() {
        console.log("bootstrap()")

        setupMap();
        updateMarkers();
        renderMarkers();

        updateFences();
        renderFences();

        updatePaths();
        renderPaths();

        updateCircles();
        renderCircles();
    }

    function renderMarkers() {
        try{
            console.log("renderMarkers()")
            markerClusterGroup = L.markerClusterGroup();
            for(var i = 0; i < genericMarkerObjs.length; i++) {
                var markerData = genericMarkerObjs[i];
                var markerIcon = L.icon({
                   iconUrl: markerData.iconUrl,
                   iconSize:     [50, 50], // size of the icon
                });;

                var marker = L.marker([markerData.location.lat, markerData.location.lon],{icon: markerIcon});

                var popupInfo = "<br/><div class='border'><div class='p-2 text-monospace'>";

                popupInfo += "<b>" + markerData.title + "</b><br/>" + markerData.subtext + "<br/>";
                if(markerData.data) {
                    for(var key in markerData.data) {
                        popupInfo += "<div>" + key + " : " + markerData.data[key] + "</div>";
                    }
                }
                popupInfo += "</div></div><br/>";
                marker.bindPopup(popupInfo);
                marker.text = markerData.title + " / " + markerData.subtext;
                marker.alt = markerData.title + " / " + markerData.subtext;
                markers.push(marker);
            }
            markerClusterGroup.addLayers(markers);
            map.addLayer(markerClusterGroup);
        } catch(err) {
            console.log(err);
        }
    }

    function renderFences(fitToBounds) {
        try{
            console.log("renderFences()");
            fencesGroup = L.layerGroup();
            var layerAdded = null;
            for(var i = 0; i < genericFenceObjs.length; i++) {
                var fenceData = genericFenceObjs[i];
                var points = getPoints(fenceData.points);
                var fence = L.polygon(points, {fillColor: fenceData.fillColor, fillOpacity: fenceData.fillOpacity, color: fenceData.color});
                var popupInfo = "<br/><div class='border'><div class='p-2 text-monospace'>";
                if(fenceData.data) {
                    for(var key in fenceData.data) {
                        popupInfo += "<div>" + key + " : " + fenceData.data[key] + "</div>";
                    }
                }
                popupInfo += "</div></div><br/>";
                fence.bindPopup(popupInfo);
                fences.push(fence);
                fencesGroup.addLayer(fence);
                layerAdded = fence;
            }
            console.log("fitToBounds : " + fitToBounds);
            if(layerAdded && fitToBounds) {
                map.fitBounds(layerAdded.getBounds());
            }
            fencesGroup.addTo(map);
        } catch(err) {
            console.log(err);
        }
    }

    function renderPaths(fitToBounds) {
        try{
            console.log("renderPaths()");
            pathsGroup = L.layerGroup();

            var layerAdded = null;
            for(var i = 0; i < genericPathObjs.length; i++) {
                var pathData = genericPathObjs[i];
                var points = getPoints(pathData.points);
                var path = L.polyline(points, {color: pathData.color});
                var popupInfo = "<br/><div class='border'><div class='p-2 text-monospace'>";
                if(pathData.data) {
                    for(var key in pathData.data) {
                        popupInfo += "<div>" + key + " : " + pathData.data[key] + "</div>";
                    }
                }
                popupInfo += "</div></div><br/>";
                path.bindPopup(popupInfo);
                paths.push(path);
                pathsGroup.addLayer(path);
                layerAdded = path;
            }
            pathsGroup.addTo(map);
            if(layerAdded && fitToBounds) {
                map.fitBounds(layerAdded.getBounds());
            }
        }catch(err) {
            console.log(err);
        }
    }

    function renderCircles(fitToBounds) {
        try{
            console.log("renderCircles()");
            circlesGroup = L.layerGroup();
            layerAdded = null;
            for(var i = 0; i < genericCircleObjs.length; i++) {
                var circleData = genericCircleObjs[i];
                point = [circleData.location.lat, circleData.location.lon];
                var circle = L.circle(point, {fillColor: circleData.fillColor, fillOpacity: circleData.fillOpacity, color: circleData.color, radius: circleData.radius});
                var popupInfo = "<br/><div class='border'><div class='p-2 text-monospace'>";
                if(circleData.data) {
                    for(var key in circleData.data) {
                        popupInfo += "<div>" + key + " : " + circleData.data[key] + "</div>";
                    }
                }
                popupInfo += "</div></div><br/>";
                circle.bindPopup(popupInfo);
                circles.push(circle);
                circlesGroup.addLayer(circle);
                layerAdded = circle;
            }
            if(layerAdded && fitToBounds) {
    //            map.fitBounds(layerAdded.getBounds());
                console.log("Don't support fitBounds on circles")
            }
            circlesGroup.addTo(map);
        } catch(err) {
            console.log(err);
        }
    }

    function updateMarkers() {
        markerData = $('#markerData')[0].innerText;
        if(markerData.length > 0) {
            arr = JSON.parse($('#markerData')[0].innerText);
            genericMarkerObjs = arr;
        }
    }

    function updateFences() {
        fenceData = $('#fenceData')[0].innerText;
        if(fenceData.length > 0) {
            arr = JSON.parse($('#fenceData')[0].innerText);
            genericFenceObjs = arr;
        }
    }

    function updatePaths() {
        pathData = $('#pathData')[0].innerText;
        if(pathData.length > 0) {
            arr = JSON.parse($('#pathData')[0].innerText);
            genericPathObjs = arr;
        }
    }

    function updateCircles() {
        circleData = $('#circleData')[0].innerText;
        if(circleData.length > 0) {
            arr = JSON.parse($('#circleData')[0].innerText);
            genericCircleObjs = arr;
        }
    }

    function clearMarkers() {
        map.removeLayer(markerClusterGroup);
        markerClusterGroup.clearLayers();
        markers = [];
        markerClusterGroup = null;
    }

    function clearFences() {
        map.removeLayer(fencesGroup);
        fencesGroup.clearLayers();
        fences = [];
        fencesGroup = null;
    }

    function clearCircles() {
        map.removeLayer(circlesGroup);
        circlesGroup.clearLayers();
        circles = [];
        circlesGroup = null;
    }

    function clearPaths() {
        map.removeLayer(pathsGroup);
        pathsGroup.clearLayers();
        paths = [];
        pathsGroup = null;
    }

    function getMarkers() {
        return genericMarkerObjs;
    }

    function getFences() {
        return genericFenceObjs;
    }

    function getPaths() {
        return genericPathObjs;
    }

    function getCircles() {
        return genericCircleObjs;
    }

    function setupMap() {
        var loc = $('#freemarker_location')[0].innerText;
        if(loc.length > 0) {
            DEFAULT_CENTRE = [parseFloat(loc.split(",")[0]), parseFloat(loc.split(",")[1])];
        }
        tempLayers = $('#freemarker_layers')[0].innerText;
        if(tempLayers.length > 0) {
            layers = tempLayers;
        }

        map = L.map('mapDiv').setView(DEFAULT_CENTRE, 17);
        map.on('moveend', onMapEvent);
        isLoading = false;

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VzaGVlbGsiLCJhIjoiY2s3NHR3YjN1MDhxOTNrcGxreGM2bmxwdiJ9.h0asAA-St15DH7sCIc0drw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);
    }

    function onMapEvent(event) {
        console.log("onMapEvent");
        console.log(event);
        // If move is set to true. hit api to fetch data and set it using js. Only for home page
    }

    function showLoader(flag) {
        console.log("showLoader() : " + flag)
        isLoading = flag;
        if(flag) {
            $('#progressBar')[0].hidden = false;
        } else {
            $('#progressBar')[0].hidden = true;
        }
    }

    function invalidateMap(tMarkers, tFences, tCircles, tPaths, fitToBounds = false) {
        console.log("fitToBounds : " + fitToBounds);
        if(tMarkers != null) {
            $('#markerData')[0].innerText = JSON.stringify(tMarkers);
        }
        if(tFences != null) {
            $('#fenceData')[0].innerText = JSON.stringify(tFences);
        }
        if(tCircles != null) {
            $('#circleData')[0].innerText = JSON.stringify(tCircles);
        }
        if(tPaths != null) {
            $('#pathData')[0].innerText = JSON.stringify(tPaths);
        }

        clearMarkers();
        clearFences();
        clearPaths();
        clearCircles();

        updateMarkers();
        updateFences();
        updateCircles();
        updatePaths();

        renderMarkers();
        renderFences(fitToBounds);
        renderCircles(fitToBounds);
        renderPaths(fitToBounds);

        if(tMarkers != null && tMarkers.length > 0 && fitToBounds) {
            map.fitBounds(markerClusterGroup.getBounds());
        }
    }

    function getMapRadiusInMeters() {
        var mapBoundNorthEast = map.getBounds().getNorthEast();
        var mapDistance = mapBoundNorthEast.distanceTo(map.getCenter());
        return mapDistance;
    }

    bootstrap();

</script>