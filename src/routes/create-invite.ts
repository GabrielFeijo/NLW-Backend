import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { dayjs } from '../lib/dayjs';
import { link } from 'fs';
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';
import { ClientError } from '../errors/client-error';

export const createInvite = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/trips/:tripId/invites',
		{
			schema: {
				params: z.object({
					tripId: z.string().uuid(),
				}),
				body: z.object({
					email: z.string().email(),
				}),
			},
		},
		async (request, reply) => {
			const { tripId } = request.params;
			const { email } = request.body;

			const trip = await prisma.trip.findUnique({
				where: {
					id: tripId,
				},
			});

			if (!trip) {
				throw new ClientError('Trip not found');
			}

			const participant = await prisma.participants.create({
				data: {
					email,
					trip_id: tripId,
				},
			});

			const formattedStartDate = dayjs(trip.starts_at).format('LL');
			const formattedEndDate = dayjs(trip.ends_at).format('LL');

			const mail = await getMailClient();

			const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

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

			return reply.status(201).send({ participant: participant.id });
		}
	);
};
