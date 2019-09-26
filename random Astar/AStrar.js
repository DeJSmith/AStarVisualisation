/**
    A-Star visualisation project using p5 js
    Author: Daniel Smith
    Date: 23/09/19
**/

//Globals
var mapGrid;
var rows, cols;
var grid_width, grid_height;
var openSet = []; //set of nodes to be evaluated
var closedSet = []; //set of nodes already evaluated
var path = [];
var uiElements = [];
var allowDiagonals = true;

var moveSet = [
        ["N", -1, 0],
        ["NE", -1, 1],
        ["E", 0, 1],
        ["SE", 1, 1],
        ["S", 1, 0],
        ["SW", 1, -1],
        ["W", 0, -1],
        ["NW", -1, -1]
    ];


function step(button) {
    pauseUnpause(true);
    stepsAllowed = 1;
}

function toggleDiagonals() {
    allowDiagonals = !allowDiagonals;
}

function mouseClicked() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].mouseClick(mouseX, mouseY);
    }

}

function pauseUnpause(pause) {
    paused = pause;
    runPauseButton.label = paused ? "run" : "pause";
}


function doGUI() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].show();
    }
}

function SettingBox(label, x, y, isSet, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.isSet = isSet;
    this.callback = callback;

    this.show = function() {
        //noFill();
        strokeWeight(1);
        stroke(0);
        noFill();
        ellipse(this.x + 10, this.y + 10, 20, 20);
        if (this.isSet) {
            fill(0);
            ellipse(this.x + 10, this.y + 10, 3, 3);
        }
        fill(0);
        noStroke();
        text(label, this.x + 25, this.y + 15);
    }

    this.mouseClick = function(x, y) {
        if (x > this.x && x <= this.x + 20 &&
            y > this.y && y <= this.y + 20) {
            this.isSet = !this.isSet;
            if (this.callback != null)
                this.callback(this);
        }
    }
}

function Button(label, x, y, w, h, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.callback = callback;

    this.show = function() {
        stroke(0);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
    }

    this.mouseClick = function(x, y) {
        if (this.callback != null &&
            x > this.x && x <= this.x + this.w &&
            y > this.y && y <= this.y + this.h) {
            this.callback(this);
        }
    }
}


function runpause(button) {
    pauseUnpause(!paused);
}

function restart(button) {
    logTimings();
    clearTimings();
    initaliseSearchExample(cols, rows);
    pauseUnpause(true);
}

function toggleDiagonals() {
    allowDiagonals = !allowDiagonals;
}


/*
Return random integer between lower and upper bounds
*/
function randomize(lower, upper){
    return Math.floor(Math.random() * upper) + 1
}

/*
Grid plane class describes plane for which AStar will traverse
*/
function GridPlane(cols, rows, obstacleDensity){
    
    this.grid = new Array(cols);
    this.start_node = null;
    this.goal_node = null;
    this.columns = cols;
    this.rows = rows;
    this.goalFound = false;
    
    this.initialize = function(){
        
        // initialize 2D array for grid 
        for (var i = 0; i < cols; i++){
            this.grid[i] = new Array(rows);
            for (var j = 0; j < rows; j++){
                var obs = (randomize(0, 100) <= obstacleDensity);
                this.grid[i][j] = new Node(i,j, obs);
            }
        }
    
        // choose random x,y coordinates for start and goal nodes
        var goal_x = randomize(0, cols);
        var goal_y = randomize(0, rows);
        var start_x = randomize(0, cols);
        var start_y = randomize(0, rows);
        
        /*
        //var goal_x = Math.floor(cols - (cols/4));
        //var goal_y = Math.floor(rows/2);
        //var start_x = Math.floor(cols/4);
        //var start_y = Math.floor(rows/2);
        
        //var n = Math.floor(cols/2);
        //var m = Math.floor(rows/3);
        //var p = Math.floor(rows - (rows/3));
       
        for(var q = 0; q < 3; q++){
            while (m <= p){
                this.grid[n+q][m+q].obstacle = true;
                m++;
            }
        }
        
        */
        if(this.grid[start_x][start_y] == this.grid[goal_x][goal_y]){
            start_x = (start_x * start_y) % cols;
            start_y = (start_y * start_x) % rows;
        }
    
        // set grid goal node
        this.grid[goal_x][goal_y].setGoalNode();
        this.goal_node = this.grid[goal_x][goal_y];
    
        // set grid start node
        this.grid[start_x][start_y].setStartNode();
        this.start_node = this.grid[start_x][start_y];
   
        console.log("getting neighbors");
        for(var x = 0; x < cols;  x++){
            for(var y = 0; y < rows; y++){
                var node = this.grid[x][y];
                node.setColor();
                node.getNeighbors();
            }
        }
    }
    
    this.getStartNode = function() {
        return this.start_node;
    }
    
    this.getGoalNode = function() {
        return this.goal_node;
    }
    
    this.getNode = function(i, j){
        return this.grid[i][j];
    }
    
    /*
    check coordinates do not exceed grid bounds
    */
    this.checkBounds = function(i, j){
        
        if(i < 0 || i >= cols){
            valid_x = false;
            return false;
        } else if(j < 0 || j >= rows){
            return false;
        } else {
            return true;
        }
        return false;
    } 
}


