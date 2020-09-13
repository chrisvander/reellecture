const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Used when generating any kind of Access Token
const twilioAccountSid = 'ACa8719cc13aa166a2dcebbbf171a9e4aa';
const twilioApiKey = 'SKcd3982a9177931866426b7be0d267d64';
const twilioApiSecret = 'nZSRZwFfoLl5agaKQUeUuhze8KXntf4z';

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);


// Serialize the token to a JWT string
module.exports = (identity, id) => {
  token.identity = identity;

  // Create a Video grant which enables a client to use Video 
  // and limits access to the specified Room 
  const videoGrant = new VideoGrant({
    room: id
  });

  // Add the grant to the token
  token.addGrant(videoGrant);
  return token.toJwt();
}