import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';

export const createTrip = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/trips',
		{
			schema: {
				body: z.object({
					destination: z.string().min(4),
					starts_at: z.coerce.date().min(new Date()),
					ends_at: z.coerce.date(),
					owner_name: z.string(),
					owner_email: z.string().email(),
					emails_to_invite: z.array(z.string().email()),
				}),
			},
		},
		async (request, reply) => {
			const {
				destination,
				starts_at,
				ends_at,
				owner_name,
				owner_email,
				emails_to_invite,
			} = request.body;

			if (dayjs(ends_at).isBefore(starts_at)) {
				throw new Error('End date must be after start date');
			}

			const trip = await prisma.trip.create({
				data: {
					destination,
					starts_at,
					ends_at,
					participants: {
						createMany: {
							data: [
								{
									name: owner_name,
									email: owner_email,
									is_owner: true,
									is_confirmed: true,
								},
								...emails_to_invite.map((email) => {
									return {
										email,
									};
								}),
							],
						},
					},
				},
			});

			const mail = await getMailClient();

			const message = await mail.sendMail({
				from: {
					name: 'Equipe plann.er',
					address: 'suporte@plann.er',
				},
				to: {
					name: owner_name,
					address: owner_email,
				},
				subject: 'Sua viagem foi criada',
				html: `<p>Seu destino foi criado com sucesso</p>`,
			});

			console.log(nodemailer.getTestMessageUrl(message));

			return reply.code(201).send({ tripId: trip.id });
		}
	);
};
