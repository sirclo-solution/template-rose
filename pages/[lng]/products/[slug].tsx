/* library package */
import {
  FC,
  useState,
  useEffect
} from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { RiQuestionFill, RiStarFill } from 'react-icons/ri'
import {
  Products,
  useAuthToken,
  useI18n,
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
import { useSizeBanner } from 'lib/useSizeBanner'
import useInfiniteScroll from 'lib/useInfiniteScroll'
import useWindowSize from 'lib/useWindowSize'
/* components */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
/* styles */
import styleButton from 'public/scss/components/Button.module.scss'
import styleProduct from 'public/scss/components/Product.module.scss'
import styleProducts from 'public/scss/pages/Products.module.scss'
import Loader from 'components/Loader/Loader'

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
  salePriceContainerClassName: styleProduct.product_labelPrice__container,
  priceClassName: styleProduct.product_labelPrice__price,
  titleContainerClassName: styleProduct.product_label__container,

  //category
  categoryContainerClassName: styleProduct.product_category__container,
  
  //rating
  ratingContainerClassName: styleProduct.product_rating__container,
  ratingWrapperClassName: styleProduct.product_rating__wrapper,
  ratingIconClassName: styleProduct.product_rating__icon,
  ratingCountClassName: styleProduct.product_rating__count,
  reviewCountClassName: styleProduct.product_rating__reviewCount,
}

const classesCategoryProduct = {
  parentCategoryClassName: styleProduct.product_category__parent,
  categoryItemsClassName: styleProduct.product_category__items,
}

const ProductsHighlightPage: FC<any> = ({
  lng,
  lngDict,
  brand,
  slugSection
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const i18n: any = useI18n()
  const size = useWindowSize()

  const [titleProductSection, setTitleProductSection] = useState<string>("")
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    itemPerPage: 6,
    totalItems: 0,
  })

  const { currPage, setCurrPage } = useInfiniteScroll(pageInfo, "product_list")

  useEffect(() => {
    setCurrPage(0)
  }, [])

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: titleProductSection,
    SEO: {
      title: titleProductSection,
    }
  }

  return (
    <Layout {...layoutProps}>
      <SEO title={i18n.t("product.products")} />
      <div className="container mt-5 pt-4 pb-3">
        <Breadcrumb
          steps={[{ label: i18n.t('breadcrumb.home') }, { label: titleProductSection }]}
        />
      </div>
      <div className="container">
        <div className={styleProducts.products_header}>
          <h6 className={styleProducts.products_headerTotalItem}>
            {i18n.t("products.show")} {pageInfo.totalItems} {i18n.t("products.item")}
          </h6>
        </div>
      </div>
      <div className={`container ${styleProducts.products}`}>
        <div className="row">
          {Array.from(Array(currPage + 1)).map((_, i) => (
            <Products
              key={i}
              pageNumber={i}
              itemPerPage={pageInfo.itemPerPage}
              getPageInfo={setPageInfo as any}
              classes={classesProducts}
              fullPath={`product/{id}`}
              pathPrefix={`product`}
              isFlipImage
              withCategory
              categoryLength={1}
              productCategoryClasses={classesCategoryProduct}
              withRating
              showEmptyRating
              isProductSectionHighlight
              ratingIcon={<RiStarFill color="#F2C14F" size={12} />}
              lazyLoadedImage={false}
              slug={slugSection}
              getTitleProductSection={(value: string) => setTitleProductSection(value)}
              thumborSetting={{
                width: useSizeBanner(size.width),
                format: "webp",
                quality: 85,
              }}
              emptyStateComponent={
                <div className="col-12 my-3">
                  <EmptyComponent
                    icon={<RiQuestionFill color="#A8A8A8" size={20} />}
                    title={i18n.t("product.isEmpty")}
                  />
                </div>
              }
              loadingComponent={
                <div className="col-12">
                  <div className="d-flex justify-content-center align-center my-5">
                    <Loader
                      color="text-secondary"
                      withText
                    />
                  </div>
                </div>
              }
            />
          ))}
          {(pageInfo.totalItems === 0) &&
            <div className="col-12">
              <button
                className={`${styleButton.btn} ${styleButton.btn_secondary}`}
                onClick={() => router.push(`/${lng}/products`)}
              >
                {i18n.t("products.seeAllProduct")}
              </button>
            </div>
          }
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const { slug } = params
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
      brand: brand || "",
      slugSection: slug
    }
  }
}

export default ProductsHighlightPage
  