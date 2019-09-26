/*
    Node class
    
    Represents a point in the grid and on the webpage
    
    can be:
        - goal node
        - start node
        - obstacle (non-traversable)
        - regular node (traversable)
*/
function Node(row , col, x, y, width, height, obstalce, grid){

    //Heuristics
    this.f_cost = 0;            //f = h + g
    this.g_cost = 0;            //distance from start node
    this.h_cost = 0;            //distance from goal node

    //Node visual properties
    this.grid = grid;
    this.width = width;
    this.height = height;

    //Node location properties
    this.row = row;         //grid row
    this.col = col;         //grid column
    this.x = x;             //screen x
    this.y = y;             //screen y

    //Extra node properties
    this.node_color = color(255);
    this.obstacle = obstalce;
    this.goal = false;
    this.start_node = false;

    //Properties for AStar 
    this.neighbors = [];
    this.previous = undefined;
    this.visited = false;

    /*
        Draw a rectangle for node on the webpage and colour it accordingly
    */
    this.show = function(){
        if(this.obstacle){
            fill(51);
            noStroke();
            rect(this.x + this.width * 0.5, this.y + this.width * 0.5, this.width * 0.5, this.height * 0.5);
        } else if(this.isGoal() || this.start_node) {
            fill(this.node_color);
            noStroke();
            rect(this.x + this.width * 0.5, this.y + this.width * 0.5, this.width * 0.5, this.height * 0.5);
        }
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
        this.node_color = color(0, 255, 150);
        this.width = this.width * 2;
        this.height = this.height * 2;
    }

    this.setStartNode = function(){
        this.obstacle = false;
        this.start_node = true;
        this.node_color = color(0, 150, 255);
        this.width = this.width * 2;
        this.height = this.height * 2;
    }

    this.setObstacle = function(){
        this.obstacle = true;
        this.node_color = color(51);
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