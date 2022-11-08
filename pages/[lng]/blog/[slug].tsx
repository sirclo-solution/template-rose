/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { IoArrowBackOutline, IoHelpCircle } from 'react-icons/io5'
import {
  BlogRecent,
  BlogSingle,
  getBlogSingle,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
import { GRAPHQL_URI } from 'lib/Constants'
/* components */
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import SocialShare from 'components/SocialShare'
/* styles */
import styleBlog from 'public/scss/pages/Blog.module.scss'

const classesBlogSingle = {
  blogContainerClassName: styleBlog.blog_detail,
  headerClassName: styleBlog.blog_detail_header,
  headerContentClassName: styleBlog.blog_detail_title,
  headerEndClassName: 'd-none',
  authorPicContainerClassName: 'd-none',
  authorPicClassName: 'd-none',
  authorInfoClassName: 'd-none',
  createdByInnerClassName: styleBlog.blog_detail_desc,
  blogContentClassName: styleBlog.blog_detail_content,
}

const classesBlogRecent = {
  containerClassName: styleBlog.blog_items,
  blogRecentClassName: styleBlog.blog_item,
  imageClassName: styleBlog.blog_item_imageContainer,
  labelContainerClassName: 'm-0',
  titleClassName: styleBlog.blog_item_title,
  dateClassName: styleBlog.blog_item_innerFooter,
}

const BlogSlug: FC<any> = ({
  data,
  lng,
  lngDict,
  slug,
  brand,
  urlSite,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const [title, setTitle] = useState<string>('')

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: i18n.t('blog.title'),
    withCopyright: true,
    SEO: {
      title: data?.descriptions[0]?.title,
      description: data?.descriptions[0]?.content,
      keywords: data?.seos[0]?.keywords?.join(", "),
      image: data?.thumbnailImage
    }
  }

  return (
    <Layout {...layoutProps}>
      <div className={styleBlog.blog_container}>
        <div className={styleBlog.blog_header}>
          <Breadcrumb
            steps={[
              { label: i18n.t('breadcrumb.home') },
              {
                label: i18n.t('breadcrumb.blog'),
                linkProps: {
                  href: '/[lng]/blog',
                  as: `/${lng}/blog`,
                },
              },
              { label: title },
            ]}
          />
        </div>
        <BlogSingle
          getTitle={setTitle}
          classes={classesBlogSingle}
          ID={slug.toString()}
          timeIcon={','}
          authorIcon={i18n.t('blog.by')}
          loadingComponent={
            <div className="w-100 text-center">
              <span className="spinner-border" />
            </div>
          }
          emptyStateComponent={
            <BlogEmpty i18n={i18n} lng={lng} />
          }
          errorComponent={
            <BlogEmpty i18n={i18n} lng={lng} />
          }
        />
        <div className={styleBlog.blog_shareContainer}>
          <div>
            {data &&
              <SocialShare
                urlSite={urlSite}
                title={i18n.t("article.share")}
              />
            }
          </div>
        </div>
        <div className={styleBlog.blog_recent}>
          <div className={styleBlog.blog_recent_title}>{i18n.t('blog.recentPost')}</div>

          <BlogRecent
            classes={classesBlogRecent}
            limit={5}
            linkPrefix="blog"
            thumborSetting={{
              width: 100,
              format: 'webp',
              quality: 85,
            }}
            loadingComponent={
              <div className="w-100 text-center">
                <span className="spinner-border" />
              </div>
            }
          />
          <div className={styleBlog.blog_footer}>
            <Link href="/[lng]/blog" as={`/${lng}/blog`}>
              <a>
                <IoArrowBackOutline color="#998060" size={12} />
                <span>{i18n.t('blog.back')}</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const BlogEmpty = ({ i18n, lng }) => {
  return (
    <div className={styleBlog.blog_empty}>
      <EmptyComponent
        title={i18n.t("blog.isEmpty")}
        icon={<IoHelpCircle color="#BCBCBC" size={15} />}
        button={
          <Link href="/[lng]/blog" as={`/${lng}/blog`}>
            <a title={i18n.t("blog.back")}>
              {i18n.t("blog.back")}
            </a>
          </Link>
        }
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res
}) => {
  const { slug } = params
  const [
    brand,
    data
  ] = await Promise.all([
    useBrand(req),
    getBlogSingle(GRAPHQL_URI(req), slug.toString()),
    useAuthToken({req, res, env: process.env})
  ])
  const urlSite = `https://${req.headers.host}/${params.lng}/blog/${slug}`
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      slug,
      brand: brand || '',
      urlSite,
      data
    },
  }
}

export default BlogSlug
