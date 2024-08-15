import React from 'react';
import { IIconeFecharProps, IIconeInformacaoProps, IIconeMenuProps, IIconeRefeicaoProps, IIconeSetaProps, IIconeStatusProps } from '../interfaces/IIcones';
import { CaretDownIcon } from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';

import classnames from 'classnames';

const Icone = ({ children }: { children: React.ReactNode }) => children;

Icone.Aviso = () => (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10.5H11.5789L5.78947 0.5L0 10.5ZM6.31579 8.92105H5.26316V7.86842H6.31579V8.92105ZM6.31579 6.81579H5.26316V4.71053H6.31579V6.81579Z" fill="white" />
    </svg>
);

Icone.Dropdown = () => (
    <CaretDownIcon
        className="relative top-[1px] transition-transform ease-in-out group-data-[state=open]:-rotate-180 stroke-branco-400 stroke-1"
        aria-hidden />
);

Icone.Fechar = (props: IIconeFecharProps) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="Fechar" xmlns="http://www.w3.org/2000/svg" {...props} className={classnames('cursor-pointer', props.className)}>
        <path d="M8.52323 7.47803L14.0632 13.018V14.478H12.6032L7.06323 8.93803L1.52323 14.478H0.0632324V13.018L5.60323 7.47803L0.0632324 1.93803V0.478027H1.52323L7.06323 6.01803L12.6032 0.478027H14.0632V1.93803L8.52323 7.47803Z" fill="white" />
    </svg>
);

Icone.Informacao = (props: IIconeInformacaoProps) => (
    <div className="w-min">
        <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button name='Ver mais informações'>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={(props.cor && `fill-${props.cor}`) || "fill-vermelho-400"}>
                            <path d="M6.6 4.2H5.4V3H6.6M6.6 9H5.4V5.4H6.6M6 0C5.21207 0 4.43185 0.155195 3.7039 0.456723C2.97595 0.758251 2.31451 1.20021 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.31451 10.7998 2.97595 11.2417 3.7039 11.5433C4.43185 11.8448 5.21207 12 6 12C7.5913 12 9.11742 11.3679 10.2426 10.2426C11.3679 9.11742 12 7.5913 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 0 6 0Z" />
                        </svg>
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="bg-branco-400 border data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                        sideOffset={5}
                    >
                        <div>{props.texto}</div>
                        <Tooltip.Arrow className="fill-branco-400" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    </div>
);

Icone.Logout = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1111 3.11111L11.0145 4.20778L13.0211 6.22222H5.11112V7.77778H13.0211L11.0145 9.78444L12.1111 10.8889L16 7M2.00001 1.55556H8.22224V0H2.00001C1.14446 0 0.444458 0.7 0.444458 1.55556V12.4444C0.444458 13.3 1.14446 14 2.00001 14H8.22224V12.4444H2.00001V1.55556Z" fill="white" />
    </svg>
);

Icone.Menu = (props: IIconeMenuProps) => (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} className="cursor-pointer">
        <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="white" />
    </svg>
);

