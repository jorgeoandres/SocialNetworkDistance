# SocialNetworkDistance
Web API for users. 
The main objective is to implement an algorithm that let us calculate the distance between two users considering the following relation as an edge in an unweighted graph.
The software was developed with Javascript technology. Backend was developed with Node.JS, Express and Mongoose. Database is hosted in MongoDB Atlas (string connection will be sent if you ask me for permission). <br>
The implementation of API considered CRUD operations for users. Besides, it provides routes to get followed and following users by the user.<br>

## Algorithm to find distances
The algorithm considers each user as a node part of the unweighted graph. To solve the distance it uses a queue that will consider a tree structure on the graph. The tree will be looked at with a BFS algorithm.
The BFS algorithm is the best option to find the level (distance) because it will look always for the minimum value distance on each level of the tree. The algorithm complexity is O(|V|+|E|). Even though it will take more time because it queries the database and the time to take the information is not considered in the complexity.

## Installation
You only need to dowload the code and use node.js to run the solution. By asking me for the mongo atlas connection, you can connect to the database changing the config file in ./config/database.config.js
It will create a server on your host listening to the port 3000.  
```bash
node /folder/to/server.js
```
The database is already implemented and listing for all ips.

## Tests
Tests are implemented with Mocha and Chai. Both modules uses promises to test the request. You can run all the test by using on the root folder:
```bash
npm test
```
