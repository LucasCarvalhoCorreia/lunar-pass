import { Pool } from 'pg'
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'

import { Mission, Reservation, Ticket } from './types'

interface Database {
  missions: Mission
  reservations: Reservation
  tickets: Ticket
}

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: 'postgresql://postgres.bcappozhmijfmthipruu:qW5A5x6A643tB413@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
        ssl: {rejectUnauthorized: false,},
    })
})

export const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()]
})

export async function cleanMission(missionId: string) {
  await deleteTickets(missionId)
  await deleteReservation(missionId)
  await deleteMission(missionId)
}

export async function cleanAndInsertMission(missionId: string, mission: Mission) {
  await cleanMission(missionId)
  await insertMission(mission)
}

export async function insertMission(mission: Mission) {
  await db
    .insertInto('missions')
    .values(mission)
    .execute()
}

export async function deleteMission(id: string) {
  await db
    .deleteFrom('missions')
    .where('id', '=', id)
    .execute()
}

export async function deleteReservation(mission_id: string) {
  await db
    .deleteFrom('reservations')
    .where('missionId', '=', mission_id)
    .execute()
}

export async function deleteTickets(mission_id: string) {
  await db
    .deleteFrom('tickets')
    .where('missionId', '=', mission_id)
    .execute()
}

export async function insertReservation(reservation: Reservation) {
  await db
    .insertInto('reservations')
    .values(reservation)
    .execute()
}

export async function insertTickets(tickets: Ticket[]) {
  await db
    .insertInto('tickets')
    .values(tickets)
    .execute()
}

export async function cleanReservationAndTickets(missionId: string) {
  await deleteTickets(missionId)
  await deleteReservation(missionId)
}

export async function cleanAndInsertSoldOutMission(missionId: string) {
  await cleanReservationAndTickets(missionId)
  const reservationId = 'c189241c-728b-404c-9562-a5dc699f8a44'
  await insertReservation({
    id: reservationId,
    userId: null,
    missionId,
    reservationCode: '75BD64',
    contactEmail: 'lucas.carvalho5398@gmail.com',
    totalPrice: '4000.00',
    status: 'confirmed'
  })
  await insertTickets([
    { id: '088fc041-27ac-473f-ad63-47c1c3a2660c', reservationId, missionId, seat: 'A1', fullName: 'Lucas Correia', document: 'XP12345' },
    { id: 'de421718-e2aa-4312-b3b2-25a130f9783c', reservationId, missionId, seat: 'A2', fullName: 'Jonas Silva', document: 'XP1556' },
    { id: 'cb041103-80a0-4cf9-b62a-d040deb9aed1', reservationId, missionId, seat: 'B1', fullName: 'Carla Lima', document: 'XP151565' },
    { id: '7f815efa-4626-4bd6-8f8f-d499847604a6', reservationId, missionId, seat: 'B2', fullName: 'Vitor Viana', document: 'XP8491' }
  ])
}