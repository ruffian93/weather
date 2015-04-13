app.controller( 'worldWeatherOnline', [ '$scope', function ( $scope ) {

    var APPID = '34ef14b01ecaa730fb6483a9c2fb2',
        lang  = 'ru',
        url   = function() {
                    return 'http://api.worldweatheronline.com/free/v2/weather.ashx?'
                         + 'format='      + 'json' + '&'
                         + 'num_of_days=' + '5'    + '&'
                         + 'lang='        + lang   + '&'
                         + 'key='         + APPID  + '&'
                         + 'q=' + parseFloat( $scope.city.latitude.toFixed( 2 ) ) + ','
                                + parseFloat( $scope.city.longitude.toFixed( 2 ) )
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
        currentDay = 0;
        $scope.load = 'load';
        if( $scope.city.address != '' ) {
            $.getJSON( url(), function( response ) {
                allInfo = [];
                angular.forEach( response.data.weather, function( value, key ) {
                    var data = value.date.split( '-' );
                    angular.forEach( value.hourly, function ( value, key ) {
                        value.time = value.time.replace( /([0-9]*)([0-9]{2})$/mi, '$1:$2:00' );
                        if( (new Date( data[ 0 ] , data[ 1 ] - 1, data[ 2 ], (value.time.split( ':' ))[ 0 ], 0, 0, 0)).getTime() > (new Date()).getTime() ) {
                            allInfo.push({
                                data     : data[ 0 ] + '-' + data[ 1 ] + '-' + data[ 2 ] + ' ' + value.time,
                                icon     : value.weatherIconUrl[ 0 ].value,
                                main     : value.lang_ru[ 0 ].value,
                                temp     : value.tempC,
                                speed    : value.windspeedKmph,
                                humidity : value.humidity
                            })
                        }
                    })
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