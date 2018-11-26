module PortalHelper
  def site_page_title(subpage = nil)
    result = 'Earthdata Search'
    result = "#{Rails.configuration.env_name} #{result}" if Rails.configuration.env_name.present?
    result += " - #{subpage}" if subpage.present?
    result += " :: #{site_name}" if portal?
    result
  end

  def site_logo_org
    (portal && portal['org']) || 'Earthdata'
  end

  def site_logo_title
    if portal?
      portal['title'] || portal_id.titleize
    else
      'Search'
    end
  end

  def site_org
    if portal?
      portal['org'] || portal_id.titleize
    else
      'Earthdata Search'
    end
  end

  def site_name
    if portal?
      "#{portal['title'] || portal_id.titleize} Portal"
    else
      'Earthdata Search'
    end
  end

  def portal_logo?
    portal? && portal['logos'].present?
  end

  def portal_logo
    return nil unless portal_logo?
    portal['logos'].map do |logo|
      link_to(logo['link'], { class: 'portal-logo' }.merge(logo.except('image', 'link'))) do
        image_tag(logo['image'])
      end
    end.join('').html_safe
  end

  def portal_nav?
    portal? && portal['nav'].present?
  end

  def portal_nav
    return nil unless portal_nav?

    portal['nav'].map do |link|
      link_to(link['title'], link['link'], link.except('title', 'link'))
    end.join('').html_safe
  end
end
