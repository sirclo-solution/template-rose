/* library package */
import { FC, useState } from 'react'
import {
  GetServerSideProps,
  InferGetServerSidePropsType
} from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  IoArrowBackOutline,
  IoHelpCircle
} from 'react-icons/io5'
import {
  isLookbookAllowed,
  LookbookSingle,
  getLookbookSingle,
  useAuthToken,
  useI18n,
  Products
} from '@sirclo/nexus'
import { RiQuestionFill } from 'react-icons/ri'
/* library template */
import { GRAPHQL_URI } from 'lib/Constants'
import { useBrand } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'
import useQuery from 'lib/useQuery'
/* components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
import Loader from 'components/Loader/Loader'
import SocialShare from 'components/SocialShare'
/* styles */
import styleLookbook from 'public/scss/pages/Lookbook.module.scss'
import stylePlaceHolder from 'public/scss/components/Placeholder.module.scss'
import styleProduct from 'public/scss/components/Product.module.scss'

const classesLookbookSingle = {
  containerClassName: `w-100`,
  rowClassName: styleLookbook.lookbook_detail,
  imageClassName: 'd-none',
  thumbnailImageClassName: styleLookbook.lookbook_detail_img,
}

const classesProducts = {
  productContainerClassName: `col-6 product_list ${styleProduct.product_itemContainer}`,
  stickerContainerClassName: `${styleProduct.product_sticker} ${styleProduct.product_stickerGrid}`,
  outOfStockLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__outofstock}`,
  saleLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__sale}`,
  comingSoonLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__comingsoon}`,
  openOrderLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__openorder}`,
  preOrderLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__preorder}`,
  newLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__new}`,
  productImageContainerClassName: styleProduct.product_link,
  productImageClassName: styleProduct.product_itemContainerImage,
  productLabelContainerClassName: styleProduct.product_label,
  productTitleClassName: styleProduct.product_label__title,
  productPriceClassName: styleProduct.product_labelPrice,
  salePriceClassName: styleProduct.product_labelPrice__sale,
  priceClassName: styleProduct.product_labelPrice__price,
}

const LookbookSinglePage: FC<any> = ({
  lng,
  lngDict,
  slug,
  data,
  brand,
  urlSite,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router = useRouter()
  const size = useWindowSize()
  const LookbookAllowed = isLookbookAllowed()

  const [title, setTitle] = useState<string>('')

  const categories: string = useQuery('categories')
  const tagname: string | string[] = router.query.tagname || null

  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    itemPerPage: 4,
    totalItems: 0,
    curPage: 0,
  })

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    withAllowed: LookbookAllowed,
    withCopyright: true,
    headerTitle: i18n.t('lookbook.title'),
    SEO: { 
      title: data?.name,
      description: data?.SEOs[0]?.description,
      keywords: data?.SEOs[0]?.keywords?.join(", "),
      image: data?.imageURL
    }
  }

  return (
    <Layout {...layoutProps}>
      <div className={styleLookbook.lookbook_container}>
        <div className={styleLookbook.lookbook_breadcrumb}>
          <Breadcrumb
            steps={[
              { label: i18n.t('breadcrumb.home') },
              {
                label: i18n.t('breadcrumb.lookbook'),
                linkProps: {
                  href: '/[lng]/lookbook/categories',
                  as: `/${lng}/lookbook/categories`,
                },
              },
              { label: data?.name },
            ]}
          />
        </div>
        <div className={styleLookbook.lookbook_detail_title}>
          <h1>{title}</h1>
        </div>
        <LookbookSingle
          classes={classesLookbookSingle}
          slug={slug}
          getTitle={setTitle}
          loadingComponent={
            <>
              <div className={styleLookbook.lookbook_detail_img}>
                <div
                  className={`${stylePlaceHolder.placeholderItem} ${styleLookbook.lookbook_detail_img}`}
                />
              </div>
              <div className={styleLookbook.lookbook_detail_img}>
                <div
                  className={`${stylePlaceHolder.placeholderItem} ${styleLookbook.lookbook_detail_img}`}
                />
              </div>
            </>
          }
          emptyStateComponent={
            <div className={styleLookbook.lookbook_empty}>
              <EmptyComponent
                title={i18n.t('lookbook.isEmpty')}
                icon={<IoHelpCircle color="#BCBCBC" size={15}/>}
                button={
                  <Link href="/[lng]/lookbook/categories" as={`/${lng}/lookbook/categories`}>
                    <a>{i18n.t('lookbook.back')}</a>
                  </Link>
                }
              />
            </div>
          }
          mode="thumbnail"
          thumborSetting={{
            width: 600,
            format: 'webp',
            quality: 85,
          }}
        />
        <div className={styleLookbook.lookbook_relatedProducts}>
          {i18n.t('lookbook.relatedProducts')}
        </div>
        <div className="container">
          <div className="row">
            <Products
              tagName={tagname}
              pageNumber={pageInfo.pageNumber}
              itemPerPage={pageInfo.itemPerPage}
              getPageInfo={setPageInfo as any}
              collectionSlug={categories}
              withSeparatedVariant={true}
              classes={classesProducts}
              fullPath={`product/{id}`}
              pathPrefix={`product`}
              lazyLoadedImage={false}
              thumborSetting={{
                width: size.width < 768 ? 512 : 800,
                format: 'webp',
                quality: 85,
              }}
              emptyStateComponent={
                <div className="col-12 my-3">
                  <EmptyComponent
                    icon={<RiQuestionFill color="#A8A8A8" size={20} />}
                    title={i18n.t('product.isEmpty')}
                  />
                </div>
              }
              loadingComponent={
                <div className="col-12">
                  <div className="d-flex justify-content-center align-center my-5">
                    <Loader color="text-secondary" withText />
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <div className={styleLookbook.lookbook_detail_shareContainer}>
          <SocialShare urlSite={urlSite} title={i18n.t('lookbook.share')} />
        </div>
        <div className={styleLookbook.lookbook_detail_footer}>
          <Link href="/[lng]/lookbook/categories" as={`/${lng}/lookbook/categories`}>
            <a>
              <IoArrowBackOutline color="#998060" size={12} />
              <span>{i18n.t('lookbook.back')}</span>
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res
}) => {
  const slug = params.slug
  const tokenData = await useAuthToken({ req, res, env: process.env });
  const token = tokenData.value;
  const [
    brand,
    data
  ] = await Promise.all([
    useBrand(req, token),
    getLookbookSingle(GRAPHQL_URI(req), slug.toString(), token),
  ])

  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)
  const urlSite = `https://${req.headers.host}/${params.lng}/lookbook/categories/${params.slug}`

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      slug,
      data,
      brand: brand || '',
      urlSite
    },
  }
}

export default LookbookSinglePage
