"use client";

import React from "react";
import Icone from "./Icone";
import { logout } from "@/app/actions/comuns";

export const Logout = () => {
  const handleLogout = async () => await logout();

  return (
    <button
      name="Sair"
      onClick={handleLogout}
      className='relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
    >
      <Icone.Logout />
    </button>
  );
};
