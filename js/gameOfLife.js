
var app = angular.module('GameOfLife', []);
app.controller('PlayingFieldController',["$scope", "$interval", function($scope,$interval){
    $scope.gameIsRunning = false;
    $scope.countGenerations = 0;
    $scope.refreshIntervalId = {};
    $scope.playingField = {
        data:[]
    };


    // Spielfeld wird erzeugt und die Anfangszustände der Zellen werden vergeben
    $scope.createGrid = function(width,height){
        $interval.cancel($scope.stopInterval);
        $scope.countGenerations = 0;
        $scope.playingField = {
            width:width,
            height:height,
            data:[]
        };
        for( var r = 0 ; r < width; r++){
            $scope.playingField.data.push([]);
            for( var c = 0 ; c < height; c++){
                $scope.playingField.data[r].push(false);
            }
        }
        $(".grid").width("600px");
        $(".grid").height("600px");
    };

    // Zellenstatus ändern: tot / lebend
    $scope.clickCell = function(cells, index){
        cells[index] = !cells[index];
    };
    // Farben der jeweiligen Zellen je nach Zustand zuweisen
    $scope.style = function(value) {
        return { "background-color": value };
    };
    // Aktueller Zustand des Spielfeldes + Zellen wird kopiert
    $scope.copyMyField = function(gameFieldToCopy){
        var myCopy = {width:gameFieldToCopy.width, height:gameFieldToCopy.height, data:[]};
        for(var r = 0 ; r < gameFieldToCopy.width ; r ++){
            myCopy.data.push([]);
            for(var c = 0 ; c < gameFieldToCopy.height ; c++){
                myCopy.data[r].push(gameFieldToCopy.data[r][c]);
            }
        }
        return myCopy;
    };

    // 1. Generation wird gestartet und wiederholt
    $scope.startRound = function(){
        var newData = $scope.copyMyField($scope.playingField);
        for(var r = 0 ; r < newData.width ; r++){
            for(var c = 0 ; c < newData.height ; c++){
                var alive = 0;
                // Es wird durch alle Zellen iteriert
                for(var i = r-1 ; i<=r+1;++i){
                    for(var j = c-1; j<= c+1 ; ++j){
                        if($scope.getCell(newData,j,i) == true){
                            alive++;
                        }
                    }
                }
                if(newData.data[r][c] == true){
                    alive -=1;
                }
                // Regeln für die Lebenszustände werden geprüft
                if(newData.data[r][c] == true && (alive < 2 || alive > 3)){
                    $scope.playingField.data[r][c] = false;
                }
                if(newData.data[r][c] == true && (alive == 2 || alive == 3)){
                    $scope.playingField.data[r][c]= true;
                }
                if(newData.data[r][c] == false && alive == 3){
                    $scope.playingField.data[r][c] = true;
                }
            }
        }
        // Zählt die Anzahl der Generationen die durchlaufen sind
        $scope.countGenerations++;
    };
    // Liegt eine Zelle am Rand des spielfelds, geht es auf der gegenüberliegenden Seite weiter
    $scope.getCell = function(newData,x,y){
        var h = newData.height-1;
        var w = newData.width-1;
        return newData.data[(y+h) % h][(x+w) %w];
    };
    // Spiel starten
    $scope.startGame = function(){
        if((!$scope.gameIsRunning)&&($scope.playingField.data.length > 0)){
            console.log("Game started");
            $scope.gameIsRunning = true;
            $scope.stopInterval = $interval($scope.startRound, 1);
        }
    };
    // Spiel beenden
    $scope.stopGame = function(){
        if($scope.gameIsRunning){
            console.log("Game stopped");
            $scope.gameIsRunning = false;
            $interval.cancel($scope.stopInterval);
        }
    };
    //Sspielfeld zurücksetzen
    $scope.refreshGameField = function(){
        console.log("Game refreshed");
        $scope.countGenerations = 0;
        $scope.createGrid($scope.playingField.width, $scope.playingField.height);
    };
    $scope.playingFieldCreatedBoolean = function(){
        if($scope.playingField.data.length > 0){
            return true;
        } else {
            return false;
        }
    };
}]);
    // HTML-Element erzeugen
    app.directive("gameField", function(){
    return {
        restrict: "E",
        templateUrl: "html/game-field.html"
    }
});