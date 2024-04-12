const { FalseStatusCode, TrueStatusCode } = require("../../global-constant.js");

module.exports = async function DecryptFunction(fastify, opts) {
  
    fastify.get('/decrypt', async (request, reply) => {
          const { query, headers } = request;
          const apiName = 'LoginWithGoogleAuth'
          
          try {
            const { key, webToken } = query;
        if (!key || !webToken) {
            fastify.log.info(`${apiName} - One more Dependencies Need`);
            reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
          }
          
            const userData = await fastify.lib.retreiveToken(key, webToken);
            if (!userData) {
              reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode,message: ' Invalid Token or Token Has Been Expired'});
              throw new Error('Invalid Credientials');
            }
          
        fastify.log.info(`${apiName}- Retrived data Success :`, userData);
        reply.code(TrueStatusCode).send({ message: 'Retrived data Success', userData: userData });

      } catch (error) {
        fastify.log.error(`${apiName}-Error executing transaction:`, error);
        throw new Error('Error Login Manual');
      }

          return fastify.log.info(`${apiName}-get Emails successfully:`,);
          
    })
};