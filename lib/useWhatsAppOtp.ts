import { IncomingMessage } from 'http'
import { getWhatsAppOTPSetting } from '@sirclo/nexus'
import { GRAPHQL_URI } from './Constants'

export const useWhatsAppOTPSetting = async (req: IncomingMessage, token: string) => {
  return await getWhatsAppOTPSetting(GRAPHQL_URI(req), token)
}