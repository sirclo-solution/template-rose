/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { IoHelpCircle } from 'react-icons/io5'
import {
  ProductListByCategory,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
import useInfiniteScroll from 'lib/useInfiniteScroll'
import useWindowSize from 'lib/useWindowSize'
/* components */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
/* styles */
import styles from 'public/scss/pages/Categories.module.scss'
import styleProducts from 'public/scss/pages/Products.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'
import styleProduct from 'public/scss/components/Product.module.scss'
import Loader from 'components/Loader/Loader'

const classesProductCategory = {
  productContainerClassName: `col-6 product_list ${styles.productsItemContainer}`,
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
  productsListCategoryHeaderTitleClassName: styles.productsListCategory_header_title,
  productsListCategoryHeaderClassName: styles.productsListCategory_header,
  productsListCategoryContainerClassName: `${styles.productsListCategory_container} col-12`,
  productsListCategoryHeaderLinkClassName: styles.productsListCategory_header_link,
  productsListContainerClassName: styles.productsListContainer,
}

const CategoriesPage: FC<any> = ({
  lng,
  lngDict,
  brand,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const i18n: any = useI18n()
  const size = useWindowSize()

  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    itemPerPage: 6,
    totalItems: 0,
  })

  const { currPage } = useInfiniteScroll(pageInfo, 'category_list:last-child')

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: i18n.t('categories.title'),
    SEO: {
      title: i18n.t("categories.title")
    }
  }

  return (
    <Layout {...layoutProps}>
      <SEO title={i18n.t("product.products")} />
      <div className="container mt-5 pt-4 pb-3">
        <Breadcrumb
          steps={[{ label: i18n.t('breadcrumb.home') }, { label: i18n.t('categories.categories') }]}
        />
      </div>
      <div className={`container ${styleProducts.products}`}>
        <div className="row">
          {Array.from(Array(currPage + 1)).map((_, i) => (
            <ProductListByCategory
              key={i}
              pageNumber={i}
              productCategoryType="INFINITE_SCROLL"
              itemPerPage={pageInfo.itemPerPage}
              classes={classesProductCategory}
              itemProductsPerCategory={6}
              getPageInfo={setPageInfo as any}
              thumborSetting={{
                width: size.width < 768 ? 512 : 800,
                format: "webp",
                quality: 85,
              }}
              emptyStateComponent={
                <div className="col-12 my-3">
                  <EmptyComponent
                    icon={<IoHelpCircle color="#BCBCBC" size={20} />}
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
      brand: brand || ""
    }
  }
}

export default CategoriesPage
