const { FalseStatusCode, TrueStatusCode } = require("../../global-constant.js");

module.exports = async function GetDetails(fastify, opts) {
    // fastify.get('/get-verified-emails', async (request, reply) => {
    //     const { query, headers } = request;
    //     const apiName = 'LoginWithGoogleAuth'
        
    //     try {

    //   if (!query.companyName) {
    //       fastify.log.info(`${apiName} - One more Dependencies Need`);
    //       reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
    //     }
        
    //    const userData = await fastify.appdb('users')
    //         .select('email')
    //         .where('company_name', 'like', `%${query.companyName}%`);

    //     const emails = userData.map(entry => entry.email);
    //     fastify.log.info(`${apiName}-get Emails :`, userData);
        
    //     console.log(emails,userData);
        
    //   fastify.log.info(`${apiName}-get Emails :`, userData);
    //   reply.code(TrueStatusCode).send({ message: 'get Emails ', emails: emails });

    // } catch (error) {
    //   fastify.log.error(`${apiName}-Error executing transaction:`, error);
    //   throw new Error('Error Login Manual');
    // }

    //     return fastify.log.info(`${apiName}-get Emails successfully:`,);
        
    // })
  
    fastify.get('/get-details', async (request, reply) => {
          const { query, headers } = request;
          const apiName = 'LoginWithGoogleAuth'
          
          try {
              const { email, companyName } = query;
                if (!email || !companyName) {
            fastify.log.info(`${apiName} - One more Dependencies Need`);
            reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
          }
          
            const userData = await fastify.appdb('users')
            .select('*')
            .where({ email: email })
              .where('company_name', 'like', `%${companyName}%`)
              .first();
            if (!userData) {
              reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode,message: ' Invalid Token or Token Has Been Expired'});
              throw new Error('Invalid Credientials');
            }
          // console.log(userData);
          
        fastify.log.info(`${apiName}- Retrived data Success :`, userData);
        reply.code(TrueStatusCode).send({ message: 'Retrived data Success', userData: userData });

      } catch (error) {
        fastify.log.error(`${apiName}-Error executing transaction:`, error);
        throw new Error('Error Login Manual');
      }

          return fastify.log.info(`${apiName}-get Emails successfully:`,);
          
    })
  
  
};