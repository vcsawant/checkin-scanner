angular.module('starter.controllers', ['ngCordova','restangular'])

.controller('DashCtrl', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, Restangular) {
  $scope.show_result=false;
  $scope.last_checked_in = "n/a";
  var clearForms = function()
  {
    $scope.input_email = "";
    $scope.show_result = false;
  }

  //updates title of check-in page to match event
  $scope.$on('event-selected', function(events, args) {
    $scope.dashTitle=args;
  });

  $scope.scanBarcode = function() {
    clearForms();
    $scope.input_email = "waiting";
    $cordovaBarcodeScanner.scan().then(function(imageData) {
        // alert(imageData.text);
        $scope.input_email=imageData.text;
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
        $scope.processEmail();
    }, function(error) {
        console.log("An error happened -> " + error);
    });
  };

  $scope.processEmail = function() {
    Restangular.setBaseUrl("https://vandyhacks.org");
    Restangular.one('/api/checkemail')
               .get({'checkin_token': '9kvKkdcDyOxvA9aZ35QJJw','email':$scope.input_email})
               .then(function (response) {
                    $scope.show_result=true;
                    console.log(response);
                    $scope.hacker = response;                    
                    $scope.bad_result=!response.success;                                                                                  
                }
            );
  }; 

  // ! needs editing as API is updated !
  $scope.checkIn = function() {
    Restangular.setBaseUrl("https://vandyhacks.org");
    console.log($scope.input_email);
    Restangular.all('/api/checkin')
               .customPOST({'checkin_token': '9kvKkdcDyOxvA9aZ35QJJw','email':$scope.input_email})
               .then(function(data) {
                console.log(data);
                $scope.last_checked_in = $scope.hacker.name;
                clearForms();
               });

  };

})


//controller for the event menu
.controller('EventsCtrl', function($scope, $rootScope) {
  $scope.clicked=function(str){

    $rootScope.$broadcast('event-selected',str);

  }
  //load events here using api
  $scope.events = [
    { event: 'Hackathon' },
    { event: 'Lunch' },
    { event: 'Dinner' },
    { event: 'Lecture' }
  ];
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
