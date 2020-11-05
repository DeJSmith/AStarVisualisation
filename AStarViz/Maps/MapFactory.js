/*

    The map factory produces a map using one of 3 map generations methods at random

*/

function MapFactory()
{
    this.maps = []; 
    this.maps.push(BspMap); // BSP rogue-like map
    this.maps.push(MazeMap); //Maze like map 
    this.maps.push(BspMap); 
    this.maps.push(MazeMap);
    
    
    this.shuffleMaps = function(){
        this.maps.sort(() => Math.random() - 0.5);
    }

    this.getMap = function(cols, rows, x, y, w, h, allowDiagonals, percentObstacles)
    {
        this.shuffleMaps();
        
        if(this.maps.length == 0) return undefined;

        var percentObstacles = 0.5;

        return new this.maps[0](cols, rows, x, y, w, h, allowDiagonals, percentObstacles);
    }

}