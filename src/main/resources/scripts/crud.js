<script>

    var table = null;

    function editRecord(pageId, id) {
        console.log("editRecord() : " + pageId + " , " + id);
        data = {};
        data.pagePath = pageId;
        data.primaryKeyVal = id;
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost("/records/form", data, function(response) {
            showLoader(false);
            renderForm(response.data.form);
        }, function(jqXHR, exceptiom) {
            showLoader(false);
        });
    }

    function createRecord() {
        var pageId = $('#freemarker_pagePath')[0].innerText;
        console.log("createRecord() : " + pageId);
        data = {};
        data.pagePath = pageId;
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost("/records/form", data, function(response) {
            showLoader(false);
            renderForm(response.data.form);
        }, function(jqXHR, exceptiom) {
            showLoader(false);
        });
    }

    function deleteRecord(pageId, id) {
        console.log("deleteRecord() : " + pageId + " , " + id);
        bootbox.confirm("Are you sure you want to delete?", function(result){
            if(result) {
                deleteRecordConfirm(pageId, id);
            }
        });
    }

    function deleteRecordConfirm(pageId, id) {
        console.log("deleteRecordConfirm() : " + pageId + " , " + id);
        data = {};
        data.pagePath = pageId;
        data.primaryKeyVal = id;
        if(isLoading) {
            return;
        }
        showLoader(true);
        httpPost("/records/delete", data, function(response) {
            showLoader(false);
            showSuccessMessage("Delete Record : Success")
        }, function(jqXHR, exception) {
            showLoader(false);
            showFailureMessage("Delete Record : Fail");
        });
    }

    function clearRecords() {
        if(table != null) {
            table.clear().draw();
            table.destroy();
            table = null;
        }
    }

    function renderRecords(recordData) {
        var columnNames = recordData[0];

        var columns = [];
        for (column in columnNames) {
            if(columnNames[column].length < 1) {
                var obj = {}
                obj.render = function ( data, type, row, meta ) {
                    var options = JSON.parse(data);
                    var links = "";
                    if("edit" in options) {
                        var params = options.edit;
                        links += "<b><a href='#' onclick='editRecord(" + params + ")'>Edit</a></b><br/> "
                    }
                    if("delete" in options) {
                        links += "<b><a href='#' onclick='deleteRecord(" + params + ")'>Delete</a></b> "
                    }
                    return links;
                };
                columns.push(obj);
            } else {
                var obj = {};
                obj.title = columnNames[column];
                columns.push(obj);
            }
        }

        recordData.shift(1);

        table = $('#crudTable').DataTable({
            data: recordData,
            columns: columns,
            ordering: false,
            info:     false,
            searching: false,
            lengthChange: false
        });

        var isCreateAllowed = $('#freemarker_isCreateAllowed')[0].innerText;
        if(isCreateAllowed && isCreateAllowed.length > 0) {
//            $('#crudTable_paginate').children("ul.pagination")[0].innerHTML += '<li class="paginate_button page-item" id="crudTable_add"><a href="#" aria-controls="crudTable" onclick="createRecord()" data-dt-idx="9" tabindex="0" class="page-link">Add</a></li>';
        }
    }

    var recordsStr = $('#freemarker_recordsData')[0].innerText;
    if(recordsStr && recordsStr.length > 0) {
        renderRecords(JSON.parse($('#freemarker_recordsData')[0].innerText));
    }
</script>