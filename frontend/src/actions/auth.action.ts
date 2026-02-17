"use server";

import api from "@/lib/api";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    console.log(email, password);

    if (!email || !password) {
        throw new Error("Missing credentials");
    }

    const res = await api.post("/auth/login", {
        email,
        password,
    });

    return res.data;
}

export async function registerAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
        throw new Error("Missing credentials");
    }

    const res = await api.post("/auth/register", {
        email,
        password,
    });

    redirect("/login");
}
