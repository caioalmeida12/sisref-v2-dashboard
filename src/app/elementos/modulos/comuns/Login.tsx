"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import sisrefLogo from "@/app/elementos/assets/img/sisrefLogo.png";
import { Botao } from "@elementos/basicos/Botao";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import * as Form from "@radix-ui/react-form";
import { login } from "@/app/actions/comuns";

const MensagemErro = ({ texto }: { texto: string | null }) => {
  const { pending } = useFormStatus();

  if (pending || !texto) return null;

  return <div className="text-center text-sm text-vermelho-400">{texto}</div>;
};

const MensagemCarregando = () => {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return <div className="text-center text-sm text-azul-400">Carregando...</div>;
};

const LoginContent = () => {
  const params = useSearchParams();

  return (
    <>
      <MensagemErro texto={params.get("erro")} />
      <MensagemCarregando />
      <Form.Submit asChild>
        <Botao variante="adicionar" texto="Entrar" type="submit" />
      </Form.Submit>
    </>
  );
};

export const Login = () => {
  return (
    <main className="flex h-full grow flex-col items-center gap-y-8">
      <Image src={sisrefLogo} alt="Sisref" />
      <Form.Root
        className="flex w-full min-w-[256px] max-w-[400px] flex-col gap-y-4"
        action={login}
      >
        <Form.Field name="email" className="flex flex-col gap-y-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="estudante@ifce.edu.br"
            className="rounded px-4 py-2 outline outline-1 outline-cinza-600"
          />
        </Form.Field>
        <Form.Field name="password" className="flex flex-col gap-y-2">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="********"
            className="rounded px-4 py-2 outline outline-1 outline-cinza-600"
          />
        </Form.Field>
        <Form.Field name="remember" className="flex items-center gap-2">
          <Form.Control
            type="checkbox"
            className="rounded border-2 border-cinza-600"
          />
          <Form.Label>Lembre-se de mim</Form.Label>
        </Form.Field>
        <Suspense fallback={<div>Carregando...</div>}>
          <LoginContent />
        </Suspense>
      </Form.Root>
    </main>
  );
};
