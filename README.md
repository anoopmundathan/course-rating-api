# course-rating-api
Treehouse Project 11 - Build a Course Rating API With Express

REST API using Express. The API will provide a way for users to review educational courses: users can see a list of courses in a database; add courses to the database; and add reviews for a specific course.

AngularJS single page application will consume this RESR API. The AngularJS application includes views to display a list of courses, display the details for a course including reviews and ability to post/delete a review, create or update a course, register a user, and login a user.

REST API will include two main resources, “courses” and “users”, containing the following routes:

* /api/courses
  * GET - Returns a list of courses
  * POST - Creates a course
  
* /api/courses/:id
  * GET - Returns a single course
  * PUT - Updates a course
  
* /api/courses/:courseId/reviews
  * POST - Creates a review for the specified course

* /api/courses/:courseId/reviews/:id
  * DELETE - Deletes a review

* /api/users
  * POST - Creates a user

* /api/users/
  * GET - Returns the current user
<img width="1269" alt="screen shot 2017-02-26 at 11 56 21" src="https://cloud.githubusercontent.com/assets/3778229/23339492/937cf8c4-fc1b-11e6-91f9-e0483a727ffd.png">

## Getting Started

### Prerequisite
[Node.js](https://nodejs.org/en/)

[MongoDB](https://www.mongodb.com/)
### Setup
```
$ git clone https://github.com/anoopmundathan/course-rating-api.git
$ cd course-rating-api
```
### Install
```
$ npm i
```
### Run
``` 
$ npm start
```
### View application
``` 
http://localhost:5000
```

#### Project Resources
[Mongo Basics] (https://teamtreehouse.com/library/mongo-basics)

[REST API Basics](https://teamtreehouse.com/library/rest-api-basics)

[Build a REST API with Express](https://teamtreehouse.com/library/build-a-rest-api-with-express)

[User Authentication with Express and Mongo] (https://teamtreehouse.com/library/user-authentication-with-express-and-mongo)

[Node.js Documentation] (https://nodejs.org/en/docs/)

[Express Documentation](http://expressjs.com/en/4x/api.html)

[Mongoose Documentation](http://mongoosejs.com/docs/guide.html)

[Mongoose Schemas (including Virtuals)](http://mongoosejs.com/docs/guide.html)

[Mongoose Queries](http://mongoosejs.com/docs/queries.html)

[Mongoose Validation](http://mongoosejs.com/docs/validation.html)

[Mongoose Population](https://github.com/ncb000gt/node.bcrypt.js/)

[ironNode](http://s-a.github.io/iron-node/)

[ngInspector](http://ng-inspector.org/)

[AngularJS Batarang](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?hl=en)

[Email Address Regular Expression That 99.99% Works](http://emailregex.com/)

[JSDoc](http://usejsdoc.org/)
