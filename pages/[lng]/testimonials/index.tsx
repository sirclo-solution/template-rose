/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Testimonials,
  TestimonialForm,
  isTestimonialAllowed,
  isTestimonialFormAllowed,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { useBrand } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
import Placeholder from 'components/Placeholder'
import Popup from 'components/Popup'
/* styles */
import styles from 'public/scss/pages/Testimonials.module.scss'

const classesTestimonials = {
  containerClassName: `${styles.testimonials_container}`,
  cardClassName: `${styles.testimonials_card}`,
  imgClassName: `${styles.testimonials_img}`,
  mainClassName: `${styles.testimonials_main}`,
  contentClassName: `${styles.testimonials_content}`,
  userClassName: `${styles.testimonials_user}`,
  dateClassName: `${styles.testimonials_date}`,
}

const classesTestimonalsForm = {
  backdropClassName: "d-none",
  testimonialHeaderClassName: "d-none",
  formContainerClassName: styles.testimonials_form,
  inputContainerClassName: `${styles.sirclo_form_row}`,
  inputClassName: `form-control ${styles.sirclo_form_input}`,
  imgUploadContainerClassName: `${styles.sirclo_form_row}`,
  imgUploadClassName: `form-control ${styles.sirclo_form_input}`,
  uploadIconClassName: "d-block",
  publishOptionClassName: styles.testimonials_formPublishOption,
  optionClassName: "mt-2",
  verificationContainerClassName: "mb-4",
  submitBtnClassName: `${styles.btn} ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width}`,
}

const paginationClasses = {
  pagingClassName: styles.pagination,
  activeClassName: styles.pagination_active,
  itemClassName: styles.pagination_item,
}

const classesPlaceholderTestimonials = {
  placeholderList: `${styles.testimonials_placeholder}`,
  placeholderImage: `${styles.testimonials_placeholderImage}`
}

const TestimonialsPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router: any = useRouter()
  const testimonialAllowed = isTestimonialAllowed()
  const testimonialFormAllowed = isTestimonialFormAllowed()

  const [totalItem, setTotalItems] = useState<number>(null)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)

  const toggleShowAdd = () => setShowAdd(!showAdd)

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    SEO: {
      title: i18n.t("testimonial.title")
    },
    withAllowed: testimonialAllowed
  }

  return (
    <Layout {...layoutProps}>
      <div className={`${styles.testimonials} container`}>
        <div className={styles.testimonials_header}>
          <h4>{i18n.t("testimonial.title")}</h4>
          {totalItem > 0 && <p>{i18n.t("testimonial.desc")}</p>}
        </div>
        {!(totalItem > 0 || totalItem === null) ?
          <>
            <div className={styles.testimonials_qtyAdd}>
              <p>
                {i18n.t("testimonial.weHave")}
                <strong>{totalItem}</strong>
                {i18n.t("testimonial.weHave2")}
              </p>
              <button
                className={styles.testimonials_qtyAddButton}
                onClick={toggleShowAdd}
              >
                {i18n.t("testimonial.add")}
              </button>
            </div>
            <div className={styles.testimonials_list}>
              <Testimonials
                itemPerPage={5}
                getPageInfo={(pageInfo: any) => setTotalItems(pageInfo.totalItems)}
                withImage
                classes={classesTestimonials}
                callPagination
                paginationClasses={paginationClasses}
                loadingComponent={
                  [1, 2, 3].map((_, i) => (
                    <div className={styles.testimonials_placeholderContainer}>
                      <Placeholder
                        key={i}
                        classes={classesPlaceholderTestimonials}
                        withImage={true}
                        withList
                        listMany={3}
                      />
                    </div>
                  ))
                }
              />
            </div>
          </> :
          <div className={styles.testimonials_empty}>
            <p>{i18n.t("testimonial.isEmpty")}</p>
            <a
              className={`${styles.testimonials_emptyAddButton} ${styles.btn_primary} ${styles.btn_long}`}
              onClick={toggleShowAdd}
            >
              {i18n.t("testimonial.add")}
            </a>
            <a
              className={`${styles.testimonials_backButton} ${styles.btn_long}`}
              onClick={() => router.push(`/[lng]/products`, `/${lng}/products`)}
            >
              {i18n.t("product.back")}
            </a>
          </div>
        }
        {(showAdd && testimonialFormAllowed) &&
          <Popup
            withHeader
            visibleState={showAdd}
            setVisibleState={setShowAdd}
            outsideClose={false}
          >
            <TestimonialForm
              classes={classesTestimonalsForm}
              uploadIcon={i18n.t("testimonial.inputImage")}
              onUploadImageCompleted={() => toast.success(i18n.t("testimonial.successUpload"))}
              onUploadImageError={(error: any) => toast.error(error)}
              onCreateTestimonialCompleted={(_) => {
                setShowAdd(false)
                toast.success(i18n.t('testimonial.createSuccess'))
              }}
              onCreateTestimonialError={(_) => toast.error(i18n.t('testimonial.createError'))}
              withVerification={true}
              isVerified={isVerified}
              verificationComponent={
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPTCHA}
                  onChange={() => setIsVerified(true)}
                />
              }
            />
          </Popup>
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

export default TestimonialsPage