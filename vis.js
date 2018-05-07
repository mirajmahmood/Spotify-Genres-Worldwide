function createVis(errors, spotify_data)
{	
	console.log(spotify_data)
	var countries = []

	countries.push(
		"United States",
		"United Kingdom",
		"Argentina",
		"Austria",
		"Australia",
		"Belgium",
		"Bolivia",
		"Brazil",
		"Canada",
		"Switzerland",
		"Chile",
		"Colombia",
		"Costa rica",
		"Czech Republic",
		"Germany",
		"Denmark",
		"Dominican Republic",
		"Ecuador",
		"Estonia",
		"Spain",
		"Finland",
		"France",
		"Greece",
		"Guatemala",
		"Hong Kong",
		"Honduras",
		"Hungary",
		"Indonesia",
		"Ireland",
		"Iceland",
		"Italy ",
		"Japan",
		"Lithuania",
		"Luxembourg",
		"Latvia",
		"Mexico",
		"Malaysia",
		"Netherlands",
		"Norway",
		"New Zealand",
		"Panama",
		"Peru",
		"Philippines",
		"Poland",
		"Portugal",
		"Paraguay",
		"Sweden",
		"Singapore",
		"Slovakia",
		"El Salvador",
		"Turkey",
		"Taiwan",
		"Uruguay"
	)
	var country_colours = ["#3e4444", "#82b74b", "#405d27", "#c1946a", "#e6e2d3"];
	
	var genres = ["Pop", "Hip Hop", "House", "Trap", "EDM", "Reggaeton", "Latin", "Tropical", "Rap", "R&B", "Indie", "Mellow"]
	var genre_colours = ["#ffbfd0", "#f200c2", "#5700d9", "#614d99", "#00a2f2", "#bff2ff", "#73e673", "#3e4d39", "#f2e200", "#996326", "#f23d3d", "#401010"]
	
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	createLineChart(spotify_data, genres[0], country_colours, months);
	createCountriesSelectionDiv(countries);
	createGenreChart(spotify_data, genres, genre_colours);

	var countries_div = document.getElementById("countries_selection");
	countries_div.onchange = function(){
		if (document.querySelectorAll('input[type=checkbox]:checked').length >= 5){
			
			document.querySelectorAll('input[type=checkbox]:not(:checked)').forEach(function (d, el){
				d.style.opacity = .50;
				d.style.filter = "alpha(opacity=50)";
				d.style.cursor = "default";
				d.disabled = true
			});
		}
		else{
			document.querySelectorAll('input[type=checkbox]').forEach(function (d, el){
				d.style.opacity = 1;
				d.style.filter = "";
				d.style.cursor = "";
				d.disabled = false;
			});
		}
		createLineChart(spotify_data, genres[0], country_colours, months)
	}

}
function createCountriesSelectionDiv(countries){
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 300 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var countries_div = document.getElementById("countries_selection");
	countries_div.style.height = height + "px";
	countries_div.style.width = width + "px";
	countries_div.style.marginTop = margin.top + "px";
	countries_div.style.marginBottom = margin.bottom + "px";
	countries_div.style.marginLeft = margin.left + "px";
	countries_div.style.marginRight = margin.right + "px";
	countries_div.style.position = "absolute";
	countries_div.style.overflow = "auto";
	

	for (i=0; i<countries.length; i++){
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.name = countries[i];
		checkbox.value = countries[i];
		checkbox.id = countries[i];
	
		var label = document.createElement('label')
		label.htmlFor = countries[i];
		label.appendChild(document.createTextNode(countries[i]));
	
		countries_div.appendChild(checkbox);
		countries_div.appendChild(label);

		var linebreak = document.createElement("br");
		countries_div.appendChild(linebreak);
	}

}
function create_dataset(n_points){
	var data_points = []
	
	for (i=0; i<n_points; i++){
		
		data_points.push(Math.floor((Math.random() * 10000) + 1000))
	}

	return data_points;
}
function createLineChart(spotify_data, genre){
	// set the dimensions and margins of the graph
	var country_colours = ["#3e4444", "#82b74b", "#405d27", "#c1946a", "#e6e2d3"];
	
	var parseTime = d3.timeParse("%b");
	var parseDate = d3.timeParse("%Y-%m-%d");
	var x_data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	var countries = [];
	document.querySelectorAll('input[type=checkbox]:checked').forEach(function (d, el){
		countries.push(d.value)
	});

	var data = {}
	var genre = genre.toLowerCase()
	var streams_per_month = {}
	console.log(genre)
	countries.forEach(function(country, i){
		data[country] = []
		data[country] = spotify_data.filter(each => (each['Region'] == country) && (each['Genres'].indexOf(genre) != -1));

		streams_per_month[country] = Array(12).fill(0);
		x_data.forEach(function(d, i){
			streams_per_month[country][d] = 0;
		})

		data[country].forEach(function(d,i){
			var date = parseDate(d['Date']);

			streams_per_month[country][date.getMonth()] += +d['Streams'];
		});
		
	})
	
	console.log(data)
	console.log(streams_per_month)


	var div_id = "#line_chart"
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 970 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	d3.select(div_id+ " svg").remove();
	var svg = d3.select(div_id)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
    	.attr("transform",
        	"translate(" + margin.left + "," + margin.top + ")");


	var x = d3.scaleTime()
			    .range([0, width-5]);

	var y = d3.scaleLinear()
				.range([height, 0]);

	x.domain(d3.extent(x_data, function(d) { return parseTime(d) }));
	
	for (country_index = 0; country_index < countries.length; country_index++){

		// var streams_per_month = []

		// for (i = 0; i < x_data.length ; i++){
		// 	streams_per_month.push(Math.floor((Math.random() * 1000) + 10))
		// }

		var value_line = d3.line() 
							.x(function(d, i){return x(parseTime(x_data[i])) })
							.y(function(d, i){return y(d); })
							.curve(d3.curveBasis);

		// Scale the range of the data
		x.domain(d3.extent(x_data, function(d) { return parseTime(d) }));
		y.domain([0, d3.max(streams_per_month[countries[country_index]])]);
		svg.append("path")
				.data([streams_per_month[countries[country_index]]])
				.attr('d', value_line)
				.attr("stroke", country_colours[country_index])
				.attr("stroke-width", "2")
				.attr("fill", "none")
		
	}

	// Add the X Axis
	  svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  // Add the Y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y));
}
function createGenreChart(spotify_data, genres, genre_colours){
	// call your own functions from here, or embed code here
	var margin = {top: 30, right: 50, bottom: 40, left:40};
	var width = 700  - margin.left - margin.right,
	  height = 500 - margin.top - margin.bottom;

	var div = document.getElementById("genre_plot");
	div.style.marginLeft = "300px";
   	var dataset = create_dataset(genres.length);

   	var x = d3.scalePoint()
   				.range([0, width])
   				.domain(genres);
   	var x_scale = d3.scaleLinear()
   				.range([0, width])
   				.domain([0, genres.length]);
   	
	var y = d3.scaleLinear()
				.range([height, 0])
				.domain([d3.min(dataset), d3.max(dataset)]);

	var svg = d3.select("div#genre_plot").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var tool_tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([0, 50])
		.html("<div id='mySVGtooltip'></div>");

	svg.call(tool_tip);

	svg.selectAll("circle")
		.data(dataset)
		.enter().append("circle")
		.attr("r", function(d){
			return d*0.005;
		})
		.attr('cy', function(d,i){
			return y(d) + margin.top;
		})
		.attr('cx', function(d,i){
			return x_scale(i) + margin.left;
		})
		.attr("fill", function(d, i){
			return genre_colours[i];

		})
		.attr("opacity", 0.8)
		.on("mouseover", function(d, i){
			
			tool_tip.show();
			var tool_tip_w = 150,
				tool_tip_h = 80;


			var tooltipSVG = d3.select("#mySVGtooltip")
				.append("svg")
				.attr("width", tool_tip_w)
				.attr("height", tool_tip_h)
				.style("background", "rgba(0, 0, 0, 0.6)")
				.style("border", "1px solid black");


			tooltipSVG.append("text")
					.attr("x", 5)
					.attr("y", 20)
					.attr("dy", ".35em")
					.style("fill", "white")
					.text("\n Genre: "+genres[i]);
					


			tooltipSVG.append("text")
					.attr("x", 5)
					.attr("y", 40)
					.attr("dy", ".35em")
					.style("fill", "white")		
					.text("Streams: "+d);

			createLineChart(spotify_data, genres[i])

		})


	// Add the X Axis
	  svg.append("g")
	      .attr("transform", "translate("+ margin.left + ", " + height + ")")
	      .call(d3.axisBottom(x));

	  // Add the Y Axis
	  svg.append("g")
	      .attr("transform", "translate(" + margin.left + ", 0)")
		  .call(d3.axisLeft(y));




}

// uncomment the cdn.rawgit.com versions and comment the cis.umassd.edu versions if you require all https data
d3.queue()
    //.defer(d3.csv, "https://archive.org/download/cleaned_data/cleaned_data.csv")
    .defer(d3.csv, "https://query.data.world/s/eyex2v4cn5aaumwxckvnplk2ccpmdz")
    .await(createVis);

