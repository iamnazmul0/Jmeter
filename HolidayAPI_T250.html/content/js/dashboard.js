/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6586666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.876, 500, 1500, "https://date.nager.at/Api/v3/NextPublicHolidays/US"], "isController": false}, {"data": [0.978, 500, 1500, "https://date.nager.at/Api/v2/CountryInfo?countryCode=CA"], "isController": false}, {"data": [0.922, 500, 1500, "https://date.nager.at/Api/v3/CountryInfo/US"], "isController": false}, {"data": [0.814, 500, 1500, "https://date.nager.at/Api/v3/NextPublicHolidaysWorldwide"], "isController": false}, {"data": [0.89, 500, 1500, "https://date.nager.at/Api/v2/PublicHolidays/2022/CA"], "isController": false}, {"data": [0.532, 500, 1500, "https://date.nager.at/Api/v3/AvailableCountries"], "isController": false}, {"data": [0.514, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-4"], "isController": false}, {"data": [0.502, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-3"], "isController": false}, {"data": [0.726, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-2"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.398, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-1"], "isController": false}, {"data": [0.756, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA-0"], "isController": false}, {"data": [0.146, 500, 1500, "https://date.nager.at/PublicHoliday/Country/CA"], "isController": false}, {"data": [0.858, 500, 1500, "https://date.nager.at/Api/v2/LongWeekend/2022/US"], "isController": false}, {"data": [0.968, 500, 1500, "https://date.nager.at/Api/v2/LongWeekend/2022/CA"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3500, 0, 0.0, 1071.7277142857147, 56, 35477, 356.5, 2629.7000000000003, 4464.549999999998, 11441.22999999994, 81.26683384415344, 2582.4503728116006, 46.914363622643265], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://date.nager.at/Api/v3/NextPublicHolidays/US", 250, 0, 0.0, 420.2759999999999, 58, 7985, 105.5, 1017.5000000000002, 1590.1499999999908, 5911.260000000029, 12.439048661558365, 38.78845220917504, 4.7253807903771525], "isController": false}, {"data": ["https://date.nager.at/Api/v2/CountryInfo?countryCode=CA", 250, 0, 0.0, 156.77599999999998, 57, 983, 66.0, 432.9, 470.49999999999966, 950.0900000000004, 6.135270442721115, 5.749083927432022, 2.360641166437617], "isController": false}, {"data": ["https://date.nager.at/Api/v3/CountryInfo/US", 250, 0, 0.0, 276.3480000000001, 56, 3408, 67.0, 696.0, 1129.1999999999978, 2278.2200000000007, 12.470693869406894, 13.110693775876689, 4.652153377063899], "isController": false}, {"data": ["https://date.nager.at/Api/v3/NextPublicHolidaysWorldwide", 250, 0, 0.0, 657.7199999999997, 57, 16331, 180.0, 1284.6000000000001, 2356.75, 8259.950000000006, 12.410027302060065, 53.888604492429884, 4.787071078431373], "isController": false}, {"data": ["https://date.nager.at/Api/v2/PublicHolidays/2022/CA", 250, 0, 0.0, 393.42799999999977, 58, 12977, 108.0, 999.4000000000001, 1226.6999999999998, 4378.740000000003, 6.224479633502639, 37.09400831590479, 2.370651422916044], "isController": false}, {"data": ["https://date.nager.at/Api/v3/AvailableCountries", 250, 0, 0.0, 1547.0640000000005, 168, 17728, 745.0, 3460.700000000002, 5789.849999999996, 12109.070000000007, 12.056327160493828, 59.48431697892554, 4.5446701991705245], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-4", 250, 0, 0.0, 1884.416, 59, 20697, 854.5, 4384.6, 7206.8, 17570.540000000008, 10.144045445323595, 72.72420717944817, 5.101741605802394], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-3", 250, 0, 0.0, 1676.9839999999997, 58, 13734, 817.0, 3611.500000000001, 8576.0, 11459.980000000016, 12.419274714356682, 261.1881170827124, 6.246021951068058], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-2", 250, 0, 0.0, 766.172, 58, 13765, 354.0, 1819.0000000000007, 2553.4999999999995, 6730.150000000028, 12.488760115895694, 14.462569624837645, 6.402928770356679], "isController": false}, {"data": ["Test", 250, 0, 0.0, 8258.312000000002, 1917, 40658, 7184.0, 13537.1, 15563.699999999995, 21252.460000000014, 5.786367318597384, 1353.980546052251, 32.16971596169425], "isController": true}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-1", 250, 0, 0.0, 1727.2400000000002, 78, 26798, 1088.5, 3357.9000000000005, 4898.799999999997, 15388.64000000005, 6.378364587319811, 1039.97510444572, 3.1829534219926012], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA-0", 250, 0, 0.0, 691.0640000000002, 59, 9305, 354.0, 1373.8, 2379.9, 8889.680000000004, 12.40448546194304, 229.27966377642156, 6.262811507641163], "isController": false}, {"data": ["https://date.nager.at/PublicHoliday/Country/CA", 250, 0, 0.0, 4174.7, 237, 35477, 2980.5, 9405.0, 12902.449999999999, 19667.71000000002, 6.345982992765579, 1338.2978338383678, 16.007494209290517], "isController": false}, {"data": ["https://date.nager.at/Api/v2/LongWeekend/2022/US", 250, 0, 0.0, 459.1960000000001, 57, 8418, 71.0, 1029.4, 2085.5999999999995, 5750.330000000019, 12.410643367752183, 19.203143615965054, 4.690350569648531], "isController": false}, {"data": ["https://date.nager.at/Api/v2/LongWeekend/2022/CA", 250, 0, 0.0, 172.80399999999995, 56, 4233, 65.0, 427.9, 684.45, 2820.920000000009, 6.1731443528075465, 7.508954917526792, 2.3330145161489457], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3500, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
