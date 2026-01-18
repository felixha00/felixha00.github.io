import { Button } from '@radix-ui/themes'
import React, { useState } from 'react'
import { LuMenu } from 'react-icons/lu'
import { TextScramble } from './motion-primitives/TextScramble'

type Props = {}

const Sidebar = (props: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Button variant='classic' color='gray' highContrast radius='none' className='font-mono! uppercase' onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <TextScramble duration={0.4} trigger={isHovered}
            >MENU</TextScramble>
            <LuMenu />
        </Button>
    )
}

export default Sidebar