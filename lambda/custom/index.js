/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const dbHelper = require('./helpers/dbHelper');
const GENERAL_REPROMPT = "What would you like to do?";
const dynamoDBTableName = "dynamodb-starter";

const BACKGROUND_IMAGE_URL = 'https://s3://reflect-mirror-videos/yoga-2959226_1920.jpg',
  VIDEO_URL = 'https://s3://reflect-mirror-videos/Yoga - 1059.mp4',
  VIDEO_TITLE = "Video from pixabay.com",
  VIDEO_SUBTITLE = "Used under Creative Commons.",
  TITLE = 'Visual Escape',
  TEXT = 'A 60-second virtual vacation for your brain. Please relax before the video loads.';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Hello there. What workout would you like to do today?';
    const repromptText = 'What would you like to do? You can say HELP to get available options';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const InProgressPlayVideoIIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'PlayVideoInten' &&
      request.dialogState !== 'COMPLETED';
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentIntent)
      .getResponse();
  }
}

const SetMorningRoutineIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SetMorningRoutineIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const workout = slots.WorkoutName.value;
    let command = "morning routine " + workout;
    return dbHelper.setMorningRoutine(command)
      .then((data) => {
        const speechText = `Morning routine set to ${workout}.`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while playing workout ${workout}", err);
        const speechText = "we cannot play your workout video right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};

const MorningRoutineIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MorningRoutineIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    return dbHelper.getMorningRoutine()
      .then((data) => {
        const speechText = `Morning routine playing `;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while playing workout", err);
        const speechText = "we cannot play your workout video right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};

const PlayVideoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlayVideoIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const workout = slots.WorkoutName.value;
    let command = "play " + workout;
    return dbHelper.updateWorkoutCommand(command)
      .then((data) => {
        const speechText = `Workout playing.`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while playing workout ${workout}", err);
        const speechText = "we cannot play your workout video right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};


const RestartVideoIntentHandler= {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RestartVideoIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const workout = slots.WorkoutName.value;
    const command = "restart";
    return dbHelper.updateWorkoutCommand(command)
      .then((data) => {
        const speechText = `Workout restarted.`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while restarting workout ${workout}", err);
        const speechText = "we cannot restart your workout video right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};

const PauseVideoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PauseVideoIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const workout = slots.WorkoutName.value;
    const command = "pause";
    return dbHelper.updateWorkoutCommand(command)
      .then((data) => {
        const speechText = `Workout paused.`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while pausing workout ${workout}", err);
        const speechText = "we cannot pause your workout video right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};

const StopVideoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StopVideoIntent';
  },
  async handle(handlerInput) {
    const {responseBuilder } = handlerInput;
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const workout = slots.WorkoutName.value;
    const command = "stop workout";
    return dbHelper.updateWorkoutCommand(command)
      .then((data) => {
        const speechText = `Workout stopped.`;
        return responseBuilder
          .speak(speechText)
          .reprompt(GENERAL_REPROMPT)
          .getResponse();
      })
      .catch((err) => {
        console.log("Error occured while stoping workout ${workout}", err);
        const speechText = "we cannot stop your workout video right now. Try again!"
        return responseBuilder
          .speak(speechText)
          .getResponse();
      })
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

function supportsDisplay(handlerInput) {
  const hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
  return hasDisplay;
}

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    InProgressPlayVideoIIntentHandler,
    PlayVideoIntentHandler,
    PauseVideoIntentHandler,
    RestartVideoIntentHandler,
    MorningRoutineIntentHandler,
    SetMorningRoutineIntentHandler,
    // WorkoutIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName(dynamoDBTableName)
  .withAutoCreateTable(true)
  .lambda();
