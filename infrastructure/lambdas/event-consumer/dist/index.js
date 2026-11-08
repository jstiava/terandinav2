import { DynamoDBClient, PutItemCommand, } from '@aws-sdk/client-dynamodb';
const dynamodb = new DynamoDBClient({
    region: 'us-east-2'
});
export const handler = async (event) => {
    await dynamodb.send(new PutItemCommand({
        TableName: 'terandinav-event-log-table',
        Item: {
            id: { S: crypto.randomUUID() },
            message: { S: "My event sent by SQS and processed by lambda" },
            payload: { S: JSON.stringify(event) },
            processedAt: { S: new Date().toISOString() },
        },
    }));
    return {
        success: true
    };
};
