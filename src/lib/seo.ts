import type { Metadata } from 'next'

const DEFAULT_SITE_URL = 'https://workerzexittw.orka-hw.com'
const DEFAULT_OG_IMAGE = '/logo/workerz-exit_fb.jpg'

export const siteConfig = {
  name: 'WORKERZ EXIT 台灣總代理',
  shortName: 'WORKERZ EXIT 台灣',
  description:
    '日本職人工具品牌 WORKERZ EXIT 台灣總代理。提供工具腰袋、安全護具、EBISU 水平尺與專業現場裝備。',
  locale: 'zh_TW',
  ogImage: DEFAULT_OG_IMAGE,
} as const

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    DEFAULT_SITE_URL

  return configuredUrl.replace(/\/+$/, '')
}

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function truncateDescription(text: string, maxLength = 160) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

type BuildMetadataInput = {
  title?: string
  description?: string
  path?: string
  image?: string | null
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  noIndex = false,
}: BuildMetadataInput = {}): Metadata {
  const resolvedDescription = description || siteConfig.description
  const resolvedImage = image || siteConfig.ogImage
  const absoluteImage = resolvedImage.startsWith('http')
    ? resolvedImage
    : absoluteUrl(resolvedImage)

  return {
    title,
    description: resolvedDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: title || siteConfig.name,
      description: resolvedDescription,
      url: path,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteConfig.name,
      description: resolvedDescription,
      images: [absoluteImage],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
            },
          },
        }
      : {}),
  }
}
