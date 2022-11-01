/* libary package */
import { FC, ReactNode } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { HiCheckCircle } from 'react-icons/hi'
import { FiX } from 'react-icons/fi'
import { FaCopy } from 'react-icons/fa'
import {
  CustomerDetail,
  ListPaymentMethod,
  PrivateRoute,
  useI18n,
  useShippingMethod,
  useBuyerNotes
} from '@sirclo/nexus'
/* libary template */
import { useBrand } from 'lib/useBrand'
import { useWhatsAppOTPSetting } from 'lib/useWhatsAppOtp'
/* components */
import Layout from 'components/Layout/Layout'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
import Stepper from 'components/Stepper'
import HeaderCheckout from 'components/Header/HeaderCheckout'
import Loader from 'components/Loader/Loader'
import LoaderPages from 'components/Loader/LoaderPages'
import Placeholder from 'components/Placeholder'
/* styles */
import styleOrderSummary from 'public/scss/components/OrderSummaryBox.module.scss'
import styleCustomer from 'public/scss/components/CustomerDetail.module.scss'
import styleBtn from 'public/scss/components/Button.module.scss'
import styles from 'public/scss/pages/PaymentMethod.module.scss'

const classesCustomerDetail = {
  customerDetailBoxClass: styleCustomer.customer,
  addressContainerClassName: styleCustomer.customer_info,
  addressDetailClassName: styleCustomer.customer_infoPerson,
  addressValueClassName: styleCustomer.customer_infoPersonValue,
  changePinClassName: styleCustomer.customer_changePin,
  // Map Popup
  mapPopupClassName: styleCustomer.customer_mapPopup,
  mapPopupBackgroundClassName: styleCustomer.customer_mapPopupContainer,
  mapClassName: styleCustomer.customer_mapPopupMaps,
  mapHeaderWrapperClassName: styleCustomer.customer_mapPopupHeader,
  mapHeaderTitleClassName: styleCustomer.customer_mapPopupHeaderTitle,
  mapHeaderCloseButtonClassName: styleCustomer.customer_mapPopupClose,
  mapHeaderNoteClassName: styleCustomer.customer_mapPopupNote,
  mapLabelAddressClassName: styleCustomer.customer_mapPopupLabelAddress,
  mapButtonFooterClassName: `${styleBtn.btn} ${styleBtn.btn_primary} d-block mx-auto my-3`,
  mapCenterButtonClassName: styleCustomer.customer_mapPopupCenterButton
}

