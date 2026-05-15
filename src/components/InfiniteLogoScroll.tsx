import React from 'react'
import { InfiniteSlider } from './motion-primitives/InfiniteSlider'
import Image from 'next/image'

const logos = Array.from({ length: 7 }, (_, index) => index)

const InfiniteLogoScroll = () => {
    return (
        <InfiniteSlider gap={12} speedOnHover={20} className='w-full'>
            {logos.map((logo) => (
                <Image
                    key={logo}
                    src="/logo-white.svg"
                    priority
                    width={120}
                    height={120}
                    alt=""
                />
            ))}
        </InfiniteSlider>
    )
}

export default InfiniteLogoScroll
