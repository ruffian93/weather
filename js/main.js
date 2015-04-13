//test

var app = angular.module( "myWeather", [ 'ngAutocomplete' ] );


app.factory( 'cityInfo', function () {
    return {
        address   : 'Черкассы, Черкасская область, Украина',
        latitude  : 49.444433,
        longitude : 32.059766999999965
    }
});


app.controller( 'getCities', [ '$scope', 'cityInfo', function ( $scope, info ) {

    $scope.options = {
        types : '(cities)'
    };

    $scope.$watch( 'details', function ( details ) {
        if( angular.isObject( details ) && $scope.address != '' ) {
            info.address   = $scope.address;
            info.latitude  = details.geometry.location.k;
            info.longitude = details.geometry.location.D;
        }
    });
}]);


app.controller( 'city', [ '$scope', 'cityInfo', function ( $scope, info ) {
    $scope.city = info;
}]);