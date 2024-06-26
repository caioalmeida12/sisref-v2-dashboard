import React from 'react'

interface IconeMenuProps extends React.SVGProps<SVGSVGElement> {

}

export const IconeMenu = ({...rest}: IconeMenuProps) => {
    return (
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest} className="cursor-pointer">
            <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="white" />
        </svg>
    )
}