import fastify from 'fastify';
import cors from '@fastify/cors';
import { createTrip } from './routes/create-trip';
import {
	validatorCompiler,
	serializerCompiler,
} from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/confirm-trip';
import { confirmParticipant } from './routes/confirm-participant';
import { createActivity } from './routes/create-activity';
import { getActivities } from './routes/get-activities';
import { createLink } from './routes/create-link';
import { getLinks } from './routes/get-links';
import { getParticipants } from './routes/get-participants';
import { createInvite } from './routes/create-invite';
import { updateTrip } from './routes/update-trip';
import { getTripDetails } from './routes/get-trip-details';
import { getParticipant } from './routes/get-participant';
import { errorHandler } from './error-handler';
import { env } from './env';
import { updateParticipant } from './routes/update-participant';

const app = fastify();

app.register(cors, {
	origin: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(updateTrip);
app.register(getTripDetails);

app.register(confirmParticipant);
app.register(updateParticipant);
app.register(getParticipants);
app.register(getParticipant);

app.register(createActivity);
app.register(getActivities);

app.register(createLink);
app.register(getLinks);

app.register(createInvite);

app.listen({ host: '0.0.0.0', port: env.PORT }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
