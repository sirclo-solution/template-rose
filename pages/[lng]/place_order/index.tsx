/* library package */
import {
  FC,
  ReactNode,
  useState
} from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { toast } from 'react-toastify'
import { BiTargetLock } from 'react-icons/bi'
import {
  FiX,
  FiCalendar,
  FiChevronDown
} from 'react-icons/fi'
import {
  RiEyeCloseLine,
  RiEye2Line,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine
} from 'react-icons/ri'
import {
  PlaceOrderFormv2,
  useAuthToken,
  useI18n,
  PrivateRoute
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
import HeaderCheckout from 'components/Header/HeaderCheckout'
import Stepper from 'components/Stepper'
import OrderSummaryBox from 'components/OrderSummaryBox'
import Popup from 'components/Popup'
import Loader from 'components/Loader/Loader'
import LoaderPages from 'components/Loader/LoaderPages'
/* styles */
import styleForm from 'public/scss/components/Form.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'
import styleMap from 'public/scss/components/Map.module.scss'
import stylePassword from 'public/scss/components/Password.module.scss'
import stylePlaceorder from 'public/scss/pages/Placeorder.module.scss'
import styleDatePicker from 'public/scss/components/DatePicker.module.scss'

const placeOrderClasses = {
  billingAddressHeaderClassName: stylePlaceorder.placeorder_header,
  billingAddressLabelClassName: stylePlaceorder.placeorder_formError,
  errorMessageClassName: stylePlaceorder.placeorder_formError__label,
  checkoutAsMemberClassName: stylePlaceorder.placeorder_header__label,
  loginLabelClassName: stylePlaceorder.placeorder_header__login,
  signupContainerClassName: stylePlaceorder.placeorder_labelRegister,
  // form
  formGroupClassName: `${styleForm.form} mb-3`,
  passwordInputContainerClassName: stylePassword.password_passwordContainer,
  // date picker
  datePickerInputClassName: styleDatePicker.datePicker,
  // shipping
  shippingCheckboxContainerClassName: stylePlaceorder.placeorder_shipping,
  shippingCheckboxTitleClassName: 'd-none',
  shippingCheckboxClassName: stylePlaceorder.placeorder_shipping__checkbox,
  shippingCheckboxLabelClassName: stylePlaceorder.placeorder_shipping__label,
  // password
  passwordStrengthBarContainerClassName: stylePassword.password,
  passwordStrengthBarClassName: stylePassword.password_bar,
  passwordStrengthLabelClassName: stylePassword.password_label,
  passwordCriteriaListClassName: `${stylePassword.password_criteria} d-none`,
  // map
  mapNoteClassName: "d-none",
  mapAreaClassName: styleMap.map_mapArea,
  mapPopupClassName: styleMap.map_mapPopup,
  mapPopupBackgroundClassName: styleMap.map_mapPopupContainer,
  mapPinPointIconClassName: styleMap.map_mapPinPointIcon,
  mapClassName: styleMap.map_mapPopupMaps,
  mapHeaderWrapperClassName: styleMap.map_mapPopupHeader,
  mapHeaderTitleClassName: styleMap.map_mapPopupHeaderTitle,
  mapHeaderCloseButtonClassName: styleMap.map_mapPopupClose,
  mapLabelAddressClassName: styleMap.map_mapPopupLabelAddress,
  mapButtonFooterClassName: `${styleButton.btn} ${styleButton.btn_primary} ${styleMap.map_btn}`,

  // place order v2
  shippingAreaPopupClassName: stylePlaceorder.placeorder_shippingAreaPopup,
  shippingAreaPopupBackgroundClassName: stylePlaceorder.placeorder_shippingAreaPopupBackground,
  shippingAreaPopupHeaderClassName: stylePlaceorder.placeorder_shippingAreaPopupHeader,
  shippingAreaTitleClassName: stylePlaceorder.placeorder_shippingAreaTitle,
  shippingAreaCloseButtonClassName: stylePlaceorder.placeorder_shippingAreaCloseButton,
  addressMapButtonMapContainerClassName: stylePlaceorder.placeorder_addressMapButtonMapContainer,
  addressMapButtonMapLabelClassName: stylePlaceorder.placeorder_addressMapButtonMapLabel,
  addressMapButtonMapButtonClassName: stylePlaceorder.placeorder_addressMapButtonMapButton,
  addressPopupButtonClassName: `${styleButton.btn} ${styleButton.btn_primary} ${stylePlaceorder.placeorder_addressPopupButton}`,
  mapSelectAreaClassName: styleMap.map_btnLocation,
  mapSelectAreaSpanClassName: styleMap.map_mapSelectAreaSpan,
  formClassName: styleForm.form_outer,

  // map form
  mapContainerClassName: styleMap.map_mapContainer,
  mapAddressContainerClassName: styleMap.map_mapAddressContainer,
  mapFullAddressClassName: styleMap.map_mapFullAddress,
  mapCityClassName: styleMap.map_mapCity,
  mapPostCodeClassName: styleMap.map_mapPostCode,
  mapChangeAddressButtonClassName: styleMap.map_mapChangeAddressButton,

  // map pop up
  mapSearchBarContainerClassName: styleMap.map_mapSearchBarContainer,
  mapSearchCloseButtonClassName: styleMap.map_mapSearchCloseButton,
  mapSearchBarClassName: styleMap.map_mapSearchBar,
  mapSearchBarInputClassName: styleMap.map_mapSearchBarInput,
  mapCenterButtonContainerClassName: styleMap.map_mapCenterButtonContainer,
  mapCenterButtonClassName: styleMap.map_mapPopupCenterButton,
  mapFooterContainerClassName: styleMap.map_mapFooterContainer,
  mapDistrictLabelClassName: styleMap.map_mapDistrictLabel,
  mapButtonFooterContainerClassName: styleMap.map_mapButtonFooterContainer,
  mapButtonInputManualContainerClassName: styleMap.map_mapButtonInputManualContainer,
  mapButtonInputManualTitleClassName: styleMap.map_mapButtonInputManualTitle,
  mapButtonInputManualButtonClassName: styleMap.map_mapButtonInputManualButton,
}

type PrivateComponentPropsType = {
  children: ReactNode
}

const PrivateRouteWrapper = ({ children }: PrivateComponentPropsType) => (
  <PrivateRoute
    page='place_order'
    loadingComponent={<LoaderPages />}
    redirectCart='products'
  >
    {children}
  </PrivateRoute>
)

const PlaceOrderPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const [showModalErrorAddToCart, setShowModalErrorAddToCart] = useState<boolean>(false)

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
          title={i18n.t('placeOrder.userInformation')}
          step={1}
        />
        <div className={stylePlaceorder.placeorder}>
          <PlaceOrderFormv2
            classes={{
              ...placeOrderClasses,
            }}
            onErrorMsg={(msg) => toast.error(msg)}
            passwordViewIcon={<RiEyeCloseLine />}
            passwordHideIcon={<RiEye2Line />}
            passwordFulfilledCriteriaIcon={<RiCheckboxCircleFill color="#53B671" size={10} />}
            passwordUnfulfilledCriteriaIcon={<RiCheckboxCircleLine color="#BCBCBC" size={10} />}
            datePickerCalendarIcon={<FiCalendar color="#444444" />}
            mapButtonCloseIcon={<FiX color="#444444" size={20} />}
            mapCenterIcon={<BiTargetLock color="#444444" size={20} />}
            loadingComponent={<Loader />}
            logistixStyles={{
              menu: (provided) => ({ ...provided, zIndex: 3, marginTop: '1px' }),
              control: (provided,state) => ({
                ...provided,
                borderRadius: '37px',
                height: '58px',
                padding: '0 21px',
                width: '100%',
                paddingTop: '16px',
                border: state.isFocused ? '1px solid #998060':'1px solid #E8E8E8',
                boxShadow: 'none',
              }),
              singleValue: (provided) => ({ ...provided, marginRight: '0', marginLeft: '-8px' }),
              input: (provided) => ({ ...provided, marginRight: '0', marginLeft: '-8px' }),
              indicatorsContainer: (provided) => ({ ...provided, display: 'none' }),
            }}
            fieldPhoneNumberProps={{
              name: 'phone_number',
              dropdownIcon: <FiChevronDown color="#2F69FD" size={'14'} />,
              selectedImgOptionHeight: '24px',
              classes: {
                fieldContainerClassName: styleForm.formPhoneContainer,
                selectCountryContainerClassName:
                  styleForm.formPhone_inputGroupAddOn,
                selectCountryFlagClassName:
                  styleForm.formPhone_selectCountryFlag,
                dropdownListContainerClassName:
                  styleForm.formPhone_dropdownListContainer,
                dropdownListClassName: styleForm.formPhone_dropdownList,
                countryOptionClassName: styleForm.formPhone_countryOption,
                countryFlagClassName: 'phone-countryFlag',
                countryNameClassName: 'phone-countryName',
                dialCodeClassName: styleForm.formPhone_dialCode,
                inputFieldPhoneClassName: styleForm.formPhone_input,
              },
            }}
            signupLabelPosition='bottom'
          />
          <OrderSummaryBox
            i18n={i18n}
            lng={lng}
            page='place_order'
            withCartDetails
          />
        </div>
        <Popup
          withHeader={false}
          visibleState={showModalErrorAddToCart}
          setVisibleState={setShowModalErrorAddToCart}
          outsideClose={false}
        >
          <>
            <div className={stylePlaceorder.placeOrder_popupTitle}>
              <h3>
                {i18n.t('product.tryAgain')}
              </h3>
            </div>
            <div className={stylePlaceorder.placeOrder_popupContent}>
              <p className={stylePlaceorder.placeOrder_popupDesc}>
                {i18n.t('cart.errorSKUDesc')}
              </p>
            </div>
            <button
              className={`${stylePlaceorder.btn} ${stylePlaceorder.btn_primary}`}
              onClick={() => setShowModalErrorAddToCart(false)}
            >
              {i18n.t('product.tryAgain')}
            </button>
          </>
        </Popup>
      </Layout>
    </PrivateRouteWrapper>
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

export default PlaceOrderPage
