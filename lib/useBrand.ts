/* library package */
import { IncomingMessage } from 'http'
import { getBrand } from '@sirclo/nexus'
/* library template */
import { GRAPHQL_URI } from './Constants'

export const useBrand = async (req: IncomingMessage, token: string) => {
  try {
    return await getBrand(GRAPHQL_URI(req), token)
  } catch (e) {
    console.log('Error while request brand: ', e)
  }
}