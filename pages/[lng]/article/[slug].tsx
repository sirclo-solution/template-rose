/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { 
  Article, 
  ArticleCategories, 
  getArticle,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { GRAPHQL_URI } from 'lib/Constants'
import { useBrand } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
/* styles */
import styleArticle from 'public/scss/pages/Article.module.scss'
import stylePlaceholder from 'public/scss/pages/Article.module.scss'

const classesPlaceholderArticle = {
  placeholderImage: `${stylePlaceholder.placeholderItem} ${stylePlaceholder.placeholderItem_article}`,
}

const classesArticleCategories = {
  articleCategoriesContainerClass: styleArticle.article_categories,
  categoryTitleClass: 'd-none',
  articleCategoriesUlClass: styleArticle.article_categoriesOrder,
  articleCategoriesLiClass: styleArticle.article_categoriesOrder_list,
}

const ArticleDetail: FC<any> = ({
  lng,
  lngDict,
  slug,
  data,
  brand,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()

  const [title, setTitle] = useState<string>('')

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: title,
    SEO: {
      title: data?.descriptions[0]?.title,
      description: data?.SEOs[0]?.description,
      keywords: data?.SEOs[0]?.keywords?.join(", ") 
    }
  }

  return (
    <Layout {...layoutProps}>
      <div className={styleArticle.article_container}>
        <div className={styleArticle.article_header}>
          <Breadcrumb steps={[{ label: i18n.t('breadcrumb.home') }, { label: title }]} />
        </div>
        <Article
          containerClassName={styleArticle.article}
          slug={slug as string}
          getTitle={setTitle}
          loadingComponent={<Placeholder classes={classesPlaceholderArticle} withImage />}
        />
        <ArticleCategories classes={classesArticleCategories} />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const slug = params.slug
  const [
    brand,
    data
  ] = await Promise.all([
    useBrand(req),
    getArticle(GRAPHQL_URI(req), slug.toString()),
    useAuthToken({req, res, env: process.env})
  ])
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      slug,
      data,
      brand: brand || ''
    }
  }
}

export default ArticleDetail
