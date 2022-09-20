/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  Legal,
  LegalCategories,
  useI18n
} from '@sirclo/nexus'
import { useRouter } from 'next/router'

/* library template */
import { useBrand } from 'lib/useBrand'

/* components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
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
  req
}) => {
  const brand = await useBrand(req)
  const { slug } = params

  return {
    props: {
      ...brand,
      slug,
    },
  }
}

export default LegalPage