const classesListPaymentMethod = {
  listPaymentDivClassName: "container",
  paymentItemEnabledClassName: `row ${styles.payment_listItemEnabled}`,
  paymentItemDisabledClassName: `row ${styles.payment_listItemDisabled}`,
  paymentTypeClassName: `align-self-center ${styles.payment_listItemPayment}`,
  radioButtonContainerClassName: styles.payment_listItemPayment__radio,
  paymentImgClassName: `align-self-center ${styles.payment_listItemPayment__image}`,
  paymentWarningTextClassName: styles.payment_listItemPayment__warning,
  paymentMethodDetailsClassName: `col-12 ${styles.payment_listItemBody}`,
  paymentMethodDetailBodyClassName: styles.payment_listItemDetail,
  selectedPaymentMethodClassName: styles.payment_listItemTable,
  paymentDetailsRowClassName: styles.payment_listItemTableRow,
  paymentDetailsLabelClassName: styles.payment_listItemTableRow__label,
  paymentDetailsValueClassName: styles.payment_listItemTableRow__value,
  paymentDetailsDeductionClassName: styles.payment_listItemTableRow_deductionPrice,
  // footer
  paymentMethodDetailFooterClassName: styles.payment_footer,
  promotionButtonGroupClassName: styles.payment_footer__promotion,
  couponButtonClassName:  styleOrderSummary.orderSummary_voucherButton,
  popupClassName: styles.payment_listItemOverlay,
  voucherContainerClassName: styleOrderSummary.orderSummary_voucherContainer,
  closeButtonClassName: styles.payment_closeButton,
  voucherFormContainerClassName: styleOrderSummary.orderSummary_voucherFormContainer,
  voucherFormClassName: styleOrderSummary.orderSummary_voucherForm,
  voucherInputClassName: styleOrderSummary.orderSummary_voucherInput,
  voucherSubmitButtonClassName: styleOrderSummary.orderSummary_voucherSubmitButton,
  voucherListClassName: styleOrderSummary.orderSummary_voucherList,
  voucherListItemsClassName: styleOrderSummary.orderSummary_voucherListItems,
  voucherValidListClassName: styleOrderSummary.orderSummary_voucherValidList,
  voucherInvalidListClassName: styleOrderSummary.orderSummary_voucherInvalidList,
  voucherListHeaderClassName: styleOrderSummary.orderSummary_voucherListHeader,
  voucherClassName: styleOrderSummary.orderSummary_voucher,
  voucherDetailClassName: styleOrderSummary.orderSummary_voucherDetail,
  voucherFooterClassName: styleOrderSummary.orderSummary_popupVoucherFooter,
  voucherAppliedIconClassName: styleOrderSummary.orderSummary_voucherAppliedIcon,
  voucherAppliedTextClassName: styleOrderSummary.orderSummary_voucherAppliedText,
  voucherButtonRemoveClassName: styleOrderSummary.orderSummary_voucherButtonRemove,
  voucherApplyButtonClassName: `${styleBtn.btn} ${styleBtn.btn_primary}`,
  voucherBankLogoContainerClassName: styleOrderSummary.orderSummary_voucherBankContainer,
  voucherBankLogoImageClassName: styleOrderSummary.orderSummary_voucherBankImage,
  voucherShipperLogoContainerClassName: styleOrderSummary.orderSummary_voucherBankContainer,
  voucherShipperLogoImageClassName: styleOrderSummary.orderSummary_voucherBankImage,
  agreementContainerClassName: styles.payment_footer__agreement,
  agreementCheckboxClassName: styles.payment_footer__check,
  buttonContainerClassName: styles.payment_footer__button,
  buttonClassName: `${styleBtn.btn} ${styleBtn.btn_primary}`,
  basePriceClassName: styles.payment_listItemTableRow__priceSale,
  salePriceClassName: styles.payment_listItemTableRow__price,
  shippingPriceClassName: styles.payment_listItemTableRow__priceSale,
  shippingDiscountClassName: styles.payment_listItemTableRow__price,
  // point
  pointsContainerClassName: styles.payment_containerPointPopup,
  numberOfPointsClassName: styles.payment_numberOfPoints,
  pointLabelClassName: 'd-none',
  totalPointsClassName: styles.payment_pointsPopup,
  pointsFormContainerClassName: styles.payment_pointsFormContainer,
  pointsFormClassName: styles.payment_pointsForm,
  changePointsClassName: styles.payment_pointsChange,
  pointsInsufficientClassName: styles.payment_pointsInsufficient,
  pointsSubmitButtonClassName: `${styleBtn.btn} ${styleBtn.btn_primary} ${styles.payment_pointsSubmitButton}`,
  pointsWarningClassName: styles.payment_pointsWarning,
  pointButtonClassName: styleOrderSummary.orderSummary_voucherButton,
  pointAppliedTextClassName: styles.payment_pointAppliedText,
  pointButtonRemoveClassName: styleOrderSummary.orderSummary_voucherButtonRemove,
  // traveloka paylater
  travelokaPayLaterHeaderClassName: styles.payment_travelokaPayLater__header,
  travelokaPayLaterFooterClassName: styles.payment_travelokaPayLater__footer,
  travelokaPayLaterFooterTextClassName: styles.payment_travelokaPayLater__text,
  travelokaPayLaterFooterLinkClassName: styles.payment_travelokaPayLater__link,
  travelokaPayLaterFooterImgClassName: styles.payment_travelokaPayLater__img,

  // grouping coupon
  voucherDetailInvalidClassName: styleOrderSummary.orderSummary_voucherDetailInvalid,
  voucherDetailHeaderClassName: styleOrderSummary.orderSummary_voucherDetailHeader,
  voucherDetailCodeClassName: "d-none",
  voucherDetailTitleClassName: styleOrderSummary.orderSummary_voucherDetailTitle,
  voucherDetailDescClassName: styleOrderSummary.orderSummary_voucherDetailDesc,
  voucherDetailEstimateClassName: styleOrderSummary.orderSummary_voucherDetailEstimate,
  voucherDetailEstimateDescClassName: styleOrderSummary.orderSummary_voucherDetailEstimateDesc,

  // details popup
  voucherDetailViewDetailsClassName:  styleOrderSummary.orderSummary_voucherDetailViewDetails,
  voucherDetailApplyedClassName:  styleOrderSummary.orderSummary_voucherDetailApplied,
  voucherTitleInputClassName: styleOrderSummary.orderSummary_voucherTitleInput,
  voucherSubTitleInputClassName: styleOrderSummary.orderSummary_voucherSubTitleInput,
  voucherInputContainerClassName: styleOrderSummary.orderSummary_voucherInputContainer,
  voucherShowMoreContainerClassName: styleOrderSummary.orderSummary_voucherShowMoreContainer,
  voucherShowMoreButtonClassName: styleOrderSummary.orderSummary_voucherShowMoreButton,
  voucherDetailPopUpContainerClassName: styleOrderSummary.orderSummary_voucherDetailPopUpContainer,
  voucherDetailPopUpBodyClassName: styleOrderSummary.orderSummary_voucherDetailPopUpBody,
  voucherDetailPopUpHeaderClassName: styleOrderSummary.orderSummary_voucherDetailPopUpHeader,
  voucherDetailPopUpHeaderTitleClassName: styleOrderSummary.orderSummary_voucherDetailPopUpHeaderTitle,
  voucherDetailPopUpCloseClassName: styleOrderSummary.orderSummary_voucherDetailPopUpClose,
  voucherDetailPopUpDescContainerClassName: styleOrderSummary.orderSummary_voucherDetailPopUpDescContainer,
  voucherDetailPopUpTermsTitleClassName: styleOrderSummary.orderSummary_voucherDetailPopUpTermsTitle,
  voucherDetailPopUpTermsContainerClassName: styleOrderSummary.orderSummary_voucherDetailPopUpTermsContainer,
  voucherDetailPopUpDescDateClassName: styleOrderSummary.orderSummary_voucherDetailPopUpDescDate,
  voucherDetailPopUpCodeContainerClassName: styleOrderSummary.orderSummary_voucherDetailPopUpCodeContainer,
  voucherDetailPopUpCodeTitleClassName: styleOrderSummary.orderSummary_voucherDetailPopUpCodeTitle,
  voucherDetailPopUpCodeCopyContainerClassName: styleOrderSummary.orderSummary_voucherDetailPopUpCodeCopyContainer,
  voucherDetailPopUpCodeCopyTitleClassName: styleOrderSummary.orderSummary_voucherDetailPopUpCodeCopyTitle,
  voucherDetailPopUpCodeCopyButtonClassName: styleOrderSummary.orderSummary_voucherDetailPopUpCodeCopyButton,
  voucherDetailPopUpUseCouponClassName: styleOrderSummary.orderSummary_voucherDetailPopUpUseCoupon,
}

