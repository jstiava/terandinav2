import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type AccessCheck = (args: AccessArgs<User>) => boolean

export const authenticated: AccessCheck = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAdmin: AccessCheck = ({ req: { user } }) => {
  try {
    if (user?.role == 'admin') {
      return true;
    }
    return false
  }
  catch (err) {
    return false;
  }
}
