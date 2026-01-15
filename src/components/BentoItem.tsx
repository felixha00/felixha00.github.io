import React from 'react'

type Props = {
    item: {
        title: string;
    }
}

const BentoItem = (props: Props) => {
    const { item } = props;
    return (
        <div className='p-4 bg-white/10'>
            {item.title}
        </div>
    )
}

export default BentoItem