app.controller( 'openWeatherMap', [ '$scope', function ( $scope ) {

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
        currentDay = 0;
        $scope.load = 'load';
        if( $scope.city.address != '' ) {
            $.getJSON( url(), function( response ) {
                allInfo = [];
                angular.forEach( response.list, function ( value, key ) {
                    var dt_txt = value.dt_txt.split( ' ' ),
                        data = dt_txt[ 0 ].split( '-' ),
                        time = (dt_txt[ 1 ].split( ':' ))[ 0 ];
                    if( (new Date( data[ 0 ] , data[ 1 ] - 1, data[ 2 ], time, 0, 0, 0)).getTime() > (new Date()).getTime() - 10800000 ) {
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