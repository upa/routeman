/*
 * routeman.js : get traceroute result json and display it.
 */


/*
var probe_example = [
{
        "addr": "8.8.8.8",
        "name": "google_dns",
        "paths": [
            [
		    "23:13:10",
		    "10.10.0.1",
		    "203.178.135.1",
		    "203.178.136.185",
		    "203.178.136.101",
		    "203.178.140.215",
		    "202.249.2.189",
		    "108.170.242.161",
		    "209.85.246.89",
                "8.8.8.8"
            ]
		],
        "updated": "22:17:43"
},
{
        "addr": "203.178.141.194",
        "name": "kame",
        "paths": [
            [
		    "23:13:10",
		    "10.10.0.1",
		    "203.178.135.1",
		    "203.178.136.185",
		    "*",
		    "*",
		    "*",
                "203.178.141.194"
		    ],
            [
		    "23:13:13",
		    "!10.10.0.1",
		    "203.178.135.1",
		    "203.178.136.185",
		    "203.178.142.207",
		    "203.178.138.9",
		    "*",
                "203.178.141.194"
            ]
		],
        "updated": "22:17:44"
},
{
        "addr": "202.12.27.33",
        "name": "m.root",
        "paths": [
            [
		    "23:13:10",
		    "10.10.0.1",
		    "203.178.135.1",
		    "203.178.136.185",
		    "203.178.136.101",
		    "203.178.140.215",
		    "202.249.2.86",
		    "202.12.27.33"
		    ],
            [
		    "23:13:20",
		    "10.10.0.1",
		    "203.178.135.1",
		    "203.178.136.185",
		    "203.178.136.101",
		    "!203.178.140.215",
		    "202.249.2.86",
		    "202.12.27.33"
            ]
		],
        "updated": "22:17:44"
}
];
*/

function refresh_result(url) {

	$.getJSON(url, function(data) {
		probes = data;

		for (var x = 0; x < probes.length; x++) {
			if (!probes[x]) { continue; }

			probe = probes[x];
			delete_probe(probe);
			add_probe(probe);
		}
		});
}


function delete_probe(probe) {
	$("." + probe["name"].replace(/\./g, '-')).remove();
}


function add_probe(probe) {
	/* @probe: a dict of output json array. */

	var div = $("<div>");

	div.addClass("probe");
	div.addClass(probe["name"].replace(/\./g, '-'));

	var div_name = $("<div>");
	div_name.addClass("target");
	div_name.text(probe["name"] + " " + probe["addr"]);

	div.append(div_name);

	table = $("<table>");

	for (var x = 0; x < probe["paths"].length; x++) {
		var tr = path_to_tr(x + 1, probe["paths"][x]);
		table.append(tr);
	}

	div.append(table);

	$("div#body").append(div);
}


function path_to_tr(cnt, path) {
	/* @path: an array of hops. First obj is timestamp */

	var tr = $("<tr>");

	var td = $("<td>").text(cnt); // count
	td.addClass("count");
	tr.append(td);

	var td = $("<td>").text(path[0]); // timestamp
	tr.append(td);

	for (var x = 1; x < path.length; x++) {
		hop = path[x];

		var td = $("<td>").text(hop);

		if (hop.match(/^\!/)) {
			td.addClass("failed");
		} else if (hop.match(/^\+/)) {
			td.addClass("new");
		} else if (hop.match(/\-$/)) {
			td.addClass("lost");
		}

		tr.append(td);
	}

	return tr;
}
