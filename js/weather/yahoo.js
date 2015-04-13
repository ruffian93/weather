app.controller( 'yahoo', [ '$scope', function ( $scope ) {



        function locationSuccess() {
            var APPID = 'COaJqk4s '; // Your Yahoo Application ID
            var DEG = 'c';  // c for celsius, f for fahrenheit
            var lat = $scope.city.latitude;
            var lon = $scope.city.longitude;

            // Yahoo's PlaceFinder API http://developer.yahoo.com/geo/placefinder/
            // We are passing the R gflag for reverse geocoding (coordinates to place name)
            var geoAPI = 'http://where.yahooapis.com/geocode?location='+lat+','+lon+'&flags=J&gflags=R&appid='+APPID;

            // Forming the query for Yahoo's weather forecasting API with YQL
            // http://developer.yahoo.com/weather/

            var wsql = 'select * from weather.forecast where woeid=WID and u="'+DEG+'"',
                weatherYQL = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(wsql)+'&format=json&callback=?',
                code, city, results, woeid;

            // Issue a cross-domain AJAX request (CORS) to the GEO service.
            // Not supported in Opera and IE.
            $.getJSON(geoAPI, function(r){

                if(r.ResultSet.Found == 1){

                    results = r.ResultSet.Results;
                    city = results[0].city;
                    code = results[0].statecode // results[0].countrycode;

                    // This is the city identifier for the weather API
                    woeid = results[0].woeid;

                    // Make a weather API request (it is JSONP, so CORS is not an issue):
                    $.getJSON(weatherYQL.replace('WID',woeid), function(r){

                        if(r.query.count == 1){

                            // Create the weather items in the #scroller UL

                            var item = r.query.results.channel.item.condition;
                            addWeather(item.code, "Now", item.text + ' <b>'+item.temp+'°'+DEG+'</b>');

                            for (var i=0;i<2;i++){
                                item = r.query.results.channel.item.forecast[i];
                                addWeather(
                                    
        item.code,
                                    item.day +' <b>'+item.date.replace('d+$','')+'</b>',
                                    item.text + ' <b>'+item.low+'°'+DEG+' / '+item.high+'°'+DEG+'</b>'
                                );
                            }

                            // Add the location to the page
                            location.html(city+', <b>'+code+'</b>');

                            weatherDiv.addClass('loaded');

                            // Set the slider to the first slide
                            showSlide(0);

                        }
                        else {
                            showError("Error retrieving weather data!");
                        }
                    });

                }

            }).error(function(){
                showError("Your browser does not support CORS requests!");
            });

        };




    var APPID = 'd2617f3700963b2d6df5d88788d03f75',
        lang  = 'ru',
        url   = function() {
                    return 'http://api.openweathermap.org/data/2.5/forecast?'
                         + 'lang='  + lang                  + '&'
                         + 'APPID=' + APPID                 + '&'
                         + 'lat='   + $scope.city.latitude  + '&'
                         + 'lon='   + $scope.city.longitude
                },
        currentDay = 0,
        allInfo;

    $scope.load      = 'load';
    $scope.prevClass = 'displayNone';
    $scope.nextClass = 'displayNone';

    $scope.prev = function () {
        if( currentDay > 0 ) {
            currentDay--;
            update()
        }
    };

    $scope.next = function () {
        if( allInfo[ currentDay + 1 ] ) {
            currentDay++;
            update()
        }
    };

    $scope.updateWeather = function () {

        locationSuccess();

        $scope.load = 'load';
        if( $scope.city.address != '' ) {
            $.getJSON( url(), function( response ) {
                allInfo = [];
                angular.forEach( response.list, function ( value, key ) {
                    var dt_txt = value.dt_txt.split( ' ' ),
                        data = dt_txt[ 0 ].split( '-' ),
                        time = (dt_txt[ 1 ].split( ':' ))[ 0 ];
                    if( (new Date( data[ 0 ] , data[ 1 ] - 1, data[ 2 ], time, 0, 0, 0)).getTime() > (new Date()).getTime() ) {
                        value.main.temp_min = Math.round( value.main.temp_min - 273.15 );
                        value.main.temp_max = Math.round( value.main.temp_max - 273.15 );
                        allInfo.push({
                            data     : value.dt_txt,
                            icon     : value.weather[ 0 ].icon,
                            main     : value.weather[ 0 ].description,
                            temp     : value.main.temp_max != value.main.temp_min ? ( value.main.temp_min + ' - ' + value.main.temp_max ) : value.main.temp_min,
                            speed    : value.wind.speed,
                            humidity : value.main.humidity
                        })
                    }
                });
                update();
                $scope.load = '';
                $scope.$apply()
            })
        }
    };

    function update () {
        $scope.weather = allInfo[ currentDay ];
        $scope.prevClass = currentDay == 0 ? 'displayNone' : '';
        $scope.nextClass = !allInfo[ currentDay + 1 ] ? 'displayNone' : '';
    };

    $scope.$watch( 'city.address', $scope.updateWeather )
}]);