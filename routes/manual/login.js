const { FalseStatusCode, TrueStatusCode } = require("../../global-constant");

module.exports = async function ManualLogin(fastify, opts) {
    fastify.post('/login', async (request, reply) => {
        const { body, headers } = request;
        const apiName = 'LoginWithManual'

        try {

            if (!body.email || !body.password || !body.companyName) {
                fastify.log.info(`${apiName} - One more Dependencies Need`);
                reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode, message: 'One more Dependencies Need' });
            }
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[a-zA-Z\d!@#$%^&*()-_+=]{8,}$/;

            if (!passwordRegex.test(body.password)) {
                fastify.log.info(`${apiName} - Password does not meet requirements`);
                reply.code(FalseStatusCode).send({  statusCode: FalseStatusCode,message: 'Password does not meet requirements' });
            }

            const userData = await fastify.appdb('users')
                .select(['email', 'password'])
                .where({ email: body.email })
                .where('company_name', 'like', `%${body.companyName}%`);
            console.log(userData);
            const findUserData = userData ? userData[0] : {};
            if (!findUserData) {
                throw new Error('Invalid credentials');
            }
            console.log(findUserData.password)
            const decryptedPassword = await fastify.lib.decrypt(findUserData.password);
            const passwordMatch = decryptedPassword === body.password;
            console.log(userData, passwordMatch, decryptedPassword);

            if (!passwordMatch) {
                reply.code(FalseStatusCode).send({ statusCode: FalseStatusCode,message: ' Invalid credientials'});
                throw new Error('Invalid Credientials');
            }
            const token = await fastify.lib.getToken(body.companyName, findUserData);
            fastify.log.info(`${apiName}-Login Successful:`, findUserData);
            reply.code(TrueStatusCode).send({ message: 'Login Success', user: findUserData, webToken : token });
            return fastify.log.info(`${apiName}-Login Successfully:`,);

        } catch (error) {
            fastify.log.error(`${apiName}-Error executing transaction:`, error);
            throw new Error('Error Login Manual');
        }
    });
};
