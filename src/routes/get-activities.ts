import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const getLinks = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/trips/:tripId/links',
		{
			schema: {
				params: z.object({
					tripId: z.string().uuid(),
				}),
			},
		},
		async (request, reply) => {
			const { tripId } = request.params;

			const trip = await prisma.trip.findUnique({
				where: {
					id: tripId,
				},
				include: {
					links: true,
				},
			});

			if (!trip) {
				throw new Error('Trip not found');
			}

			return reply.status(200).send({ links: trip.links });
		}
	);
};
