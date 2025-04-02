import Image from 'next/image'
import Link from 'next/link'
import {ReactNode} from 'react'

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='root-layout'>
        <nav>
            <Link href='/' className='flex items-center gap-2'>
                <Image src="/logo.svg" alt='Logo' width={27} height={30}/>
                <h2 className='text-primary-100'>AiView</h2>
            </Link>
        </nav>
        {children}
    </div>
  )
}

export default RootLayout