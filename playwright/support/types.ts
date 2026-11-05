export interface Mission {
  id: string
  rocket: string
  baseId: string
  departureDate: string
  returnDate: string
  price: number
}

export interface Reservation {
  id?: string
  userId?: string | null
  missionId: string
  reservationCode?: string
  contactEmail?: string
  totalPrice?: string | number
  status?: string
  createdAt?: string
}

export interface Ticket {
  id?: string
  reservationId?: string
  missionId: string
  seat?: string
  fullName?: string
  document?: string
}