import React from 'react'

interface IconeFecharProps extends React.SVGProps<SVGSVGElement> {

}

export const IconeFechar = ({ ...rest }: IconeFecharProps) => {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest} className="cursor-pointer">
            <path d="M8.52323 7.47803L14.0632 13.018V14.478H12.6032L7.06323 8.93803L1.52323 14.478H0.0632324V13.018L5.60323 7.47803L0.0632324 1.93803V0.478027H1.52323L7.06323 6.01803L12.6032 0.478027H14.0632V1.93803L8.52323 7.47803Z" fill="white" />
        </svg>
    )
}