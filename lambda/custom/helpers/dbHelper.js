var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
const tableName = "reflect-mirror";

var dbHelper = function () { };
var docClient = new AWS.DynamoDB.DocumentClient();

dbHelper.prototype.updateWorkoutCommand = (command) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "id": 0
            },
            UpdateExpression: "set workoutCommands = :newCommand",
            ExpressionAttributeValues:{
                ":newCommand":command
            },
            ReturnValues:"UPDATED_NEW"
        };
        docClient.update(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert " + err);
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbHelper.prototype.getMorningRoutine = () => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "id": 0
            },
            UpdateExpression: "set workoutCommands = morningRoutine",
            ReturnValues:"UPDATED_NEW"
        };
        docClient.update(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert " + err);
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbHelper.prototype.setMorningRoutine = (command) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "id": 0
            },
            UpdateExpression: "set morningRoutine = :newCommand",
            ExpressionAttributeValues:{
                ":newCommand":command
            },
            ReturnValues:"UPDATED_NEW"
        };
        docClient.update(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert " + err);
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

module.exports = new dbHelper();