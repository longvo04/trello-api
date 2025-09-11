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

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'board'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

export const WEBSITE_DOMAIN = env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PROD : env.WEBSITE_DOMAIN_DEV

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
