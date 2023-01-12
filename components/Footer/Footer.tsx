/* library package */
import { FC } from 'react'
import { toast } from 'react-toastify'
import {
	useI18n,
  Widget,
  NewsletterForm,
  SocialMediaIcons
} from '@sirclo/nexus'
import { 
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube
 } from 'react-icons/fa'
 import Placeholder from 'components/Placeholder'
 /* library template */
import useWindowSize from 'lib/useWindowSize'
/* styles */
import styleFooter from 'public/scss/components/Footer.module.scss'
import stylePlaceholder from 'public/scss/components/Placeholder.module.scss'
import styleWidget from 'public/scss/components/Widget.module.scss'
import styleIcons from 'public/scss/components/SocialMediaIcons.module.scss'

const classesPlaceholderWidgetService = {
  placeholderImage: `${stylePlaceholder.placeholderItem} ${stylePlaceholder.placeholderItem_widgetService}`,
}

const classesPlaceholderWidget = {
  placeholderTitle: "placeholder-item placeholder-item__footer--widget-title",
  placeholderList: "placeholder-item placeholder-item__footer--widget-list"
}

const classesNewsletter = {
  containerClassName: styleWidget.widget_footerNewsletterForm,
  labelClassName: "label",
  inputClassName: "input",
  buttonClassName: "btn btn-block btn-newsletter",
};

const socialMediaIcons = {
  facebook: <FaFacebookF color='#998060' height="1em" />,
  twitter: <FaTwitter color='#998060' height="1em" />,
  instagram: <FaInstagram color='#998060' height="1em" />,
  youtube: <FaYoutube color='#998060' height="1em" />,
  tiktok: <FaTiktok color='#998060' height="1em" />,
};

const classesMediaSocial = {
  socialMediaIconContainer: styleIcons.socialMediaIcons_container,
  socialMediaIcon: styleIcons.socialMediaIcons_item,
};

const Footer: FC<any> = () => {
	const i18n: any = useI18n()
	const size = useWindowSize()

	const WidgetLinks = ({
    pos,
    size
  }) => (
    <Widget
      pos={pos}
      widgetClassName={styleWidget.widget_ContainerLink}
      thumborSetting={{
        width: size.width < 768 ? 100 : 200,
        format: "webp",
        quality: 85,
      }}
      loadingComponent={
        <div className={styleWidget.widget_ContainerLink}>
          <Placeholder classes={classesPlaceholderWidget} withTitle withList />
        </div>
      }
    />
  )

	return (
		<>
			<footer className={styleFooter.footer}>
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
				<div className={styleWidget.widget_footerNewsletter}>
					<h6>{i18n.t("footer.newsletter")}</h6>
					<p>{i18n.t("footer.newsletterDesc")}</p>
					<NewsletterForm
						classes={classesNewsletter}
						buttonComponent={<>{i18n.t("footer.subscribe")}</>}
						onComplete={() => toast.success(i18n.t("footer.submitSuccess"))}
						onError={() => toast.error(i18n.t("footer.submitError"))}
					/>
      	</div>
				<div className={styleWidget.widget_footerBottom}>
					<Widget
						pos="main-footer"
						widgetClassName={styleWidget.widget_Container}
					/>
					<SocialMediaIcons
						socialMediaIcons={socialMediaIcons}
						classes={classesMediaSocial}
					/>
					<div className={styleWidget.widget_footerLink}>
						<WidgetLinks
								pos="footer-2"
								size={size}
							/>
						<WidgetLinks
							pos="footer-3"
							size={size}
						/>
						<WidgetLinks
							pos="footer-4"
							size={size}
						/>
					</div>
				</div>
			</footer>
		</>
	)
}

export default Footer
