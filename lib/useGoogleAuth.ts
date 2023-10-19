/* library package */
import { IncomingMessage } from 'http'
import { getGoogleAuth } from '@sirclo/nexus'
/* library template */
import { GRAPHQL_URI } from './Constants'

export const useGoogleAuth = async (req: IncomingMessage, token: string) => {
  return await getGoogleAuth(GRAPHQL_URI(req), token)
}