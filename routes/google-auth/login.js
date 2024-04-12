const axios = require('axios');
const fastify = require('fastify')();

module.exports = async function ManualLogin(fastify, opts) {

    fastify.post('/login', async (request, reply) => {
        const { body, headers } = request;
        const apiName = 'LoginWithGoogleAuth'

        try {
          return reply.redirect('/auth/google');
  
    } catch (error) {
            fastify.log.error(`${apiName}-Error executing transaction:`, error);
            throw new Error('Error Login Manual');
        }

    });

    fastify.get('/login/google/callback', async (request, reply) => {
      try {
        const tokenResponse = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    
        const userInfoResponse = await axios.get('https://people.googleapis.com/v1/people/me', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });
         const userData = userInfoResponse.data;
        reply.send('Login with Google successful!',userData);
      } catch (error) {
        console.error('Error fetching user information:', error);
        reply.status(500).send('Error fetching user information');
      }
    });
};



