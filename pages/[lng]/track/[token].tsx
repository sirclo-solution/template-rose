/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  ShipmentTracker,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
/* style */
import styleShipmentTracking from 'public/scss/components/shipmentTracking.module.scss'

const classesTrackerPage = {
  shipmentTrackingClassName: styleShipmentTracking.shipmentTracking,
  shipmentHeaderClassName: styleShipmentTracking.shipmentTracking_header,
  shipmentHeaderTextClassName: styleShipmentTracking.shipmentTracking_title,
  shipmentTextClassName: styleShipmentTracking.shipmentTracking_subTitle,
  shipmentCloseIconClassName: styleShipmentTracking.shipmentTracking_close,
  shipmentBodyClassName: styleShipmentTracking.shipmentTracking_body,
  shipmentListWrapperClassName: styleShipmentTracking.shipmentTracking_list,
  shipmentListClassName: styleShipmentTracking.shipmentTracking_item,
  shipmentStatusClassName: styleShipmentTracking.shipmentTracking_item_description,
  shipmentDateClassName: styleShipmentTracking.shipmentTracking_item_date,
  shipmentNoteClassName: styleShipmentTracking.shipmentTracking_item_note,
  shipmentFooterClassName: styleShipmentTracking.shipmentTracking_footer,
}

const TrackerPage: FC<any> = ({
  lng,
  lngDict,
  brand,
  order_token
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    SEO: {
      title: i18n.t("shipping.track")
    }
  }

  return (
    <Layout {...layoutProps}>
      <ShipmentTracker
        token={order_token}
        iconTracker={<img className="mr-2" src={'/icons/motorcycle.svg'} alt="motorcycle" />}
        classes={classesTrackerPage}
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const tokenData = await useAuthToken({ req, res, env: process.env });
  const token = tokenData.value;
  const brand = await useBrand(req, token);
  
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || "",
      order_token: params.token
    },
  }
}

export default TrackerPage
