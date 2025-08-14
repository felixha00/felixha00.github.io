import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<typeof Avatar>

const GithubAvatar = (props: Props) => {
    return (
        <Avatar {...props}>
            <AvatarImage
                src="https://avatars.githubusercontent.com/u/51464337?v=4"
                alt="Felix Ha"
            />
            <AvatarFallback>FH</AvatarFallback>
        </Avatar>
    )
}

export default GithubAvatar
