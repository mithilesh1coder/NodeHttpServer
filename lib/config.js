var environments = {};

environments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging',
    'hashingSecret':'thisIsMySecret'
}


environments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production',
    'hashingSecret':'thisIsMySecret'
}

currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

exportEnvironment = typeof(environments[currentEnviroment]) == 'object' ? environments[currentEnviroment] : environments.staging;

module.exports = exportEnvironment;
