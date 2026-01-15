import React from 'react'

type Props = {
    item: {
        title: string;
    }
}

const BentoItem = (props: Props) => {
    const { item } = props;
    return (
        <div className='p-4 bg-neutral-800 border border-white/20 h-full flex items-center justify-center text-center relative shadow-2xl'>
            {item.title}
            {/* Top Left */}
            <div className='absolute -top-px -left-px border-t border-l border-white/50 size-2'></div>

            {/* Top Right */}
            <div className='absolute -top-px -right-px border-t border-r border-white/50 size-2'></div>

            {/* Bottom Left */}
            <div className='absolute -bottom-px -left-px border-b border-l border-white/50 size-2'></div>

            {/* Bottom Right */}
            <div className='absolute -bottom-px -right-px border-b border-r border-white/50 size-2'></div>
        </div>
    )
}

export default BentoItem