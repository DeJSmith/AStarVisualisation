/*
    Astar visualisation project

    Author: Dan Smith
    Date: 25/09/19
*/

// Globals
var mapSpace;   
var pathfinder; 
var status;
var searchFlag = false;
var setupMap = true;


//8 way move set
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


/*
    Return random integer between lower and upper bounds
*/
function randomize(lower, upper){
    return Math.floor(Math.random() * upper) + 1
}

/*
    Return a random node from a the map
*/
function randomNode(){
    var x = randomize(0, (mapSpace.cols - 1));
    var y = randomize(0, (mapSpace.rows - 1));

    return mapSpace.grid[x][y];
}


/*
    check coordinates do not exceed grid bounds
*/
function checkBounds(i, j){

    if(i < 0 || i >= mapSpace.cols){
        return false;
    } else if(j < 0 || j >= mapSpace.rows){
        return false;
    } else {
        return true;
    }
} 


/*
    Calculate all neighbors of a given node 
*/
function getNeighbors(node){
    for (var i = 0; i < moveSet.length; i++){
        var x = node.row + moveSet[i][1];
        var y = node.col + moveSet[i][2];
        if(checkBounds(x, y)){
            if(!mapSpace.grid[x][y].isObstacle()){
                node.neighbors.push(mapSpace.grid[x][y]);
            }
        }
    }  
}


/*
    Setup is called once per execution in p5 js
    used to setup initail scenario
*/
function setup(){

    createCanvas(1000, 800);

    console.log("A*");

    buttonStart = createButton("Run Simulation");
    buttonStart.mousePressed(startSearch)
    buttonStart.position(600, 70);
    buttonPause = createButton("Pause Simulation");
    buttonPause.mousePressed(stopSearch)
    buttonPause.position(710, 70);
    buttonReset = createButton("Restart Simulation");
    buttonReset.mousePressed(reset)
    buttonReset.position(835, 70);

    start();
    
}

function start() {
    console.log("run");
    var rows = 75;
    var cols = Math.floor(rows * 1.5);


    mapSpace = new MapFactory().getMap(cols, rows, 10, 10, (width * 0.95), (height * 0.95), true, 0.5);
    
    console.log("Map type: %s", mapSpace.mapType);

    //Select two randoms nodes from the map that are not obstacles to be the start and goal ndoes
    goal_node = randomNode();
    start_node = randomNode();

    while(goal_node.isObstacle() || start_node.isObstacle()){
        start_node = randomNode();
        goal_node = randomNode();

        if(start_node === goal_node){
            start_node = randomNode();
        }
    }

    console.log("Setting goal and start nodes");
    start_node.setStartNode();
    goal_node.setGoalNode();
    goal_node.show();
    start_node.show();

    //Calculate all neighbors of all valid nodes in the grid
    for(var i = 0; i < mapSpace.cols; i++){
        for(var j = 0; j < mapSpace.rows; j++){
            if(!mapSpace.grid[i][j].isObstacle()){
                getNeighbors(mapSpace.grid[i][j]);
            }
        }
    }

    pathfinder = new AStarPathfinder(mapSpace, start_node, goal_node);
}

function startSearch() {
    searchFlag = true;
}

function stopSearch() {
    searchFlag = false;
}

function reset() {
    searchFlag = true;
    clear();
    start();
}




/*
    simply calls an iteration of AStar search and updates search status
*/
function search(){

    var result = pathfinder.SearchStep();

    switch(result){
        case -1:
            status = "No Possible Solution";
            break;
        case 0:
            status = "Searching";
            break;
        case 1:
            status = "Goal Found";
            break;
    }
}


/*
    Draw map and all map contents on webpage
*/
function drawMap(){

    pathfinder.goal_node.show();
    pathfinder.start_node.show();

    //Draw grid 
    for (var i = 0; i < mapSpace.cols; i++){
        for (var j = 0; j < mapSpace.rows; j++){
            mapSpace.grid[i][j].show();
        }
    }

    setupMap = false;
}


/*
    Backtrack from the last checked node to find the path
*/
function backtrackPath(last_node){
    var path = [];
    var temp = last_node;
    path.push(temp);

    while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }

    return path;
}

/*
    Draw a line to represent the current path
*/
function drawPath(path){

    noFill();
    stroke(255, 0, 200);
    strokeWeight(mapSpace.w / mapSpace.cols / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
    }
    endShape();
}


/*
    Draw loop called repeatedly in p5 js is used as the main Astar loop and to color
    grid nodes 
*/
function draw() {
    if(setupMap) {
        drawMap();
        
    }


    if(searchFlag){
        search();
        background(255);

        drawMap();
    
        pathfinder.goal_node.show();
        pathfinder.start_node.show();
    
    
        //Visualise current path
        var path = backtrackPath(pathfinder.lastNode);
        drawPath(path);
    }
    
}