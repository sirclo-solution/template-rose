/* library package */
import { FC } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiChevronLeft,
} from 'react-icons/fi'
import { IoTrashBinOutline } from 'react-icons/io5'
import { FaCopy, FaEdit } from 'react-icons/fa'
import {
  OrderSummary,
  CartDetails
} from '@sirclo/nexus'
/* components */
import Loader from 'components/Loader/Loader'
/* styles */
import styleOrderSummary from 'public/scss/components/OrderSummaryBox.module.scss'
import styleCart from 'public/scss/components/CartDetail.module.scss'

const classesOrderSummary = {
  containerClassName: styleOrderSummary.orderSummary,
  continueShoppingClassName: styleOrderSummary.orderSummary_button__continueShopping,
  footerClassName: styleOrderSummary.orderSummary_footer,
  headerClassName: styleOrderSummary.orderSummary_header,
  submitButtonClassName: styleOrderSummary.orderSummary_button__submit,
  subTotalClassName: styleOrderSummary.orderSummary_subTotal,
  expandButtonClassName: styleOrderSummary.orderSummary_button__expand,
  expandedDivClassName: styleOrderSummary.orderSummary_expanded,
  disclaimerMessageContainerClassName: 'd-none',
  deductionPriceClassName: styleOrderSummary.orderSummary_deductedPrice,
  /* pop up */
  popupClassName: styleOrderSummary.orderSummary_popup,
  closeButtonClassName: styleOrderSummary.orderSummary_closeButton,
  popupBackgroundClassName: styleOrderSummary.orderSummary_popupBackground,
  voucherContainerClassName: styleOrderSummary.orderSummary_voucherContainer,
  voucherFormContainerClassName: styleOrderSummary.orderSummary_voucherFormContainer,
  voucherListClassName: styleOrderSummary.orderSummary_voucherList,
  voucherBankLogoContainerClassName: styleOrderSummary.orderSummary_voucherBankContainer,
  voucherBankLogoImageClassName: styleOrderSummary.orderSummary_voucherBankImage,
  voucherShipperLogoContainerClassName: styleOrderSummary.orderSummary_voucherBankContainer,
  voucherShipperLogoImageClassName: styleOrderSummary.orderSummary_voucherBankImage,
  /* voucher */
  voucherTitleInputClassName: styleOrderSummary.orderSummary_voucherTitleInput,
  voucherSubTitleInputClassName: styleOrderSummary.orderSummary_voucherSubTitleInput,
  voucherInputContainerClassName: styleOrderSummary.orderSummary_voucherInputContainer,
  voucherButtonClassName: styleOrderSummary.orderSummary_voucherButton,
  voucherIconClassName: styleOrderSummary.orderSummary_voucherIcon,
  voucherTextClassName: styleOrderSummary.orderSummary_voucherText,
  voucherFormClassName: styleOrderSummary.orderSummary_voucherForm,
  voucherInputClassName: styleOrderSummary.orderSummary_voucherInput,
  voucherSubmitButtonClassName: styleOrderSummary.orderSummary_voucherSubmitButton,
  voucherValidListClassName: styleOrderSummary.orderSummary_voucherValidList,
  voucherInvalidListClassName: styleOrderSummary.orderSummary_voucherInvalidList,
  voucherListHeaderClassName: styleOrderSummary.orderSummary_voucherListHeader,
  voucherListHeaderIconClassName: styleOrderSummary.orderSummary_voucherListHeaderIcon,
  voucherListItemsClassName: styleOrderSummary.orderSummary_voucherListItems,
  voucherClassName: styleOrderSummary.orderSummary_voucher,
  voucherFooterClassName: styleOrderSummary.orderSummary_voucherFooter,
  voucherApplyButtonClassName: styleOrderSummary.orderSummary_voucherApplyButton,
  voucherDetailClassName: styleOrderSummary.orderSummary_voucherDetail,
  voucherButtonAppliedClassName: styleOrderSummary.orderSummary_voucherButtonApplied,
  voucherAppliedIconClassName: styleOrderSummary.orderSummary_voucherAppliedIcon,
  voucherAppliedTextClassName: styleOrderSummary.orderSummary_voucherAppliedText,
  voucherButtonRemoveClassName: styleOrderSummary.orderSummary_voucherButtonRemove,
  /* point */
  pointsButtonClassName: styleOrderSummary.orderSummary_voucherButton,
  pointsIconClassName: styleOrderSummary.orderSummary_voucherIcon,
  pointsTextClassName: styleOrderSummary.orderSummary_voucherText,
  pointsContainerClassName: styleOrderSummary.orderSummary_pointsContainer,
  changePointsClassName: styleOrderSummary.orderSummary_pointsChange,
  numberOfPointsClassName: styleOrderSummary.orderSummary_numberOfPoints,
  pointLabelClassName: 'd-none',
  pointsFormContainerClassName: styleOrderSummary.orderSummary_pointsFormContainer,
  pointsWarningClassName: styleOrderSummary.orderSummary_pointsWarning,
  pointsFormClassName: styleOrderSummary.orderSummary_pointsForm,
  totalPointsClassName: styleOrderSummary.orderSummary_totalPoints,
  pointValueClassName: styleOrderSummary.orderSummary_pointValue,
  pointsSubmitButtonClassName: styleOrderSummary.orderSummary_pointsSubmitButton,
  pointsInsufficientClassName: styleOrderSummary.orderSummary_pointsInsufficient,
  pointsButtonAppliedClassName: styleOrderSummary.orderSummary_voucherButtonApplied,
  pointsAppliedTextClassName: styleOrderSummary.orderSummary_voucherAppliedText,
  pointButtonRemoveClassName: styleOrderSummary.orderSummary_voucherButtonRemove,

  /* Grouping Coupon */
  voucherTitleClassName: "d-none",
  voucherDetailInvalidClassName: styleOrderSummary.orderSummary_voucherDetailInvalid,
  voucherDetailHeaderClassName: styleOrderSummary.orderSummary_voucherDetailHeader,
  voucherDetailCodeClassName: "d-none",
  voucherDetailTitleClassName: styleOrderSummary.orderSummary_voucherDetailTitle,
  voucherDetailDescClassName: styleOrderSummary.orderSummary_voucherDetailDesc,
  voucherDetailEstimateClassName: styleOrderSummary.orderSummary_voucherDetailEstimate,
  voucherDetailEstimateDescClassName: styleOrderSummary.orderSummary_voucherDetailEstimateDesc,
  voucherDetailViewDetailsClassName:  styleOrderSummary.orderSummary_voucherDetailViewDetails,
  voucherDetailApplyedClassName:  styleOrderSummary.orderSummary_voucherDetailApplied,

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

const classesCartDetails = {
	className: styleOrderSummary.cart_detail,
	cartHeaderClassName: 'd-none',
	itemClassName: `${styleCart.cartItem} ${styleOrderSummary.cart_item}`,
	itemImageClassName: styleCart.cartItem_image,
	selectedVariantContainerClassName: styleCart.cartItem_variant,
	itemTitleClassName: styleCart.cartItem_title,
	itemPriceClassName: styleCart.cartItem_price,
	itemRegularPriceClassName: styleCart.cartItem_regularPrice,
	itemSalePriceWrapperClassName: styleCart.cartItem_salePriceWrapper,
	itemSalePriceClassName: styleCart.cartItem_salePrice,
	itemDiscountNoteClassName: styleCart.cartItem_discNote,
	itemQtyClassName: styleCart.cartItem_qty,
	itemNoteClassName: styleCart.cartItem_note,
	errorClassName: 'd-none',
	qtyBoxClassName: styleCart.cartItem_qtyBox,
	itemAmountClassName: styleCart.cartItem_totalPrice,
	itemEditClassName: 'd-none',
	itemRemoveClassName: styleCart.cartItem_remove,
	cartFooterClassName: 'd-none',
	cartFooterTitleClassName: 'd-none',
	cartFooterTextareaClassName: 'd-none',
}

type iProps = {
  i18n: any
  lng?: any
  page: "cart"
  | "place_order"
  | "shipping_method"
  | "payment_method"
  withCartDetails?: boolean
  withOrderSummary?: boolean
  titleSubmit?: string
  totalCrossSell?: number
}

const OrderSummaryComponent: FC<iProps> = ({
  i18n,
  lng,
  page,
  withCartDetails = true,
  withOrderSummary = true,
  titleSubmit = i18n.t("orderSummary.placeOrder"),
  totalCrossSell = 0
}) => {

  return (
    <>
      {withCartDetails &&
        <div className={`${styleCart.cart_container} ${styleOrderSummary.cart_container} ${lng}`}>
          <div className={styleOrderSummary.cart_header}>
            <h6 className={styleOrderSummary.cart_headerTitle}>
              {i18n.t("orderSummary.yourCart")}
            </h6>
            <Link href="/[lng]/cart" as={`/${lng}/cart`}>
              <a>
                <FiChevronLeft
                  color="#998060"
                  size={16}
                  className="mr-1"
                />
                {i18n.t("global.changeCart")}
              </a>
            </Link>
          </div>
          <CartDetails
            currency="IDR"
            classes={classesCartDetails}
            variantSeparator=", "
            withSeparatedVariant
            itemRedirectPathPrefix={`product`}
            isEditable={true}
            removeIcon={<IoTrashBinOutline />}
            onErrorMsg={(msg) => toast.error(msg)}
            lazyLoadedImage={false}
            thumborSetting={{
              width: 100,
              format: "webp",
              quality: 85,
            }}
            loadingComponent={
              <Loader />
            }
            withProductNote
            productNoteButtonElement={{
              filled: <span>{i18n.t("cart.change")}</span>,
              save: <span>{i18n.t("cart.save")}</span>,
              empty: (
                <>
                  <FaEdit />
                  <span>{i18n.t("cart.addNote")}</span>
                </>
              )
            }}
          />
        </div>
      }
      {withOrderSummary &&
        <>
          <OrderSummary
            page={page}
            currency="IDR"
            classes={{
              ...classesOrderSummary,
              voucherTextClassName: `${styleOrderSummary.orderSummary_voucherText} ${lng}`,
              voucherAppliedTextClassName: `${styleOrderSummary.orderSummary_voucherAppliedText} ${lng}`,
              // voucherTitleClassName: `${styleOrderSummary.orderSummary_voucherTitle} ${lng}`,
              containerClassName: `${styleOrderSummary.orderSummary} ${totalCrossSell === 0 && styleOrderSummary.orderSummary_extras}`
            }}
            submitButtonLabel={titleSubmit}
            continueShoppingLabel={i18n.t("orderSummary.continueShopping")}
            onErrorMsg={(msg) => toast.error(msg)}
            onErrorMsgCoupon={(msg) => toast.error(msg)}
            isAccordion
            onAddressInvalid={(e) => toast.error(e)}
            loadingComponent={<Loader />}
            withCouponTitle
            couponLoadingComponent={
              <div className={styleOrderSummary.orderSummary_voucherLoading}>
                <Loader />
              </div>}
            emptyComponentCoupon={
              <div className={styleOrderSummary.orderSummary_voucherEmpty}>
                <p>{i18n.t("coupon.empty")}</p>
              </div>
            }
            icons={{
              voucher: <img src="/icons/voucher.svg" alt="voucher" />,
              points: <img src="/icons/point.svg" alt="points" />,
              close: <FiX size={24} color="#444444" />,
              voucherApplied: <img src="/icons/voucher.svg" alt="voucher" />,
              voucherRemoved: <FiX color="#CC4534" size={16} />,
              pointsApplied: <img src="/icons/point.svg" alt="points" />,
              copyIcon: <FaCopy />
            }}
          />
        </>
      }
    </>
  )
}

export default OrderSummaryComponent
