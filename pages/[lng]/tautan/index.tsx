import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  Links,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
import Layout from 'components/Layout/Layout'
import { useBrand } from 'lib/useBrand'
import styles from 'public/scss/pages/Tautan.module.scss'

const classesLinks = {
  containerClassName: styles.tautan,
  logoImage: styles.tautan_logo,
  titleClassName: styles.tautan_title,
  description: styles.tautan_description,
  linksSection: styles.tautan_linkSection,
  labelText: styles.tautan_labelText,
  labelImage: styles.tautan_labelImage,
}

const TautanPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    SEO: {
      title: i18n.t("global.links")
    },
    withHeader: false,
    withFooter: false,
    layoutClassName: 'layout_fullHeight'
  }

  return (
    <Layout {...layoutProps}>
      <Links classes={classesLinks} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
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

export default TautanPage;