/* 
    DATAIKU - US CENSUS REPORT
    Version: 1.0
    Author: Anurag Mishra
    Dated: Sun, 2 July 2017 11:50 AM
*/


//constants used in this page for various purposes
const lblDisplayedText = "#lblDisplayedText";
const lblNotDisplayedText = "#lblNotDisplayedText";
const lblClippedText = "#lblClippedText";
const ddlVariable = "#ddlVariable";
const example = "#example";
const valueTitle = "Value";
const countTitle = "Count";
const averageAgeTitle = "Average age";
const nullValue = "NULL";


/**
 * Fetches data corresponding to the column selected
 * @param {string} variable - column name to be fetched from the database.
 */
function fetchData(param){
    try{
        $.ajax({
            url: constants.dataByColumnApiUrl + param,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(response){
                var result = response.data;
                var dataSet=[];

                //Converting data to desired column form
                for(var item in result){
                    var s=[];
                    if(result[item][param] == null){
                        s.push(nullValue);
                    }else{
                        s.push(result[item][param]);
                    }
                    s.push(result[item]['count']);
                    s.push(result[item]['avrg']);
                    dataSet.push(s);
                }

                //detroying existing dataTable
                $(example).dataTable().fnDestroy();

                //creating newer dataTable
                $(example).DataTable( {
                    "paging":   false,
                    "ordering": false,
                    "info":     false,
                    "scrollY":  '50vh',
                    "scrollCollapse": true,
                    data: dataSet,
                    columns: [
                        { title: valueTitle },
                        { title: countTitle },
                        { title: averageAgeTitle }
                    ]
                });

                var count = response.count;
                $(lblDisplayedText).html("Displayed values :" + dataSet.length);
                $(lblNotDisplayedText).html("Non-displayed Values " + (count - dataSet.length));    
                $(lblClippedText).html("Clipped Rows : " + response.clippedOutRows);            
                
            },
            error: function (result){
                alert("OOPS!! Something went wrong!");
                console.log(error);
            }
        });
    }
    catch(ex){
        alert("OOPS! Seems like our server are tired, Please try again later");
    }
}


/**
 * Fetches columns present inside database for populating the dropdown
 */
function fetchColumns(){
    try{
        $.ajax({
            url: constants.fetchColumnsApiUrl,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(result){
                $.each(result, function (i, item) {
                    $(ddlVariable).append($('<option>', { 
                        value: item,
                        text : item 
                    }));
                });
                fetchData($(ddlVariable).val());
            },
            error: function (result){
                alert("OOPS!! Something went wrong!");
                console.log(error);
            }
        });
    }
    catch(ex){
        alert("OOPS! Seems like our server are tired, Please try again later")
    }
}

//function to perform page load events
$(document).ready(function() {

	$(ddlVariable).change(function () {
	    fetchData($(ddlVariable).val());
	});
	fetchColumns();
});