/*
Node class 
*/
function Node(row , col, obstacle){
    
    this.node_x = row;
    this.node_y = col;
    this.node_color = null;
    this.f_cost = 0;            // f = h + g
    this.g_cost = 0;            //distance from start node
    this.h_cost = 0;            //distance from goal node
    this.obstacle = obstacle;
    this.goal = false;
    this.start_node = false;
    this.neighbors = [];
    
    /*
    Draw a rectangle for node on the webpage and colour it accordingly
    */
    this.show = function(){
        fill(this.node_color);
        rect((this.node_x * grid_width), (this.node_y * grid_height), grid_width, grid_height);
    }
    
    /*
    Initialize node color before traversal
    */
    this.setColor = function(){
        if(this.isObstacle()){
            this.node_color = color(51);
        }else if(this.isGoal()){
            this.node_color = color(0, 255, 150);
        }else if(this.start_node){
            this.node_color = color(0, 150, 255);
        }else {
            this.node_color = color(255);
        }
    }
    
    /*
    Calculate all neighbors of a node 
    */
    this.getNeighbors = function(){
        for (var i = 0; i < moveSet.length; i++){
            var x = this.node_x + moveSet[i][1];
            var y = this.node_y + moveSet[i][2];
            if(mapGrid.checkBounds(x, y)){
                if(!mapGrid.grid[x][y].isObstacle()){
                    this.neighbors.push(mapGrid.grid[x][y]);
                }
            }
        }  
    }
    
    /*
    Change the node color
    */
    this.changeColour = function(col){
        if(!this.isGoal() && !this.start_node){
            this.node_color = col;
        }
    }
    
    this.setGoalNode = function(){
        this.obstacle = false;
        this.goal = true;
    }
    
    this.setStartNode = function(){
        this.obstacle = false;
        this.start_node = true;
    }
    
    this.isGoal = function(){
        return this.goal;
    }
    
    this.isObstacle = function(){
        return this.obstacle;
    }
    
    this.getX = function(){
        return this.node_x;
    }
    
    this.getY = function(){
        return this.node_y;
    }
    
}


/*
Return an under estimate for the distance between 2 given nodes
using chebysehv distance.
*/
function heuristicFunction(node1, node2){
    
    //Euclidian distance
    //var distance = dist(node1.getX(), node1.getY(), node2.getX(), node2.getY());
    
    //Chebyshev distance
    var dx = Math.abs(node1.getX() - node2.getX());
    var dy = Math.abs(node1.getY() - node2.getY());
        
    return Math.max(dx, dy) * 1.9;
    
    //return distance;
}

/*
Returns the next most optimal node to visit given an array of grid nodes
*/
function nextNode(openSet){
    var lowest = Number.POSITIVE_INFINITY;
    var node = null;
    for(var i = 0; i < openSet.length; i++){
        if(openSet[i].f_cost < lowest){
            lowest = openSet[i].f_cost;
            node = openSet[i];
        }
    }
    
    return node;
}

/*
Removes an item from a list
*/
function removeFromArray(arr, item){
    for (var i = arr.length - 1; i >= 0; i--){
        if((arr[i].getX() == item.getX()) && (arr[i].getY() == item.getY())){
            arr.splice(i, 1);
        }
    }
}



/*
Setup is called once per execution in p5 js
used to setup initail scenario
*/
function setup(){
    createCanvas(windowWidth, windowHeight);
    
    runPauseButton = new Button("run", 430, 20, 50, 30, runpause);
    uiElements.push(runPauseButton);
    //uiElements.push(new Button("step", 430, 70, 50, 30, step));
    uiElements.push(new Button("restart", 430, 120, 50, 30, restart));
    uiElements.push(new SettingBox("AllowDiag", 430, 180, allowDiagonals, toggleDiagonals));
    console.log("A*");
    
    //rows = Math.ceil((randomize(0,100)+1) / 10) *10;
    rows = 50;
    cols = Math.floor(rows * 1.5);
    
    grid_width = width / cols;
    grid_height = height / rows;
    
    //mapGrid = new GridPlane(cols, rows, 40);
    //mapGrid.initialize();
    
    //openSet.push(mapGrid.getStartNode());
    
}

/*
Draw loop called repeatedly in p5 js is used as the main Astar loop and to color
grid nodes 
*/
function draw() {
    var visited = color(218,118, 222);
    var descovered = color(220, 14, 227);
    
    doGUI();
    
    //Draw grid 
    /*
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            mapGrid.grid[i][j].show();
        }
    }
    */
    //Change colour of visited nodes in drawing
    for (var i = 0; i < openSet.length; i++){
        openSet[i].changeColour(visited);
        openSet[i].show();
    }
    
    //Change color of descovered nodes in drawing
    for (var i = 0; i < closedSet.length; i++){
        closedSet[i].changeColour(descovered);
        closedSet[i].show();
    }
    
    if ((openSet.length > 0) && (!mapGrid.goalFound)){
        var current = nextNode(openSet);
        console.log(current);
            
        if(current.isGoal()){
            console.log("DONE!");
            mapGrid.goalFound = true;
            return 
        }
            
        removeFromArray(openSet, current);
        closedSet.push(current);
            
        for (var i = 0; i < current.neighbors.length; i++){
            var neighbor = current.neighbors[i];
            if (!closedSet.includes(neighbor)){
                    
                var tempGCost = current.g_cost + 1;
                    
                if(openSet.includes(neighbor)){
                    if(tempGCost < neighbor.g_cost){
                        neighbor.g_cost = tempGCost;
                    }
                } else {
                    neighbor.g_cost = tempGCost;
                    openSet.push(neighbor);
                }
            
                neighbor.h_cost = distanceEstimate(neighbor, mapGrid.getGoalNode());
                neighbor.f_cost = neighbor.g_cost + neighbor.h_cost;
            } 
        }
    }
    
    return
}
