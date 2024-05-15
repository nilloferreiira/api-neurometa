import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: number,
      name: string,
      approved: boolean,
      age: number
      } 
  }
}
