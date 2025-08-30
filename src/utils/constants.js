import { env } from '~/config/environment'

// export const WHITELIST_DOMAINS = ['http://localhost:5173']
export const WHITELIST_DOMAINS = [
  'https://trello-web-omega-flame.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client'
}

export const WEBSITE_DOMAIN = env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PROD : env.WEBSITE_DOMAIN_DEV
