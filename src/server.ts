import fastify from 'fastify';
import cors from '@fastify/cors';
import { createTrip } from './routes/create-trip';
import {
	validatorCompiler,
	serializerCompiler,
} from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/confirm-trip';

const app = fastify();

app.register(cors, {
	origin: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
