import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import nodemailer from 'nodemailer';

import { getMailClient } from '../lib/mail';
import { dayjs } from '../lib/dayjs';
import { ClientError } from '../errors/client-error';
import { env } from '../env';

export const confirmTrip = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/trips/:tripId/confirm',
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
					participants: {
						where: {
							is_owner: false,
						},
					},
				},
			});

			if (!trip) {
				throw new ClientError('Trip not found');
			}

			if (trip.is_confirmed) {
				return reply.redirect(`${env.FRONTEND_BASE_URL}/trips/${tripId}`);
			}

			await prisma.trip.update({
				where: {
					id: tripId,
				},
				data: {
					is_confirmed: true,
				},
			});

			const formattedStartDate = dayjs(trip.starts_at).format('LL');
			const formattedEndDate = dayjs(trip.ends_at).format('LL');

			const mail = await getMailClient();

			await Promise.all(
				trip.participants.map(async (participant) => {
					const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

					const message = await mail.sendMail({
						from: {
							name: 'Equipe plann.er',
							address: 'suporte@plann.er',
						},
						to: participant.email,
						subject: `Confirme sua presença para ${trip.destination} em ${formattedStartDate}`,
						html: `<div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">                              
                                    <p>
                                        Você foi convidado(a) para participar de uma viagem para 
                                        <strong>${trip.destination}</strong> nas datas de
                                        <strong>${formattedStartDate} a ${formattedEndDate}</strong>.
                                    </p>
                                    <p/>                                  
                                    <p>Para confirmar sua viagem, clique no link abaixo:</p>
                                    <p/>
                                    <p><a href="${confirmationLink}">Confirmar viagem</a></p>
                                    <p/>
                                    <p>
                                        Caso esteja usando o dispositivo móvel, você também pode confirmar a criação
                                        da viagem pelos aplicativos:
                                    </p>
                                    <p/>
                                    <ul>
                                        <li><a href="#">Aplicativo para iPhone</a></li>
                                        <li><a href="#">Aplicativo para Android</a></li>
                                    </ul>								
                                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore-o.</p>
                                </div>`.trim(),
					});

					console.log(nodemailer.getTestMessageUrl(message));
				})
			);

			return reply.redirect(`${env.FRONTEND_BASE_URL}/trips/${tripId}`);
		}
	);
};
