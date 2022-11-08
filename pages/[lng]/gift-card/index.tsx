/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  GiftCard,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
/* styles */
import styleGift from 'public/scss/pages/GiftCard.module.scss'
import styleForm from 'public/scss/components/Form.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'

const classesGiftCard = {
  containerClassName: styleGift.gift_body,
  inputContainerClassName: `${styleForm.form} ${styleGift.gift_form}`,
  note: 'd-none',
  buttonClassName: `${styleButton.btn} ${styleButton.btn_primary}`
}

const GiftCardPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    withFooter: false,
    headerTitle: i18n.t('giftCard.title'),
    SEO: {
      title: i18n.t("giftCard.title")
    }
  }

  return (
    <Layout {...layoutProps}>
      <div className={styleGift.gift_container}>
        <div className={styleGift.gift_header}>
          <Breadcrumb
            steps={[
              { label: i18n.t('breadcrumb.home') },
              {
                label: i18n.t('breadcrumb.giftCard'),
              },
            ]}
          />
        </div>
        <div className={styleGift.gift_info}>{i18n.t("giftCard.info")}</div>
        <GiftCard
          classes={classesGiftCard}
        />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res
}) => {
  const [brand] = await Promise.all([
		useBrand(req),
		useAuthToken({req, res, env: process.env})
	])
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || ''
    }
  }
}

export default GiftCardPage;
