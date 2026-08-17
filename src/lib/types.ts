export interface Metadata {
  id: string,
  title: string,
  name: string,
  description: string,
  image: string,
  url: string
}

export interface Episode extends Metadata {
  createdAt?: Date,
  episode: number,
  season: number
}