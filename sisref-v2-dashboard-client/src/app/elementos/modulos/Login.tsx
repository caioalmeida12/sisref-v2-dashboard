import React from 'react';

import { TextField } from '@mui/material';
import Image from 'next/image';
import sisrefLogo from '@/app/elementos/assets/img/sisrefLogo.png';
import Head from 'next/head';
import { Botao } from '../basicos/Botao';
import { fetchLoginAPI } from '@/app/actions/fetchLoginApi';

export const Login = () => {

    return (
        <>
            <Head>
                <title>Login</title>
                <link rel="icon" href="./assets/img/sisrefIcon.png" />
            </Head>
            <div className="flex flex-col items-center gap-14 col-span-2">
                <Image src={sisrefLogo} alt="Sisref" />
                <div className="flex flex-col">
                    <div className="text-center text-lg font-bold text-green-500 leading-7">Restaurante Universitário</div>
                    <div className="text-center text-base font-normal text-black leading-7">IFCE Campus Cedro</div>
                </div>
                <form className="flex flex-col gap-4" action={fetchLoginAPI}>
                    <div className="flex items-center p-4 rounded w-9/10">
                        <TextField
                            type="email"
                            name="email"
                            id="Email"
                            fullWidth
                            variant="outlined"
                            label="Email"
                        />
                    </div>
                    <div className="flex items-center p-4 rounded w-9/10">
                        <TextField
                            type="password"
                            name="password"
                            id="Password"
                            fullWidth
                            variant="outlined"
                            label="Senha"
                        />
                    </div>
                    <div className="flex gap-20">
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                                className="rounded border-2 border-black"
                            />
                            <label htmlFor="remember">Lembre-se de mim</label>
                        </div>
                        <a href="#" className="text-red-500 text-sm no-underline">Esqueceu a senha?</a>
                    </div>
                    <Botao variante='adicionar' texto='Entrar' type='submit'></Botao>
                </form>
            </div>
        </>
    );
}