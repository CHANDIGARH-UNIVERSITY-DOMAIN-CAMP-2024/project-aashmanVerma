import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex w-100 h-screen items-center justify-center'>
      <SignIn />
    </div>
  )
}