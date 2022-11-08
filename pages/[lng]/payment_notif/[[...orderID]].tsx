/* Library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import {
  HiChevronUp,
  HiChevronDown
} from 'react-icons/hi'
import {
  PaymentConfirmation,
  BanksAccount,
  CheckPaymentOrder,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* Library Template */
import { useBrand } from 'lib/useBrand'
/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Loader from 'components/Loader/Loader'
/* Styles */
import styleOrderDetail from 'public/scss/components/OrderDetail.module.scss'
import styleBankAccount from 'public/scss/components/BankAccount.module.scss'
import styleCheckPayment from 'public/scss/components/CheckPayment.module.scss'
import styleForm from 'public/scss/components/Form.module.scss'
import styleBtn from 'public/scss/components/Button.module.scss'
import styles from 'public/scss/pages/PaymentNotif.module.scss'

const classesPaymentConfirmation = {
  paymentConfirmationDivClassName: styles.paymentNotif_form,
  labelClassName: styles.paymentNotif_label,
  inputContainerClassName: `${styleForm.form} ${styles.paymentNotif_formInput}`,
  inputClassName: styles.paymentNotif_input,
  selectClassName: styles.paymentNotif_select,
  buttonConfirmClassName: `${styleBtn.btn} ${styleBtn.btn_primary}`,
  paymentInfoUploadClassName: styles.paymentNotif_infoUpload,
  // uploaded image
  uploadedImageClassName: styles.paymentNotif_uploadedImage,
  uploadedNameImageClassName: styles.paymentNotif_uploadedNameImage,
  uploadedRemoveImageClassName: styles.paymentNotif_uploadedRemoveImage,
  // Detail
  paymentStatusCancelledClassName: styleOrderDetail.orderDetail_statusCancelled,
  paymentStatusReturnedClassName: styleOrderDetail.orderDetail_statusCancelled,
  detailContainerClassName: `${styleOrderDetail.orderDetail} ${styles.paymentNotif_order}`,
  detailHeaderClassName: styleOrderDetail.orderDetail_header,
  detailTitleClassName: styleOrderDetail.orderDetail_headerTitle,
  detailStatusClassName: styleOrderDetail.orderDetail_status,
  detailContentClassName: styleOrderDetail.orderDetail_content,
  detailHeaderDropdownClassName: styleOrderDetail.orderDetail_contentHeader,
  detailTotalAmountClassName: styleOrderDetail.orderDetail_contentTotalAmount,
  detailDropdownClassName: styleOrderDetail.orderDetail_contentDropdown,
  detailBodyDropdownClassName: styleOrderDetail.orderDetail_body,
  detailItemClassName: styleOrderDetail.orderDetail_item,
  detailItemImgClassName: styleOrderDetail.orderDetail_itemImage,
  detailItemLabelClassName: styleOrderDetail.orderDetail_itemLabel,
  detailItemPriceClassName: styleOrderDetail.orderDetail_itemPrice,
  detailPriceBreakdownClassName: styleOrderDetail.orderDetail_breakdown,
  detailFieldClassName: styleOrderDetail.orderDetail_breakdownField,
  detailTotalFieldClassName: styleOrderDetail.orderDetail_breakdownTotal
}

const classesBanksAccount = {
  bankAccountInformationClassName: styles.paymentNotif_paymentInfo,
  bankAccountContainerClassName: styleBankAccount.bankAccount_container,
  bankAccountSectionClassName: styleBankAccount.bankAccount_section,
  bankAccountHeaderClassName: styleBankAccount.bankAccount_header,
  bankAccountTitleSectionClassName: styleBankAccount.bankAccount_titleSection,
  bankAccountLogoClassName: styleBankAccount.bankAccount_logo,
  bankAccountTitleClassName: styleBankAccount.bankAccount_title,
  bankAccountIconCollapseClassName: styleBankAccount.bankAccount_iconCollapse,
  bankAccountBodyClassName: styleBankAccount.bankAccount_body,
  bankAccountInfoAccountClassName: styleBankAccount.bankAccount_infoAccount,
  bankAccountNumberSectionClassname: styleBankAccount.bankAccount_accountNumber,
  bankAccountLabelAccountNumberClassName: styleBankAccount.bankAccount_labelAccount,
  bankAccountLabelAccountNameClassName: styleBankAccount.bankAccount_labelAccountName,
  bankAccountCopyButtonClassName: `btn ${styleBankAccount.bankAccount_copyButtonIcon}`,
}

const classesCheckPaymentOrder = {
  checkPaymentOrderContainerClassName: styleCheckPayment.checkPayment,
  checkPaymentOrderDescriptionClassName: styleCheckPayment.checkPayment_desc,
  checkPaymentOrderInputContentClassName: `${styleForm.form} ${styles.paymentNotif_formInput}`,
  checkPaymentOrderInputTitleClassName: styleCheckPayment.checkPayment_inputLabel,
  checkPaymentOrderInputClassName: styleCheckPayment.checkPayment_input,
  checkPaymentOrderSubmitButtonClassName: `${styleBtn.btn} ${styleBtn.btn_primary}`
}

const PaymentConfirmationPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router = useRouter()
  let orderID = ""

  if (router.query.orderID) {
    orderID = router.query.orderID.toString()
  }

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    withFooter: false,
    withCopyright: true,
    headerTitle: orderID ? i18n.t('paymentConfirm.heading') : i18n.t('paymentConfirm.checkOrder'),
    layoutClassName: 'layout_fullHeight',
    SEO: {
      title: i18n.t("paymentNotif.title")
    }
  }

  return (
    <Layout {...layoutProps}>
      <div className={styles.paymentNotif_container}>
        <Breadcrumb
          steps={[
            { label: i18n.t('breadcrumb.home') },
            { label: orderID ? i18n.t('paymentConfirm.heading') : i18n.t("paymentConfirm.checkOrder") }
          ]}
        />
        {orderID ?
          <PaymentConfirmation
            orderIDProps={orderID}
            classes={classesPaymentConfirmation}
            withOrderDetails
            onErrorMsg={(msg) => toast.error(msg)}
            onSuccessMsg={(msg) => toast.success(msg)}
            loadingComponent={<Loader />}
            errorComponent={<div>{i18n.t("global.error")}</div>}
            orderDetailIcon={{
              chevronUp: <HiChevronUp size={20} color="#3677C3" />,
              chevronDown: <HiChevronDown size={20} color="#3677C3" />
            }}
            thumborSetting={{
              width: 40,
              format: "webp",
              quality: 85
            }}
            children={
              <BanksAccount
                classes={classesBanksAccount}
                onSuccessMsg={(msg) => toast.success(msg)}
                icon={{
                  chevronUp: <HiChevronUp size={20} color="#3677C3" />,
                  chevronDown: <HiChevronDown size={20} color="#3677C3" />
                }}
              />
            }
          /> :
          <>
            <CheckPaymentOrder
              classes={classesCheckPaymentOrder}
              onErrorMsg={(msg: string) => toast.error(msg)}
              withCloseButton={false}
              icon={{
                loading: <Loader color="text-light" />,
              }}
            />
            <BanksAccount
              classes={classesBanksAccount}
              onSuccessMsg={(msg) => toast.success(msg)}
              icon={{
                chevronUp: <HiChevronUp size={20} color="#3677C3" />,
                chevronDown: <HiChevronDown size={20} color="#3677C3" />
              }}
            />
          </>
        }
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
      brand: brand || ''
    },
  }
}

export default PaymentConfirmationPage