import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ClientError } from '../errors/client-error';

export const updateParticipant = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().put(
		'/participants/:participantId/confirm',
		{
			schema: {
				params: z.object({
					participantId: z.string().uuid(),
				}),
				body: z.object({
					name: z.string(),
					email: z.string().email(),
				}),
			},
		},
		async (request, reply) => {
			const { participantId } = request.params;
			const { name, email } = request.body;

			const participant = await prisma.participants.findUnique({
				where: {
					id: participantId,
				},
			});

			if (!participant) {
				throw new ClientError('Participant not found');
			}

			const updateParticipant = await prisma.participants.update({
				where: {
					id: participantId,
				},
				data: {
					name,
					email,
					is_confirmed: true,
				},
			});

			return reply.code(200).send({ participant: updateParticipant });
		}
	);
};
