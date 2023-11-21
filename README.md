# Branak Back End Project

Back end project for Branak

### features

- Socket.io web service
- MongoDB connection
- HTTP endpoints

## Steps to initialize the project

- Add environment variables for (email, database connection etc). to a .env file
 in the root folder (ask for the values)
- Install node dependencies executing (npm install) in the root folder 

## Steps to Run locally
execute
- node app.js

## Steps to Deploy 

- Every push to the master branch will trigger a new deployment on AWS Beanstalk see the pipeline in (https://console.aws.amazon.com/codesuite/codepipeline/pipelines/BranakBackPipeline/view?region=us-east-1)
