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
        connectionString: 'postgresql://postgres:iOAbXN9I3hl1x3WW@db.bcappozhmijfmthipruu.supabase.co:5432/postgres',
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