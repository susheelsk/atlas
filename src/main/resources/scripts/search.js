<script>

    function setupSearch() {
        var tableView = $('#freemarker_tableView')[0].innerText;
        if(!tableView || tableView != "true") {
            setupSearchForMapView();
        } else {
            var searchDataSchemaStr = $('#freemarker_searchDataSchema')[0].innerText;
            $('#freemarker_searchDataSchema')[0].innerText = '{"where":{"type":"string","title":"Search", "description": "Search for records by typing in the where part of the query here"}}';
            searchDataSchemaStr = $('#freemarker_searchDataSchema')[0].innerText;

            var searchDataSchema = JSON.parse(searchDataSchemaStr);
            console.log(searchDataSchema);
            $('#dropdownMenuSearchDiv').jsonForm({
                schema: searchDataSchema,
                form: [
                          "*",
                          {
                            "type": "submit",
                            "title": "Search"
                          }
                        ],
                onSubmit: function (errors, values) {
                  searchTableData(values);
                }
            });
        }
    }

    function setupSearchForMapView() {
        var searchDataSchemaStr = $('#freemarker_searchDataSchema')[0].innerText;
        if(searchDataSchemaStr == 'null') {
            var searchText = $('#freemarker_searchtext')[0].innerText;
            $('#freemarker_searchDataSchema')[0].innerText = '{"searchQuery":{"type":"string","title":"Search", "description": "$desc"}}';
            searchDataSchemaStr = $('#freemarker_searchDataSchema')[0].innerText;
            if(searchText != 'null') {
                searchDataSchemaStr = searchDataSchemaStr.replace("$desc", "Search for " + searchText);
            } else {
                searchDataSchemaStr = searchDataSchemaStr.replace("$desc", "");
            }
        }
        var searchDataSchema = JSON.parse(searchDataSchemaStr);
        console.log(searchDataSchema);
        $('#dropdownMenuSearchDiv').jsonForm({
            schema: searchDataSchema,
            form: [
                      "*",
                      {
                        "type": "submit",
                        "title": "Search"
                      }
                    ],
            onSubmit: function (errors, values) {
              submitSearchData(values);
            }
        });
    }

    function searchTableData(searchVals) {
        console.log(searchVals);
        $("body").trigger("click");
        var searchUrl = "/records/search";
        if(!searchUrl || searchUrl.length < 1) {
            console.log("Wrong invocation of search api");
            return;
        }
        console.log("searchTableData() : " + searchVals.toString());

        pos = map.getCenter();
        coords = [pos.lat, pos.lng];

        data = {};
        data.pagePath = $('#freemarker_pagePath')[0].innerText;
        for(var key in searchVals) {
            data[key] = searchVals[key];
        }
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost(searchUrl, data, function(response) {
            showLoader(false);
            clearRecords();
            if(response.data.records.length > 0) {
                renderRecords(response.data.records);
            }
        }, function(jqXHR, exceptiom) {
            showLoader(false);
        });
    }

    function submitSearchData(values) {
        console.log(values);
        getSearchData(values);
        $("body").trigger("click");
    }

    function search(isMapEvent) {
        isMapEvent = false;
        searchQuery = $('#searchBar')[0].value;
        if(searchQuery != null && searchQuery.length > 0) {
            getSearchData(searchQuery);
        }
        $('#searchBar')[0].value = "";
    }

    // TODO get editable markers from iterating through the layers
    function fenceSubmit() {
        editFenceUrl = $('#freemarker_editFenceUrl')[0].innerText;
        console.log("Submitting fence data : " + editFenceUrl);

        if(!editFenceUrl || editFenceUrl.length < 1) {
            console.log("Wrong invocation of search api");
            return;
        }
        var drawnObjects = getDrawnObjects();
        console.log("fenceSubmit() : " + JSON.stringify(drawnObjects));

        pos = map.getCenter();
        coords = [pos.lat, pos.lng];

        data = {};
        data.lat = coords[0];
        data.lon = coords[1];
        data.radius = getMapRadiusInMeters();
        data.drawnObjs = drawnObjects;
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost(editFenceUrl, data, function(response) {
            invalidateMap(response.data.markers, response.data.fences, response.data.circles, response.data.paths, response.data.events, response.data.form, response.data.isSidebar, true, response.data.autoRefresh, response.data);
            showLoader(false);
        }, function(jqXHR, exceptiom) {
            showLoader(false);
        });
    }

    function getSearchData(searchVals) {
        var searchUrl = $('#freemarker_searchurl')[0].innerText;
        if(!searchUrl || searchUrl.length < 1) {
            console.log("Wrong invocation of search api");
            return;
        }
        console.log("getSearchData() : " + searchVals.toString());

        pos = map.getCenter();
        coords = [pos.lat, pos.lng];

        data = {};
        data.lat = coords[0];
        data.lon = coords[1];
        data.radius = getMapRadiusInMeters();
        for(var key in searchVals) {
            data[key] = searchVals[key];
        }
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost(searchUrl, data, function(response) {
            invalidateMap(response.data.markers, response.data.fences, response.data.circles, response.data.paths, response.data.events, response.data.form, response.data.isSidebar, true, response.data.autoRefresh, response.data);
            showLoader(false);
        }, function(jqXHR, exceptiom) {
            showLoader(false);
        });
    }

    setupSearch();

</script>