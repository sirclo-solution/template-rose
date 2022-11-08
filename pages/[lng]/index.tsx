/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { LazyLoadComponent } from 'react-lazy-load-image-component'
import { RiQuestionFill, RiStarFill } from 'react-icons/ri'
import {
  getBanner,
  Products,
  useAuthToken,
  useI18n,
  Widget
} from '@sirclo/nexus'
/* library template */
import useWindowSize from 'lib/useWindowSize'
import { GRAPHQL_URI } from 'lib/Constants'
import { useBrand } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
import BannerComponent from 'components/Banner'
import ProductTitle from 'components/ProductTitle'
import Instafeed from 'components/Instafeed'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
import Placeholder from 'components/Placeholder'
/* styles */
import styleBanner from 'public/scss/components/Banner.module.scss'
import styleWidget from 'public/scss/components/Widget.module.scss'
import styleProduct from 'public/scss/components/Product.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'
import stylePlaceholder from 'public/scss/components/Placeholder.module.scss'

const classesProducts = {
  productContainerClassName: styleProduct.product_item,
  stickerContainerClassName: styleProduct.product_sticker,
  outOfStockLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__outofstock}`,
  saleLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__sale}`,
  comingSoonLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__comingsoon}`,
  openOrderLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__openorder}`,
  preOrderLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__preorder}`,
  newLabelClassName: `${styleProduct.product_stickerLabel} ${styleProduct.product_stickerLabel__new}`,
  productImageContainerClassName: styleProduct.product_link,
  productImageClassName: styleProduct.product_link__image,
  productLabelContainerClassName: styleProduct.product_label,
  titleContainerClassName: styleProduct.product_label__container,
  productTitleClassName: styleProduct.product_label__title,
  productPriceClassName: styleProduct.product_labelPrice,
  salePriceContainerClassName: styleProduct.product_labelPrice__container,
  salePriceClassName: styleProduct.product_labelPrice__sale,
  priceClassName: styleProduct.product_labelPrice__price,
  
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

const classesPlaceholderProduct = {
  placeholderImage: `${stylePlaceholder.placeholderItem} ${stylePlaceholder.placeholderItem_productCard}`,
}

const classesPlaceholderWidgetService = {
  placeholderImage: `${stylePlaceholder.placeholderItem} ${stylePlaceholder.placeholderItem_widgetService}`,
}

const Home: FC<any> = ({
  lng,
  lngDict,
  brand,
  dataBanners
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router: any = useRouter()
  const size = useWindowSize()
  const [tagname, setTagname] = useState<string>('')
  const [totalItem, setTotalItem] = useState({
    ourproduct: null,
    featured: null,
    newarrival: null,
    preorder: null
  })

  const handleChangeTagname = (tag: string) => setTagname(tag)

  const getTotalItem = (total: number) => {
    switch (tagname) {
      case '':
        setTotalItem({ ...totalItem, ourproduct: total })
        break
      case 'featured':
        setTotalItem({ ...totalItem, featured: total })
        break
      case 'new-arrivals':
        setTotalItem({ ...totalItem, newarrival: total })
        break
      case 'preorder':
        setTotalItem({ ...totalItem, preorder: total })
        break
      default:
        break
    }
  }

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    withAnnouncement: true,
    SEO: {
      title: i18n.t("home.title")
    },
  }

  return (
    <Layout {...layoutProps}>
      <div className={styleBanner.bannerCarousel}>
        <BannerComponent
          data={dataBanners?.data}
          size={size}
        />
      </div>
      <div className={styleWidget.widget_services}>
        <Widget
          pos="main-content-1"
          containerClassName={styleWidget.widget_servicesContainer}
          widgetClassName={styleWidget.widget_servicesItem}
          loadingComponent={
            <Placeholder classes={classesPlaceholderWidgetService} withImage />
          }
          thumborSetting={{
            width: size.width < 768 ? 300 : 500,
            format: "webp",
            quality: 85
          }}
        />
      </div>
      <div className={styleProduct.product_container}>
        <div className={`${styleProduct.product_containerItem} ${styleProduct.product_containerTitle}`}>
          <ProductTitle
            i18n={i18n}
            styleProduct={styleProduct}
            handleChangeTagname={handleChangeTagname}
            tagnameActive={tagname}
            totalProducts={totalItem}
          />
        </div>
        <div className="container">
          <div className={styleProduct.product_containerItem}>
            <LazyLoadComponent>
              <Products
                tagName={tagname}
                itemPerPage={8}
                classes={classesProducts}
                pathPrefix="product"
                isFlipImage
                withCategory
                productCategoryClasses={classesCategoryProduct}
                categoryLength={1}
                withRating
                showEmptyRating
                ratingIcon={<RiStarFill color="#F2C14F" size={12} />}
                lazyLoadedImage={false}
                getPageInfo={(pageInfo) => getTotalItem(pageInfo.totalItems)}
                emptyStateComponent={
                  <EmptyComponent
                    icon={<RiQuestionFill color="#A8A8A8" size={20} />}
                    title={i18n.t("product.isEmpty")}
                  />
                }
                thumborSetting={{
                  width: size.width < 768 ? 512 : 800,
                  format: "webp",
                  quality: 85
                }}
                loadingComponent={
                  <>
                    <div><Placeholder classes={classesPlaceholderProduct} withImage /></div>
                    <div><Placeholder classes={classesPlaceholderProduct} withImage /></div>
                    <div><Placeholder classes={classesPlaceholderProduct} withImage /></div>
                  </>
                }
              />
            </LazyLoadComponent>
          </div>
          <div className="text-center mt-4">
            <button
              className={`${styleButton.btn} ${styleButton.btn_secondary}`}
              onClick={() => router.push(`/${lng}/products`)}
            >
              {i18n.t("product.seeAll")}
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <Widget
          pos="main-content-2"
          containerClassName={styleWidget.widget_banner}
          widgetClassName={styleWidget.widget_bannerItem}
          loadingComponent={
            <>
              <div className="col-12">
                <Placeholder classes={classesPlaceholderProduct} withImage />
              </div>
            </>
          }
          thumborSetting={{
            width: size.width < 768 ? 576 : 900,
            format: "webp",
            quality: 85
          }}
        />
      </div>
      {brand?.socmedSetting?.instagramToken &&
        <div className="container">
          <LazyLoadComponent>
            <Instafeed
              i18n={i18n}
              brand={brand}
              withFollowButton
            />
          </LazyLoadComponent>
        </div>
      }
      <div className={styleWidget.widget_footer}>
        <Widget
          pos="footer-1"
          containerClassName={styleWidget.widget_footerBrand}
          widgetClassName={styleWidget.widget_footerBrandItem}
          loadingComponent={
            <>
              <div className="col-12">
                <Placeholder classes={classesPlaceholderWidgetService} withImage />
              </div>
            </>
          }
          thumborSetting={{
            width: size.width < 768 ? 250 : 300,
            format: "webp",
            quality: 85
          }}
        />
      </div>
    </Layout >
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}: any) => {
  const [
    brand,
    dataBanners
  ] = await Promise.all([
    useBrand(req),
    getBanner(GRAPHQL_URI(req)),
    useAuthToken({req, res, env: process.env})
	])
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)
  const allowedUri: Array<string> = ['en', 'id', 'graphql', 'favicon.ico'];

  if (allowedUri.indexOf(params.lng.toString()) == -1) {
    res.writeHead(307, {
      Location: `/${defaultLanguage}/` + params.lng
    })
    res.end()
  }

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || '',
      dataBanners
    },
  }
}

export default Home