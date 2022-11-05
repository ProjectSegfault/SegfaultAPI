import Fastify from 'fastify'
import fastifyStatic from '@fastify/static';
import formBodyPlugin from '@fastify/formbody';
import fastifySensible from '@fastify/sensible';
import config from "../config.json";
import statusApi from "./api/status";
import announcementsApi from "./api/announcements";
import formApi from "./api/form";
import validateConfig from "./utils/validateConfig";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const fastify = Fastify({
    logger: true
})

fastify.register(formBodyPlugin)

fastify.register(fastifyStatic, {
    root: __dirname
})

fastify.register(fastifySensible)

fastify.get("/", (request, reply) => {
	reply.sendFile("index.html");
});

fastify.get("/global.css", (request, reply) => {
	reply.sendFile("global.css");
});

announcementsApi(fastify);
formApi(fastify);
statusApi(fastify);

fastify.listen({ port: config.port }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    validateConfig();
	console.log(`[SegfaultAPI] listening on ${address}`)
  })