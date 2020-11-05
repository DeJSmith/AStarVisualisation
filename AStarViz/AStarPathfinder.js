/*

    AStar path finder uses the a star algorithm to calculate the shortest path to the goal node
    
    current heuristic: chebychev distance
    
    Author: Dan Smith
    Date: 25/09/19
*/
function AStarPathfinder(map, start, goal){

    this.map = map;
    this.start_node = start;
    this.goal_node = goal;

    this.openSet = [];
    this.closedSet = [];
    this.openSet.push(start);

    this.goalFound = false;
    this.lastNode = start;

    /*
        Returns the next most optimal node to visit given an array of grid nodes
    */
    this.nextNode = function(){
        var node = this.openSet[0];
        for(var i = 0; i < this.openSet.length; i++){
            if(this.openSet[i].f_cost < node.f_cost){
                node = this.openSet[i];
            }

            //In the case of a tie prefer greater g cost ie closer to goal node
            if(this.openSet[i].f_cost == node.f_cost){
                if(this.openSet[i].g_cost > node.g_cost){
                    node = this.openSet[i];
                }
            }
        }

        return node;
    }

    /*
        Removes and element from an array
    */
    this.removeFromArray = function(array, element){
        for (var i = array.length - 1; i >= 0; i--){
            if(array[i] === element){
                array.splice(i, 1);
            }
        }
    }


    /*
        Return an under estimate for the distance between 2 given nodes
        using chebysehv or eudclidian distance depending on the map type
    */
    this.heuristicFunction = function(node1, node2){

        var distance;
        
        if(this.map.mapType == "BSP"){
            //Euclidian distance
            distance = dist(node1.col, node1.row, node2.col, node2.row);
        } else {
            //Chebyshev distance
            var dx = Math.abs(node1.col - node2.col);
            var dy = Math.abs(node1.row - node2.row);
        
            distance = Math.max(dx, dy);
        }

        return distance;
    }

    /*
        Astar seach step, runs through a single search step of the astar algorithim
    */
    this.SearchStep = function(){

        if (this.openSet.length > 0){
            var current = this.nextNode(this.openSet);
            this.lastNode = current;
            //console.log(current);

            if(current.isGoal()){
                this.goalFound = true;
                return 1;
            }

            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            for (var i = 0; i < current.neighbors.length; i++){
                var neighbor = current.neighbors[i];
                if (!this.closedSet.includes(neighbor)){

                    var tempGCost = current.g_cost + this.heuristicFunction(neighbor, current);

                    if(!this.openSet.includes(neighbor)){
                        this.openSet.push(neighbor);
                      
                    } else {
                        continue;
                    }
                    
                    neighbor.g_cost = tempGCost;
                    neighbor.h_cost = this.heuristicFunction(neighbor, this.goal_node);
                    neighbor.f_cost = neighbor.g_cost + neighbor.h_cost;
                    neighbor.previous = current;
                } 

            }
            
            return 0; 

        } else {
            return -1;
        }
    }

}