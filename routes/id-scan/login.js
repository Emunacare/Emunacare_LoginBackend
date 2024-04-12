const { FalseStatusCode, TrueStatusCode } = require("../../global-constant");

module.exports = async function ManualLogin(fastify, opts) {
  fastify.post('/login', async (request, reply) => {
    const { body, headers } = request;
    const apiName = 'LoginwithEmpId'

    try {
      const { email, scannedQRCode,companyName } = body;

      if (!companyName) {
          fastify.log.info(`${apiName} - One more Dependencies Need`);
          reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
      }
       if (!email || !scannedQRCode) {
          fastify.log.info(`${apiName} - One more Dependencies Need`);
          reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
      }
      const userData = await fastify.appdb('users_qr_code')
        .select(['email','serial_number'])
        .where({ email: email })
             .where('company_name', 'like', `%${body.companyName}%`);
      

      const passwordMatch = userData[0].serial_number === scannedQRCode;
      console.log(email,userData, passwordMatch);

      if (!passwordMatch) {
        fastify.log.error(`${apiName}-Invalid Credientials`);
        reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'Invalid Credientials' });
        throw new Error('Invalid Credientials');
      }



      fastify.log.info(`${apiName}-Login Success:`, userData);
      reply.code(TrueStatusCode).send({ message: 'Login Success', user: userData });

    } catch (error) {
      fastify.log.error(`${apiName}-Error executing transaction:`, error);
      throw new Error('Error Login Manual');
    }

    return fastify.log.info(`${apiName}-Login Successfully:`,);
  });
};
