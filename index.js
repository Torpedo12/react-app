const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ AWS Config without .env
AWS.config.update({
  region: 'us-east-1', // Replace with your region
  accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.get('/items', async (req, res) => {
  const params = {
    TableName: 'YourDynamoDBTableName' // Replace with your table name
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
