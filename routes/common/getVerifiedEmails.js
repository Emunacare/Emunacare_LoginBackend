const { FalseStatusCode, TrueStatusCode } = require("../../global-constant.js");

module.exports = async function GetVerifiedEmails(fastify, opts) {
    fastify.get('/get-verified-emails', async (request, reply) => {
        const { query, headers } = request;
        const apiName = 'LoginWithGoogleAuth'
        
        try {

      if (!query.companyName) {
          fastify.log.info(`${apiName} - One more Dependencies Need`);
          reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
        }
        
       const userData = await fastify.appdb('users')
            .select('email')
            .where('company_name', 'like', `%${query.companyName}%`);

        const emails = userData.map(entry => entry.email);
        fastify.log.info(`${apiName}-get Emails :`, userData);
        
        console.log(emails,userData);
        
      fastify.log.info(`${apiName}-get Emails :`, userData);
      reply.code(TrueStatusCode).send({ message: 'get Emails ', emails: emails });

    } catch (error) {
      fastify.log.error(`${apiName}-Error executing transaction:`, error);
      throw new Error('Error Login Manual');
    }

        return fastify.log.info(`${apiName}-get Emails successfully:`,);
        
    })
  
};