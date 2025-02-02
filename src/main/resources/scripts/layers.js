<script>

    function refreshLayers(coords, radius) {
        console.log("refreshLayers()");
        data = {};
        data.lat = coords[0];
        data.lon = coords[1];
        data.radius = radius;

        data.searchQuery = query;
        if(isLoading && !refresh) {
            console.log("Not refreshing cause already loading");
            return;
        }
        showLoader(true);

        var searchUrl = $('#freemarker_searchurl')[0].innerText;

        // check if geojson is non emplty. If so, hit geojson search api
        var geojson = $('#freemarker_geojson')[0].innerText;
        if(geojson && geojson.length > 0) {
            searchGeojsonNearby();
            return;
        }

        console.log("Origin here");
        httpPost(searchUrl, data, function(response) {
            invalidateMap(response.data.markers, response.data.fences, response.data.circles, response.data.paths, response.data.events, response.data.form, response.data.isSidebar, false, response.data.autoRefresh, response.data);
            showLoader(false);
        }, function(jqXHR, exceptiom) {
             showLoader(false);
        });
    }

    function onMapEvent(event) {
        console.log("Layers onMapEvent");
        console.log(event);

        if(isLoading || !refresh) {
            return;
        }

        setTimeout(function() {
            searchLayers(true);
        }, 1500);
    }

    function searchGeojsonNearby() {
        pos = map.getCenter();
        radius = getMapRadiusInMeters();

        var data = {};
        data.lat = pos.lat;
        data.lon = pos.lng;
        data.radius = radius;
        data.path = window.location.pathname;

        showLoader(true);
        httpPost("/geofence/search", data, function(response) {
            console.log(response);
            showLoader(false);
            clearMarkers();
            clearAllLayers();
            renderGeoJsonArray(response.geojson, false);
        }, function(jqXHR, exceptiom) {
             showLoader(false);
        });
    }

    function searchLayers(isMapEvent) {
        if(isLoading) {
            return;
        }
        console.log("Empty search query. So searching wherever the map is active")
        pos = map.getCenter();
        if(typeof center !== 'undefined') {
            newLatLon = [pos.lat, pos.lng];
            oldLatLon = center;
            distanceBetweenTwo = distance(oldLatLon[0], oldLatLon[1], newLatLon[0], newLatLon[1], "K");
            console.log("Distance Changed beteen map movements : " + distanceBetweenTwo);
            if(distanceBetweenTwo < .2) {
                console.log("Not a significant movement. So not refreshing");
                return;
            }
        }
        center = [pos.lat, pos.lng];
        radius = getMapRadiusInMeters();
        refreshLayers(center, radius);
    }

    if(refresh || query.length > 1) {
        if(isJson(query)) {
            console.log("Path contains search query. So trying to search" + query);
            var qJSON = JSON.parse(query);
            getSearchData(qJSON);
        } else {
            var coordsLayers = [];
            refreshLayers([map.getCenter().lat, map.getCenter().lng], getMapRadiusInMeters());
        }
    }
    map.on('moveend', onMapEvent);

</script>