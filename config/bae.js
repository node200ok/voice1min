
module.exports = {
	env: 'production',
	port: process.env.APP_PORT,
	wxValidPost: false,
	mongo: {
		dbname: 'VFgPXdVZHJqTcmyLMtHO',
		host: process.env.BAE_ENV_ADDR_MONGO_IP,
		port: process.env.BAE_ENV_ADDR_MONGO_PORT * 1,  // to number
		username: process.env.BAE_ENV_AK,
		password: process.env.BAE_ENV_SK
	}
}