Icone.Refeicao = (props: IIconeRefeicaoProps) => {
    switch (props.variante) {
        case 'manha':
            return (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.25 8.188a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1 0-1.5zm0-1.126h-1.193a4.2 4.2 0 0 0 0-1.5h1.193a.75.75 0 0 1 0 1.5m-9.307 0H.75a.75.75 0 0 1 0-1.5h1.193a4.2 4.2 0 0 0 0 1.5M3 6.313q.001.39.095.75h5.81Q9 6.703 9 6.313a3 3 0 0 0-6 0m-.315-4.11.823.823c-.401.305-.745.68-1.012 1.11l-.871-.872a.75.75 0 1 1 1.06-1.06M10.11 3l-.823.823a4.2 4.2 0 0 0-1.109-1.012l.871-.872a.75.75 0 1 1 1.061 1.06M6.75 1.062a.75.75 0 0 0-1.5 0v1.194a4.2 4.2 0 0 1 1.5 0z" fill="#000" />
                </svg>
            );
        case 'almoco':
            return (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6" fill="#000" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.75 6A.75.75 0 0 0 2 5.248h-.75a.75.75 0 1 0 0 1.5H2A.75.75 0 0 0 2.75 6m.038 2.65-.53.532a.75.75 0 1 0 1.06 1.06l.531-.53A.75.75 0 1 0 2.79 8.65m3.71 1.1a.75.75 0 0 0-.75.75v.75a.75.75 0 1 0 1.501 0v-.75a.75.75 0 0 0-.75-.75m3.711-1.098a.748.748 0 1 0-1.06 1.06l.53.53a.75.75 0 1 0 1.06-1.06zm1.539-3.403L11 5.251a.747.747 0 0 0-.749.748.75.75 0 0 0 .749.75h.75A.75.75 0 0 0 12.5 6a.75.75 0 0 0-.749-.75m-1.539-1.902.53-.53a.75.75 0 0 0 0-1.061.75.75 0 0 0-1.06 0l-.53.531a.75.75 0 0 0 0 1.06.75.75 0 0 0 1.06 0M6.5 2.249a.75.75 0 0 0 .751-.749V.75a.75.75 0 0 0-.75-.75.747.747 0 0 0-.75.749l.001.751a.747.747 0 0 0 .749.749M2.79 3.347a.747.747 0 0 0 1.059 0 .747.747 0 0 0 .001-1.06l-.53-.53a.75.75 0 0 0-1.061 0 .747.747 0 0 0-.002 1.06z" fill="#000" />
                </svg>
            );
        case 'tarde':
            return (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7 1a.5.5 0 0 0-.5.5v2.001l-.65-.65a.5.5 0 0 0-.707.707l1.15 1.15a1 1 0 0 0 1.413 0l1.149-1.15a.5.5 0 0 0-.707-.706L7.5 3.5v-2A.5.5 0 0 0 7 1Zm2.498 7.545.002-.04A2.5 2.5 0 0 0 7.021 6 2.5 2.5 0 0 0 4.5 8.5.5.5 0 0 0 5 9h4a.5.5 0 0 0 .498-.455Z" fill="#000" stroke="#000" strokeWidth=".25" />
                    <path d="M1.5 9a.5.5 0 1 1 0-1H3a.5.5 0 1 1 0 1zm1.257-4.743a.5.5 0 0 0 0 .707l1.061 1.061a.5.5 0 0 0 .707-.707l-1.06-1.06a.5.5 0 0 0-.708 0ZM11 9a.5.5 0 0 1 0-1h1.5a.5.5 0 0 1 0 1zM9.475 6.025a.5.5 0 0 0 .707 0l1.06-1.06a.5.5 0 0 0-.707-.708l-1.06 1.061a.5.5 0 0 0 0 .707ZM1 10.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5Z" fill="#000" stroke="#000" strokeWidth=".25" />
                </svg>
            );
        case 'noite':
            return (
                <svg width="14" height="12" viewBox="-2 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.06 6.042C4.662 3.336 5.76.954 6.378 0a6 6 0 0 0-5.79 5.994c0 .084.012.168.012.252a2.986 2.986 0 0 1 3.66 1.038A2.406 2.406 0 0 1 6 9.594c0 .912-.522 1.698-1.272 2.106a6.004 6.004 0 0 0 6.888-2.412c-1.416.138-4.188-.582-5.556-3.246" fill="#000" />
                    <path d="M3.6 8.394h-.108a1.81 1.81 0 0 0-1.692-1.2c-.996 0-1.8.804-1.8 1.8s.804 1.8 1.8 1.8h1.8c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2" fill="#000" />
                </svg>
            );
        default:
            return null;
    }
};

Icone.RestricaoAlimentar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M5.73375 4.03226L5.5455 2.15054H8.23487V0H9.31062V2.15054H12L11.2577 9.56452L5.73375 4.03226ZM0.166741 10.7527V11.2903C0.166741 11.586 0.408785 11.828 0.704617 11.828H7.697C7.99283 11.828 8.23487 11.586 8.23487 11.2903V10.7527H0.166741ZM11.4083 11.2366L0.758404 0.591398L0 1.34409L3.06589 4.41398C1.3931 4.76882 0.166741 5.91398 0.166741 7.52688H6.17481L7.25056 8.60215H0.166741V9.67742H8.23487V9.58602L10.6553 12L11.4083 11.2366Z" fill="black" />
    </svg>
);

Icone.Seta = (props: IIconeSetaProps) => {
    const getRotacao = (direcao: string) => {
        switch (direcao) {
            case 'cima':
                return 'rotate-90';
            case 'baixo':
                return 'rotate-270';
            case 'direita':
                return 'rotate-180';
            case 'esquerda':
            default:
                return '';
        }
    };

    return (
        <svg {...props} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`cursor-pointer ${getRotacao(props.direcao)} ${(props.fill || "fill-branco-400")}`}>
            <path d="M12 4.48485V7.51515H5.18182L7.83333 10.1667L6 12L0 6L6 0L7.83333 1.83333L5.18182 4.48485H12Z" />
        </svg>
    );
};

