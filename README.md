# Chatbot Web Framework for Response Comparisons and Performance Analysis in FAQs

## Project Summary
The objective of this project is to design a full stack web application to compare a variable set of FAQ Chatbot API endpoints. The chatbot platform includes a text input and a speech input for intuitiveness and to cater for real live scenarios. For the context of this project, MSF's Baby Bonus and other topics are used as a test bed for FAQ question and answer matching.<br/>

## Features
1. Text and Speech based input methods<br/>
2. Multi FAQ Endpoint selection for response visualization<br/>
3. Response similarity comparison<br/>
4. Recommendation for similar questions<br/>

### FAQ Matching APIs used
1. Govtech's askJamie (Benchmark for accuracy comparison)<br/>
2. MICL lab's QA Matching Model<br/>
3. Google's Dialogflow<br/>
4. Rajat QA Matching Model<br/>
5. Rushi's QA Matching Model<br/>

### Speech to Text API used
1. AISG's Speech to Text<br/>
2. Google's Speech API<br/>


## Deployment Considerations
Docker is used to set up 3 microservices React Frontend and NodeJs Backend. A docker-compose file is used to start up all microservices for deployment usage. Docker deployment resources can be found in the Docker branch of the repository.

## Project organization:
**frontend directory**: Written on ReactJS, provides the view of the application<br/>
**backend directory**: Written on NodeJS, provides API endpoints for frontend<br/>
**dialogflowfunctions**: Written on NodeJS, used to upload intentions to dialogflow for NLP training<br/>

## Master Branch

**Running Development**<br/>
Following directories must be executed in seperate terminals to run application

1. Frontend Directory<br/>
2. Backend Directory<br/>

**Additional Requirement**<br/>
Create a `.env` file in the Backend Directory with the following:<br/>

```
DIALOGFLOW_KEYFILENAME_COVID19=
DIALOGFLOW_KEYFILENAME_BABYBONUS=

MICL_ENDPOINT=
RAJAT_ENDPOINT_BABYBONUS=
RAJAT_ENDPOINT_COVID19=
RUSHI_ENDPOINT=
BANI_ENDPOINT=

AISG_CREDENTIALS=
SPEECH_API=
SPEECH_HTTP_API=
SPEECH_HTTP_AUTH=
SPEECH_ENDPOINT=

DB_HOST=localhost
DB_PORT=27017
DB_USER=
DB_PASS=
DB_NAME=faqdatastore
```

Create a `.env` file in the Frontend Directory with the following:<br/>

```
REACT_APP_API=
```

# Installation/setup instructions will be provided in each directory.
