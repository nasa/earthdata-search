module PortalHelper

  def site_page_title
    result = "#{Rails.configuration.env_name} Earthdata Search"
    result += " :: #{portal['title']} Portal" if portal? && portal['title']
    result
  end

  def site_logo_title
    if portal? && portal['title']
      portal['title']
    else
      'Search'
    end
  end

  def portal_logo?
    portal? && portal['logos'].present?
  end

  def portal_logo
    return nil unless portal_logo?
    portal['logos'].map do |logo|
      link_to(logo['link'], {class: 'portal-logo'}.merge(logo.except('image', 'link'))) do
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