Icone.Status = (props: IIconeStatusProps) => {
    switch (props.variante) {
        case 'circulo-x':
            return (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.fill || "fill-cinza-600"}>
                    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM9 8.154L8.154 9L6 6.846L3.846 9L3 8.154L5.154 6L3 3.846L3.846 3L6 5.154L8.154 3L9 3.846L6.846 6L9 8.154Z" />
                </svg>
            );
        case 'circulo-check':
            return (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.fill || "fill-cinza-600"}>
                    <path d="M6 0C2.688 0 0 2.688 0 6C0 9.312 2.688 12 6 12C9.312 12 12 9.312 12 6C12 2.688 9.312 0 6 0ZM4.8 9L1.8 6L2.646 5.154L4.8 7.302L9.354 2.748L10.2 3.6L4.8 9Z" />
                </svg>
            );
        case 'tag-x':
            return (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.fill || "fill-cinza-600"}>
                    <path d="M12.2222 0H3.88889C3.50556 0 3.20556 0.194445 3.00556 0.488889L0 5L3.00556 9.50556C3.20556 9.8 3.50556 10 3.88889 10H12.2222C12.8333 10 13.3333 9.5 13.3333 8.88889V1.11111C13.3333 0.5 12.8333 0 12.2222 0ZM10.5556 6.99444L9.77222 7.77778L7.77778 5.78333L5.78333 7.77778L5 6.99444L6.99444 5L5 3.00556L5.78333 2.22222L7.77778 4.21667L9.77222 2.22222L10.5556 3.00556L8.56111 5L10.5556 6.99444Z" />
                </svg>
            );
        case 'cadeado':
            return (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.fill}>
                    <path d="M4.57143 9.14286C4.87453 9.14286 5.16522 9.02245 5.37955 8.80812C5.59388 8.59379 5.71429 8.3031 5.71429 8C5.71429 7.36571 5.2 6.85714 4.57143 6.85714C4.26832 6.85714 3.97763 6.97755 3.76331 7.19188C3.54898 7.40621 3.42857 7.6969 3.42857 8C3.42857 8.3031 3.54898 8.59379 3.76331 8.80812C3.97763 9.02245 4.26832 9.14286 4.57143 9.14286ZM8 4C8.3031 4 8.59379 4.12041 8.80812 4.33474C9.02245 4.54906 9.14286 4.83975 9.14286 5.14286V10.8571C9.14286 11.1602 9.02245 11.4509 8.80812 11.6653C8.59379 11.8796 8.3031 12 8 12H1.14286C0.839753 12 0.549062 11.8796 0.334735 11.6653C0.120408 11.4509 0 11.1602 0 10.8571V5.14286C0 4.50857 0.514286 4 1.14286 4H1.71429V2.85714C1.71429 2.09938 2.01531 1.37266 2.55112 0.836838C3.08694 0.30102 3.81367 0 4.57143 0C4.94663 0 5.31817 0.0739022 5.66481 0.217487C6.01145 0.361072 6.32642 0.571528 6.59173 0.836838C6.85704 1.10215 7.0675 1.41712 7.21108 1.76376C7.35467 2.11041 7.42857 2.48194 7.42857 2.85714V4H8ZM4.57143 1.14286C4.11677 1.14286 3.68074 1.32347 3.35925 1.64496C3.03775 1.96645 2.85714 2.40249 2.85714 2.85714V4H6.28571V2.85714C6.28571 2.40249 6.1051 1.96645 5.78361 1.64496C5.46212 1.32347 5.02609 1.14286 4.57143 1.14286Z" fill="#D7AF70" />
                </svg>
            );
        case 'relogio-x':
            return (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.fill}>
                    <path d="M6.84713 11.591C6.51996 11.6495 6.18695 11.6845 5.84226 11.6845C2.62902 11.6845 0 9.0555 0 5.84226C0 2.62902 2.62902 0 5.84226 0C9.0555 0 11.6845 2.62902 11.6845 5.84226C11.6845 6.18695 11.6495 6.51996 11.591 6.84713C11.1003 6.57838 10.5336 6.42648 9.93184 6.42648C9.19572 6.42648 8.51217 6.65433 7.94547 7.04576L6.13437 5.9591V2.92113H5.25803V6.42648L7.26193 7.6592C6.74197 8.27264 6.42648 9.0555 6.42648 9.93184C6.42648 10.5336 6.57838 11.1003 6.84713 11.591ZM11.1704 7.86368L9.93184 9.10808L8.69328 7.86952L7.86952 8.69328L9.10808 9.93184L7.86952 11.1704L8.69328 12L9.93184 10.7556L11.1704 12L12 11.1704L10.7556 9.93184L12 8.69328L11.1704 7.86368Z" fill="#A29C9B" />
                </svg>
            );
        default:
            return null;
    }
};

Icone.Usuario = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C6.79565 0 7.55871 0.31607 8.12132 0.87868C8.68393 1.44129 9 2.20435 9 3C9 3.79565 8.68393 4.55871 8.12132 5.12132C7.55871 5.68393 6.79565 6 6 6C5.20435 6 4.44129 5.68393 3.87868 5.12132C3.31607 4.55871 3 3.79565 3 3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.31607 5.20435 0 6 0ZM6 7.5C9.315 7.5 12 8.8425 12 10.5V12H0V10.5C0 8.8425 2.685 7.5 6 7.5Z" fill="white" />
    </svg>
);

export default Icone;
