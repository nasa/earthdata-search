import type { HtmlTagDescriptor, Plugin } from 'vite'
import getHeroImageSrcSet from './getHeroImageSrcSet'

// This plugin is used to inject a preload link for the home page hero image into the index.html file.
// The hero image is converted to a webp image and scaled to different sizes using the vite-imagetools plugin.
export const preloadImagePlugin = (): Plugin => ({
  name: 'inject-preload-images',
  async transformIndexHtml(html, context) {
    // Find the webp hero images in the bundle
    const preloadImagePaths = Object.keys(context.bundle || {}).filter((key) => key.startsWith('assets/MODIS-Terra-Swirling-Clouds-In-Atlantic'))

    // If no images are found, return the original html
    if (preloadImagePaths.length === 0) {
      return html
    }

    const { preloadSrcSet, preloadSizes } = getHeroImageSrcSet(preloadImagePaths)
    const link: HtmlTagDescriptor = {
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'image',
        href: preloadImagePaths[0],
        imagesrcset: preloadSrcSet,
        imagesizes: preloadSizes
      },
      injectTo: 'head'
    }

    return {
      html,
      tags: [link]
    }
  }
})
