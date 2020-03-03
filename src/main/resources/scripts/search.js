<script>

    var searchText = $('#freemarker_searchtext')[0].innerText;
    $('#searchBar')[0].placeholder = searchText;

    function search(isMapEvent) {
        isMapEvent = false;
        searchQuery = $('#searchBar')[0].value;
        if(searchQuery != null && searchQuery.length > 0) {
            getSearchData(searchQuery);
        }
        $('#searchBar')[0].value = "";
    }

    function getSearchData(searchQuery) {
        var searchUrl = $('#freemarker_searchurl')[0].innerText;
        if(!searchUrl || searchUrl.length < 1) {
            console.log("Wrong invocation of search api");
            return;
        }
        console.log("getSearchData() : " + searchQuery);
        data = {};
        data.q = query;
        data.searchQuery = searchQuery
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost(searchUrl, data, function(response) {
            invalidateMap(response.data.markers, response.data.fences, response.data.circles, response.data.paths, true, response.data.autoRefresh);
            showLoader(false);
        }, function(jqXHR, exceptiom) {
            showLoader(false);
        });
    }


</script>