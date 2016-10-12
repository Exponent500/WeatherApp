(function() {
    'use strict';

    angular
        .module('WeatherApp')
        .factory('WeatherFactory', WeatherFactory);

    WeatherFactory.$inject = ['$http', '$q'];

    /* @ngInject */
    function WeatherFactory($http, $q) { 
        var service = { 
            getWeatherDataByCityName: getWeatherDataByCityName 
        };
        return service;

        ////////////////

        //pulls weather info from OpenWeatherMAP API, based on city name
        function getWeatherDataByCityName(cityName, measurementSystem) {

        	var defer = $q.defer(); 

        	$http({
        		method: 'GET',
        		url: 'http://api.openweathermap.org/data/2.5/weather',
                params: {
                    APPID: 'd193c3260ad68ad7be97f165a7352eaa',
                    q: cityName,
                    type: 'accurate',
                    units: measurementSystem}
        	}).then(function(response){ 

                //checks if the response from OpenWeatherMAP API is an object. If yes, provide the object to the controller. If no, provide the controller with a reason why.
    			if(typeof response.data === 'object'){ 
    				defer.resolve(response); //response goes to the response path of the controller
    			} else {
    				defer.reject(response); // rejects go to the error path in the controller. This handles an error condition that would not be thrown by the webserver. In other words an error condition we want to catch.
    			}
			},
			function(error){ //additional function for the error path. This would handle an error that was generated from the webserver
        		defer.reject(error);
        		
			});

			return defer.promise; //return the defer object promise with or without the reject or resolve
        	  
        }
    }
})();

//code reviewed by Tristan, John Abanto and Jesse on 10/12/2016