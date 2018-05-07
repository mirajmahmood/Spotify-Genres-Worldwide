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

	var genre_stream_counts = get_stream_counts(spotify_data, genres)
	console.log(genre_stream_counts);

	countries = get_list_of_countries(spotify_data).sort();
	createCountriesSelectionDiv(countries);
	createLineChart(spotify_data, genres[0], genre_colours[0]);
	createGenreChart(spotify_data, genres, genre_colours, genre_stream_counts);

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
		createLineChart(spotify_data, genres[0], genre_colours[0])
	}

}

function get_list_of_countries(spotify_data){
	countries = {}

	spotify_data.forEach(function(d){
		countries[d['Region']] = 0
	});

	return Object.keys(countries);


}
function get_stream_counts(spotify_data, genres){
	var stream_counts = {}
	genres.forEach(function(g, i){
		stream_counts[g.toLowerCase()] = 0;
	});
	spotify_data.forEach(function(d,i){
		genres.forEach(function(g, ind){
			var genre = g.toLowerCase();
			if (d['Genres'].indexOf(genre) != -1){
				stream_counts[genre] += +d['Streams']/10000
			}
		});
	});
	return stream_counts;
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
		if (countries[i]=="Ecuador")
			checkbox.checked = true;
	
		var label = document.createElement('label')
		label.htmlFor = countries[i];
		label.appendChild(document.createTextNode(countries[i]));
	
		countries_div.appendChild(checkbox);
		countries_div.appendChild(label);

		var linebreak = document.createElement("br");
		countries_div.appendChild(linebreak);
	}

}

function createLineChart(spotify_data, genre, genre_colour){
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


	var div_id = "#line_chart"
	var margin = {top: 20, right: 65, bottom: 30, left: 60},
	    width = 870 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


	d3.select(div_id+ " svg").remove();
	var svg = d3.select(div_id)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
    	.attr("transform",
        	"translate(" + margin.left + "," + margin.top + ")");


	var x = d3.scaleTime()
			    .range([0, width-5])
			    .nice();

	var y = d3.scaleLinear()
				.range([height, 0])
				.nice();

	x.domain(d3.extent(x_data, function(d) { return parseTime(d) }));
	
	for (country_index = 0; country_index < countries.length; country_index++){

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
	      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%b")));

	  // Add the Y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y));


	//Add legend
	var legend = svg.selectAll("rect.bar").data(countries)

    legend.enter().append("rect")
        .attr("x", width)
        .attr("y", function(d,i){return i*12 + 20})
        .attr("width", 10)
        .attr("height", 12)
        .style("fill", function(d, i){return country_colours[i]})
        .attr("fill-opacity", "0.6")


    var legend_text = svg.selectAll("text.label").data(countries)

    legend_text.enter().append("text")
        .attr('x', width+ 10)
        .attr("y", function(d,i){return i*12 + 28})
        .attr('font-size', 10)
        .text(function(d){return String(d) });


    //Add y axis label
    var y_label = svg.selectAll("text.label").data(["# of Streams (/10000)"])

	      
    y_label.enter().append("text")
        .attr("transform", "translate("+ 0 + "," + (margin.top - margin.bottom) + ")")
        .attr('font-size', 13)
        .text("# of Streams (/10000)");


    addText("#line_chart", genre.toUpperCase(), genre_colour, (height/2) + margin.top , (width/2) + margin.left)
}
function addText(div_id, text, text_colour, y, x){
	//Add title text
	var svg = d3.select(div_id+ " svg")
    var title = svg.selectAll("text.label").data([text])

	      
    title.enter().append("text")
        .attr("transform", "translate("+ x + "," + y  + ")")
        .attr('font-size', 40)
        .attr('fill', text_colour)
        .attr('opacity', 0.4)
        .text(text);
}
function createGenreChart(spotify_data, genres, genre_colours, dataset){
	// call your own functions from here, or embed code here
	var selected = "Pop";
	var selected_index = 0;
	var margin = {top: 45, right: 50, bottom: 30, left:0};
	var width = 700  - margin.left - margin.right,
	  height = 500 - margin.top - margin.bottom;

	var div = document.getElementById("genre_plot");
	div.style.marginLeft = "300px";

   	var x = d3.scalePoint()
   				.range([0, width])
   				.domain(genres);

   	var x_scale = d3.scaleLinear()
   				.range([0, width])
   				.domain([0, genres.length]);

   	var r_scale = d3.scaleSqrt()
   				.range([0, 50])
   				.domain([d3.min(Object.values(dataset)), d3.max(Object.values(dataset))]);
   	
	var y = d3.scaleLinear()
				.range([height, 0])
				.domain([d3.min(Object.values(dataset)), d3.max(Object.values(dataset))])
				.nice();

	var svg = d3.select("div#genre_plot").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var tool_tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([0, 40])
		.html("<div id='mySVGtooltip'></div>");

	svg.call(tool_tip);

	svg.selectAll("circle")
		.data(genres)
		.enter().append("circle")
		.attr("r", function(d){
			
			d = dataset[d.toLowerCase()] 
			console.log(d);
			return r_scale(d);
		})
		.attr('cy', function(d,i){
			d = dataset[d.toLowerCase()]
			return y(d) + margin.top;
		})
		.attr('cx', function(d,i){
			d = dataset[d.toLowerCase()] 
			return x_scale(i)+r_scale(d) + margin.left;
		})
		.attr("fill", function(d, i){
			
			return genre_colours[i];

		})
		.attr("opacity", 0.8)
		.on("mouseover", function(d, i){
			selected_index = 0;
			selected = d;

			tool_tip.show();
			var tool_tip_w = 150,
				tool_tip_h = 70;


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
					.style('font-size', 15)
					.text("\n Genre: "+genres[i]);
					


			tooltipSVG.append("text")
					.attr("x", 5)
					.attr("y", 40)
					.attr("dy", ".35em")
					.style("fill", "white")	
					.style('font-size', 15)	
					.text("Streams: "+dataset[d.toLowerCase()]);

			createLineChart(spotify_data, genres[i], genre_colours[i])

			

		})



	// // Add the X Axis
	//   svg.append("g")
	//       .attr("transform", "translate("+ margin.left + ", " + (height+margin.top) + ")")
	//       .call(d3.axisBottom(x));

	//   // Add the Y Axis
	//   svg.append("g")
	//       .attr("transform", "translate(" + margin.left + ", "+margin.top+")")
	// 	  .call(d3.axisLeft(y));




}

// uncomment the cdn.rawgit.com versions and comment the cis.umassd.edu versions if you require all https data
d3.queue()
    //.defer(d3.csv, "https://archive.org/download/cleaned_data/cleaned_data.csv")
    //.defer(d3.csv, "https://query.data.world/s/shd2uyourazdpttig4vqh5jvp5cf6d")
    //.defer(d3.csv, "https://query.data.world/s/sj4dq52f3gfho7ouikgmuq3bzzmr4q")
    .defer(d3.csv, "https://query.data.world/s/ojhvga3efn4pnklwdfye5m322t4gms")
    .await(createVis);

