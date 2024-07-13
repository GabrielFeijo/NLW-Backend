import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { dayjs } from '../lib/dayjs';
import { ClientError } from '../errors/client-error';

export const updateTrip = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().put(
		'/trips/:tripId',
		{
			schema: {
				params: z.object({
					tripId: z.string().uuid(),
				}),
				body: z.object({
					destination: z.string().min(4),
					starts_at: z.coerce.date().min(new Date()),
					ends_at: z.coerce.date(),
				}),
			},
		},
		async (request, reply) => {
			const { tripId } = request.params;
			const { destination, starts_at, ends_at } = request.body;

			const trip = await prisma.trip.findUnique({
				where: {
					id: tripId,
				},
			});

			if (!trip) {
				throw new ClientError('Trip not found');
			}

			if (dayjs(ends_at).isBefore(starts_at)) {
				throw new ClientError('End date must be after start date');
			}

			const updateTrip = await prisma.trip.update({
				where: {
					id: tripId,
				},
				data: {
					destination,
					starts_at,
					ends_at,
				},
			});

			return reply.code(200).send({ trip: updateTrip });
		}
	);
};
