/*
    Genereates a map with random obstalces based on obstacle density
    
    Author: Dan Smith
    Date: 25/09/19
    
*/
function SearchMap(cols, rows, x, y, w, h, allowDiagonals, obstacleRatio ) {
    this.mapType = "Search";
    
    this.cols = cols;
    this.rows = rows;

    this.grid = [];
    this.path = [];

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Make 2D array
    for (var i = 0; i < cols; i++) {
        this.grid[i] = new Array(rows)
    }

    for (var p = 0; p < cols; p++) {
        for (var q = 0; q < rows; q++) {
            var isObstacle = random(1.0) < obstacleRatio;
            node = new Node(p, q, x + p * w / cols, y + q * h / rows, w / cols, h / rows, isObstacle, this.grid);
            this.grid[p][q] = node;
            this.grid[p][q].setColor();
        }
    }
}