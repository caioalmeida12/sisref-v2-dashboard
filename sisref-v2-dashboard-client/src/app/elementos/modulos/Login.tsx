import { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
// import { TokenType } from '@/lib/types/TokenType';
// import { TokenContext } from '@/lib/contexts/TokenContext';
// import StudentPage from '../estudante/page';
// import { MenuProvider } from '@/lib/contexts/MenuContext';
// import { FoodRestrictionProvider } from '@/lib/contexts/FoodRestrictionContext';
import Image from 'next/image';
import sisrefLogo from '@/app/elementos/assets/img/sisrefLogo.png';
import Head from 'next/head';

const LoginPage = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const tokenContext = useContext(TokenContext);

    // const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     setEmail(event.target.value);
    // };

    // const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     setPassword(event.target.value);
    // };

    // const handleSubmit = async (event: FormEvent) => {
    //     event.preventDefault();

    //     try {
    //         const response = await fetch("https://ruapi.cedro.ifce.edu.br/api/login", {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 email: email,
    //                 password: password
    //             })
    //         });

    //         const data: TokenType = await response.json();

    //         if (data.access_token) {
    //             tokenContext.setToken(data);
    //             localStorage.setItem('@rucedro-Token', data.access_token);
    //             localStorage.setItem('@rucedro-acess-level-user', data.classfication);
    //             localStorage.setItem('@rucedro-id-user', String(data.id));
    //             localStorage.setItem('@rucedro-active-user', String(data.active));
    //             localStorage.setItem('@rucedro-campus-user', String(data.campus));
    //             localStorage.setItem('@rucedro-exp', String(data.expires_in));
    //             localStorage.setItem('@rucedro-name-user', data.name);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    // if (tokenContext.token) return (
    //     <MenuProvider>
    //         <FoodRestrictionProvider>
    //             <StudentPage />
    //         </FoodRestrictionProvider>
    //     </MenuProvider>
    // )

    return (
        <>
        <div className='bg-branco-400'>
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
                <form className="flex flex-col gap-4">
                    <div className="flex items-center p-4 rounded w-9/10">
                        <TextField
                            type="email"
                            name="Email"
                            id="Email"
                            fullWidth
                            variant="outlined"
                            label="Email"
                        />
                    </div>
                    <div className="flex items-center p-4 rounded w-9/10">
                        <TextField
                            type="password"
                            name="Password"
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="flex items-center justify-center py-4 rounded bg-blue-900 text-white text-base font-bold"
                    >
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
        </>
    );
}

export default LoginPage;