const config = {
    accessKey: process.env.RAPYD_ACCESS_KEY || 'rak_7E974450DAFC4DC85A71',
    secretKey: process.env.RAPYD_SECRET_KEY || 'rsk_ac9ce466b1b678157b820f6de3869319c0f2faadfee67e8c1d93cae24a23072f79e5bbd4b9d66e8c',
    baseRapydApiUrl: process.env.BASERAPYDAPIURL || 'https://sandboxapi.rapyd.net',
    port: parseInt(process.env.PORT) || 5000,
};

export default config;