import Checkout from '@/components/website/Checkout'
import { getProfile } from '@/utils/api'
import React from 'react'

export default async function page() {
  const user = await getProfile();
 
  return (
    <Checkout user={user.data}/>
  )
}
