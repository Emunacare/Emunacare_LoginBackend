
module.exports = async function ManualLogin(fastify, opts) {
    fastify.post('/signup', async (request, reply) => {
        const { body, headers } = request;
        const apiName = 'SignupwithId'

        try {
  
              fastify.log.info(`${apiName}-Login Successful:`, userData);
              reply.code(200).send({ message: 'Login Successful', user: userData });
  
    } catch (error) {
            fastify.log.error(`${apiName}-Error executing transaction:`, error);
            throw new Error('Error Login Manual');
        }

        return fastify.log.info(`${apiName}-Login Successfully:`,);
    });
};
