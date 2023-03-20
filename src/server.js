const Hapi = require('@hapi/hapi');
const router = require('./routers');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: '0.0.0.0',
    });

    await server.start();
    server.route(router);
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
