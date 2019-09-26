AStar Visualisation project 

Uses the AStar pathfinding algorithm to calculate the shortest path from a randomly chosen start node to randomly chosen goal node.
And makes use of the p5.js library to visualise the algorithm as it runs.

Algorithm:
    - Written from wikipedia psuedo code 
    - uses either chebychev or euclidian distance as hueristic measurement

Map selection:
    3 map types:
        - Search map - randomly generated map full of non-traversable obstacles based on a pre-defined obstalce density
        - Maze map - randonly generated maze like map created with a backtracking maze creation algorithm found online and customized
        - BSP map - binary space partitioning map generation method found online and customized
        

