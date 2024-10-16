import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'

export async function GET(req: NextRequest) {
    req.cookies.clear()

    redirect("/login")
}