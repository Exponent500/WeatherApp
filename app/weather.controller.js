(function() {
    'use strict';

    angular
        .module('WeatherApp')
        .controller('WeatherController', WeatherController);

    WeatherController.$inject = ['$http', 'WeatherFactory', 'toastr']; 

    /* @ngInject */
    function WeatherController($http, WeatherFactory, toastr) {
        var vm = this; 
        
        activate(); 

        function activate() {
 			vm.searchHistory = []; //array to store search history	
            vm.showWeatherInfo = false; //flag to control whether or not City Information panel is shown
            vm.measurementSystem = 'imperial'; //measurement System to use
            vm.changeMeasurementSystem = false; //flag to control whether or not the measurement system should toggle between imperial and metric
            vm.cityName = '';
            vm.temperatureUnits = 'F'; //initial unit for temperature
            vm.windSpeedUnits = 'mi/h'; //initial unit for wind speed
        }

        // gets OpenWeatherMap data for a specific city
       vm.getWeather = function (cityName, changeMeasurementSystem){

            vm.cityName = cityName;

            //checks if there is a need to change the measurement system used
            if (changeMeasurementSystem === true){
                vm.measurementSystem = 'metric';
                vm.temperatureUnits = 'C';
                vm.windSpeedUnits = 'm/s';
            } else {
                vm.measurementSystem = 'imperial';
                vm.temperatureUnits = 'F';
                vm.windSpeedUnits = 'mph';
            }

       		WeatherFactory.getWeatherDataByCityName(cityName, vm.measurementSystem).then( 
        		function(response) { 

        			vm.weather = response.data; //grabs weather JSON data response from weather factory
                    vm.showWeatherInfo = true;
                            			
					vm.searchHistory.push({ //pushes latest city weather info into searchHistory array
						name: vm.weather.name,
						time: vm.weather.dt
					});					

        			vm.weatherIcon = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";
        			vm.latLon = response.data.coord.lat + ',' + response.data.coord.lon;

    			},
    			function(error){ //creates toastr error messages based on OpenWeatherAPI error response messages
    				vm.showWeatherInfo = false;
                    if (error.data.message === 'Error: Not found city'){
                        toastr.error('City name not found'); 
                    } else {
                        toastr.error('There was an error');
                    }
                       
    			}
        	);

        // vm.checkAll = function(check){
        //   alert("got it!");
        // };	
       };
    }
})();