const classesPlaceholderCustomerDetail = {
  placeholderImage: `${styles.placeholderItem} ${styles.placeholderItem_customerDetail}`
}

const classesPlaceholderPayment = {
  placeholderList: `${styles.placeholderItem} ${styles.placeholderItem_paymentMethod}`
}

type PrivateComponentPropsType = {
  children: ReactNode
}

type TypeCustomerDetail = {
  i18n: any
  router: any
  title: string
  withIcon?: boolean
  toDirect?: string
}

const PrivateRouteWrapper = ({ children }: PrivateComponentPropsType) => (
  <PrivateRoute
    page="payment_method"
    loadingComponent={<LoaderPages />}
  >
    {children}
  </PrivateRoute>
)

const CustomerDetailHeader = ({
  i18n,
  router,
  title,
  withIcon = true,
  toDirect = "place_order"
}: TypeCustomerDetail) => (
  <div className={styleCustomer.customer_infoHeader}>
    <div className={styleCustomer.customer_infoHeaderContainer}>
      <h3 className={styleCustomer.customer_infoHeaderTitle}>
        {title}
      </h3>
      {withIcon &&
        <HiCheckCircle color="#53B671" size={20} />
      }
    </div>
    <div
      className={styleCustomer.customer_infoHeaderLink}
      onClick={() => router.push({
        pathname: `/[lng]/${toDirect}`,
        query: router.query
      })}
    >
      {i18n.t("global.change")}
    </div>
  </div>
)

