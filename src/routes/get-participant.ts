import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ClientError } from '../errors/client-error';

export const getParticipant = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/participants/:participantId',
		{
			schema: {
				params: z.object({
					participantId: z.string().uuid(),
				}),
			},
		},
		async (request, reply) => {
			const { participantId } = request.params;

			const participant = await prisma.participants.findUnique({
				select: {
					id: true,
					name: true,
					email: true,
					is_confirmed: true,
				},
				where: {
					id: participantId,
				},
			});

			if (!participant) {
				throw new ClientError('Trip not found');
			}

			return reply.status(200).send({ participant });
		}
	);
};
