var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws_config.json');
const rekognition = new AWS.Rekognition();

module.exports = function imageRequest(blob, cb) {
   var params = {
      "Attributes": [ "ALL" ],
      "Image": { 
         "Bytes": blob
      }
   }

   rekognition.detectFaces(params, function(err, data) {
      if (err) {
         console.error(err, err.stack);
      } else {
         cb(data); 
      }         
   });
}

  /*
{
   "FaceDetails": [ 
      { 
         "AgeRange": { 
            "High": number,
            "Low": number
         },
         "Beard": { 
            "Confidence": number,
            "Value": boolean
         },
         "BoundingBox": { 
            "Height": number,
            "Left": number,
            "Top": number,
            "Width": number
         },
         "Confidence": number,
         "Emotions": [ 
            { 
               "Confidence": number,
               "Type": "string"
            }
         ],
         "Eyeglasses": { 
            "Confidence": number,
            "Value": boolean
         },
         "EyesOpen": { 
            "Confidence": number,
            "Value": boolean
         },
         "Gender": { 
            "Confidence": number,
            "Value": "string"
         },
         "Landmarks": [ 
            { 
               "Type": "string",
               "X": number,
               "Y": number
            }
         ],
         "MouthOpen": { 
            "Confidence": number,
            "Value": boolean
         },
         "Mustache": { 
            "Confidence": number,
            "Value": boolean
         },
         "Pose": { 
            "Pitch": number,
            "Roll": number,
            "Yaw": number
         },
         "Quality": { 
            "Brightness": number,
            "Sharpness": number
         },
         "Smile": { 
            "Confidence": number,
            "Value": boolean
         },
         "Sunglasses": { 
            "Confidence": number,
            "Value": boolean
         }
      }
   ],
   "OrientationCorrection": "string"
}

  */