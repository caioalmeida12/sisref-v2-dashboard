"use client";

import React from "react";
import Icone from "./Icone";
import Link from "next/link";

export const Logout = () => {
  return (
    <Link
      href={"/logout"}
      className='relative flex items-center before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[""] hover:before:absolute'
    >
      <Icone.Logout />
    </Link>
  );
};
