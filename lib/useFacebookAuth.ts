/* library package */
import { IncomingMessage } from 'http'
import { getFacebookAuth } from '@sirclo/nexus'
/* library template */
import { GRAPHQL_URI } from './Constants'

export const useFacebookAuth = async (req: IncomingMessage, token: string) => {
  return await getFacebookAuth(GRAPHQL_URI(req), token)
}