const PaymentMethods: FC<any> = ({
  lng,
  lngDict,
  brand,
  hasOtp
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router: any = useRouter()
  const { data } = useShippingMethod()
  const { data: dataBuyerNotes } = useBuyerNotes()

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    SEO: {
      title: i18n.t("placeOrder.title")
    },
    withHeader: false,
    withFooter: false,
    layoutClassName: 'layout_fullHeight'
  }

  return (
    <PrivateRouteWrapper>
      <Layout {...layoutProps}>
        <HeaderCheckout
          i18n={i18n}
        />
        <Stepper
          title={i18n.t('account.paymentMethod')}
          step={3}
        />
        <div className={styles.customer}>
          <CustomerDetail
            classes={classesCustomerDetail}
            isBilling={true}
            contactInfoHeader={
              <CustomerDetailHeader
                i18n={i18n}
                router={router}
                title={i18n.t("shipping.contactInfo")}
              />
            }
            loadingComponent={
              <Placeholder classes={classesPlaceholderCustomerDetail} withImage />
            }
          />
          <CustomerDetail
            classes={classesCustomerDetail}
            isBilling={false}
            shippingInfoHeader={
              <CustomerDetailHeader
                i18n={i18n}
                router={router}
                title={i18n.t("shipping.shipTo")}
              />
            }
            loadingComponent={
              <Placeholder classes={classesPlaceholderCustomerDetail} withImage />
            }
          />
          <div className={styles.customer_section}>
            <CustomerDetailHeader
              i18n={i18n}
              router={router}
              title={i18n.t("global.notes")}
              toDirect="cart"
            />
            <div className={styles.customer_notes}>
              {dataBuyerNotes?.buyerNotes?.buyerNotes || i18n.t("global.notesEmpty")}
            </div>
          </div>
          {data?.shippingMethod &&
            <div className={`${styles.customer_section} pb-0`}>
              <CustomerDetailHeader
                i18n={i18n}
                router={router}
                title={i18n.t("account.shippingMethod")}
                toDirect="shipping_method"
              />
              <div className={styles.payment_shipping}>
                <h3 className={styles.payment_shippingTitle}>
                  {data?.shippingMethod?.shippingProvider}&nbsp;{data?.shippingMethod?.shippingService}
                </h3>
                <h3 className={styles.payment_shippingCost}>
                  {data?.shippingMethod?.shippingCost}
                </h3>
              </div>
            </div>
          }
        </div>
        <div className={styles.payment}>
          <h3 className={styles.payment_listTitle}>
            {i18n.t("payment.title")}
          </h3>
          <ListPaymentMethod
            classes={{
              ...classesListPaymentMethod,
              voucherAppliedTextClassName: `${styleOrderSummary.orderSummary_voucherAppliedText} ${lng}`,
              voucherTitleClassName: `${styleOrderSummary.orderSummary_voucherTitle} ${lng}`
            }}
            withNotificationOptInModal={hasOtp}
            onSuccessCopyCodeCoupon={() => toast.success(i18n.t('coupon.successCopyCode'))}
            onErrorMsg={(msg) => toast.error(msg)}
            onErrorMsgCoupon={(msg) => toast.error(msg)}
            couponLoadingComponent={
              <div className={styleOrderSummary.orderSummary_voucherLoading}>
                <Loader />
              </div>
            }
            emptyComponentCoupon={
              <div className={styleOrderSummary.orderSummary_voucherEmpty}>
                <p>{i18n.t("coupon.empty")}</p>
              </div>
            }
            copyIcon={<FaCopy />}
            voucherIcon={
              <img src="/icons/voucher.svg" className="mr-2" alt="voucher" />
            }
            voucherAppliedIcon={
              <img src="/icons/voucher.svg" className="mr-2" alt="voucher-applied" />
            }
            pointIcon={
              <img src="/icons/point.svg" className="mr-2" alt="point" />
            }
            pointAppliedIcon={
              <img src="/icons/point.svg" className="mr-2" alt="point-applied" />
            }
            removeVoucherIcon={
              <FiX color="#CC4534" size={16} className="" />
            }
            removePointIcon={
              <FiX color="#CC4534" size={16} className="" />
            }
            closeButtonIcon={
              <FiX size={24} color="#444444" />
            }
            loadingComponent={
              <Placeholder classes={classesPlaceholderPayment} withList listMany={3} />
            }
            emptyState={
              <EmptyComponent
                title={i18n.t("payment.isEmpty")}
              />
            }
            loaderElement={
              <div className="col-12 text-center mx-auto loader">
                <Loader color="text-dark" withText />
              </div>
            }
            popupLoader={
              <div className={styles.payment_popupProcessOverlay}>
                <div className={styles.payment_popupProcessContainer}>
                  <div className={styles.payment_popupProcessInner}>
                    <span className="spinner-border spinner-border-sm mr-3" role="status"></span>
                    <span>{i18n.t("global.loading")}</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </Layout>
    </PrivateRouteWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const brand = await useBrand(req)
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)
  const hasOtp = await useWhatsAppOTPSetting(req);

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      hasOtp,
      brand: brand || ""
    }
  }
}

export default PaymentMethods
