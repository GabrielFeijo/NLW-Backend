import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';

export const createTrip = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/trips',
		{
			schema: {
				body: z.object({
					destination: z.string().min(4),
					starts_at: z.coerce.date().min(new Date()),
					ends_at: z.coerce.date(),
				}),
			},
		},
		async (request, reply) => {
			const { destination, starts_at, ends_at } = request.body;

			if (dayjs(ends_at).isBefore(starts_at)) {
				throw new Error('End date must be after start date');
			}

			const trip = await prisma.trip.create({
				data: {
					destination,
					starts_at,
					ends_at,
				},
			});

			return reply.code(201).send({ tripId: trip.id });
		}
	);
};
