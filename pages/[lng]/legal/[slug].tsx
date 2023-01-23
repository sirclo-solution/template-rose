/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import {
  Legal,
  LegalCategories,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'

/* library template */
import { useBrand } from 'lib/useBrand'

/* components */
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Layout from 'components/Layout/Layout'
import LoaderPages from 'components/Loader/LoaderPages'
import SEO from 'components/SEO'

/* styles */
import styles from 'public/scss/pages/Legal.module.scss'

type TDataLegal = {
  title: string
  lastUpdate: string
}

const classesLegal = {
  containerClassName: styles.legal_container
}

const classesLegalCategories = {
  legalCategoriesContainerClassName: styles.legal_categoriesContainer,
  legalCategoriesListClassName: styles.legal_categoriesList,
  legalCategoriesItemClassName: styles.legal_categoriesItem,
  legalCategoriesItemActiveClassName: styles.legal_categoriesItemActive
}

const LegalPage: FC<any> = ({
  lng,
  lngDict,
  slug,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router: any = useRouter()
  const [data, setData] = useState<TDataLegal>()

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: data?.title,
    layoutClassName: "layout_fullHeight",
    withCopyright: true,
    SEO: { title: data?.title },
  }

  return (
    <Layout {...layoutProps}>
      <SEO title={data?.title} />
      <div className={styles.legal_root}>
        <Breadcrumb
          steps={[{ label: i18n.t('breadcrumb.home') }, { label: data?.title }]}
        />
        <Legal
          classes={classesLegal}
          legalKey={slug.toString()}
          getData={(data: TDataLegal) => setData(data)}
          loadingComponent={
            <div className="text-center">
              <LoaderPages/>
            </div>
          }
        />
        <LegalCategories
          i18n={i18n}
          router={router}
          classes={classesLegalCategories}
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
  const { slug } = params

  return {
    props: {
      brand: brand || "",
      lng: defaultLanguage,
      lngDict,
      slug
    },
  }
}

export default LegalPage
