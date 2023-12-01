

// var multer = require("multer")
// var multerS3 = require("multer-s3")

// var AWS = require("aws-sdk")
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// })
// const s3 = new AWS.s3()
// const myBucket = process.env.AWS_BUCKET_NAME

// var upload = multer({
// storage:multerS3({
//     s3:s3,
//     bucket:myBucket,
//     acl:"public-read",
//     contentType:multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//     cb(null, file.originalname)
//     }
// })
// })


// application.post("", upload.single("file"), ctrl)




///////////////////////////////////////////////////////
ACCESS_SECRET=
ACCESS_KEY=
REGION=
BUCKET=


///////////////////////////////////////////////////////
const fileSchema = new mongoose.Schema({
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now },
  });
///////////////////////////////////////////////////////
require("dotenv").config()

const express = require('express')

const app = express();

app.listen(3001);

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');


aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,

});
const BUCKET = process.env.BUCKET
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
})

app.post('/upload', upload.single('file'), async function (req, res, next) {

    res.send('Successfully uploaded ' + req.file.location + ' location!')

})
app.post('/upload', upload.single('file'), async function (req, res, next) {
    try {
      const newFile = new File({
        filename: req.file.originalname,
        url: req.file.location,
      });
      await newFile.save();
  
      res.send('Successfully uploaded ' + req.file.location + ' location!');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



app.get("/download/:filename", async (req, res) => {
    const filename = req.params.filename
    let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send(x.Body)
})
app.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;
  
    try {
      // Get the file data from S3
      const fileData = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
  
      // Set the appropriate headers for the response
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', fileData.ContentType);
  
      // Send the file data in the response
      res.send(fileData.Body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.delete("/delete/:filename", async (req, res) => {
    const filename = req.params.filename
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send("File Deleted Successfully")

})
app.delete('/delete/:filename', async (req, res) => {
    const filename = req.params.filename;
  
    try {
      // Delete file from S3
      await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  
      // Delete file record from the database
      const deletedFile = await File.findOneAndDelete({ filename });
  
      if (!deletedFile) {
        return res.status(404).send('File not found');
      }
  
      res.send('File Deleted Successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  app.put('/replace/:filename', upload.single('file'), async (req, res) => {
    const oldFilename = req.params.filename;
    const newFilename = req.file.originalname;
  
    try {
      // Delete the old file from S3
      await s3.deleteObject({ Bucket: BUCKET, Key: oldFilename }).promise();
  
      // Update the filename in the database
      const updatedFile = await File.findOneAndUpdate(
        { filename: oldFilename },
        { filename: newFilename },
        { new: true }
      );
  
      if (!updatedFile) {
        return res.status(404).send('File not found');
      }
  
      res.send('File Replaced Successfully');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  




  /// React backup
  import React from 'react';
import moment from 'moment';

const LeadHistory = ({ history }) => {
  const groupHistoryByDate = (history) => {
    const groupedHistory = {};
    history.forEach((entry) => {
      const date = moment(entry.timestamp).format('YYYY-MM-DD');
      if (!groupedHistory[date]) {
        groupedHistory[date] = [];
      }
      groupedHistory[date].push(entry);
    });
    return groupedHistory;
  };

  const renderHistoryByDate = (groupedHistory) => {
    return Object.entries(groupedHistory).map(([date, entries]) => (
      <div key={date}>
        <div className="date-label">{formatDateLabel(date)}</div>
        {entries.map((entry) => (
          <div key={entry._id} className="history-entry">
            <div>
              <strong>{entry.createdby}</strong> - {formatTimestamp(entry.timestamp)}
            </div>
            <div>
              {entry.changes.map((change) => (
                <div key={change._id} className="change">
                  {change.field}: {change.newValue}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const formatDateLabel = (date) => {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

    if (date === today) {
      return 'Today';
    } else if (date === yesterday) {
      return 'Yesterday';
    } else {
      return moment(date).format('MMMM Do');
    }
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format('h:mm A');
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div className="lead-history">
      {renderHistoryByDate(groupedHistory)}
    </div>
  );
};

export default LeadHistory;





