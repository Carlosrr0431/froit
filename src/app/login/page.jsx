"use client"

import { signIn } from "next-auth/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Home, Building2, KeyRound } from "lucide-react";
import { MdEmail } from "react-icons/md";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

function getErrorMessage() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error === "no-access") return "No tienes acceso autorizado. Por favor, contacta al administrador.";
  return null;
}

export default function LoginPage() {
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
      setErrorMsg(getErrorMessage());
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-blue-200 to-pink-200 animate-gradient-x px-2 overflow-hidden">
            {/* Íconos inmobiliarios flotantes y animados en el fondo */}
            <Home className="fixed left-8 top-8 w-12 h-12 text-indigo-200 opacity-40 z-0 animate-float-x pointer-events-none select-none" />
            <Building2 className="fixed right-8 bottom-8 w-16 h-16 text-pink-200 opacity-40 z-0 animate-float-y pointer-events-none select-none" />
            <KeyRound className="fixed left-10 bottom-16 w-10 h-10 text-yellow-300 opacity-30 z-0 animate-float-x2 pointer-events-none select-none" />
            <Home className="fixed right-10 top-1/3 w-10 h-10 text-blue-200 opacity-30 z-0 animate-float-y2 pointer-events-none select-none" />
            <Building2 className="fixed left-1/4 top-1/4 w-8 h-8 text-indigo-300 opacity-30 z-0 animate-float-x3 pointer-events-none select-none" />
            <KeyRound className="fixed right-1/4 bottom-1/4 w-8 h-8 text-pink-300 opacity-30 z-0 animate-float-y3 pointer-events-none select-none" />
            
            {/* Animación Lottie flotante en el fondo - Placeholder si no existe el json */}
            <div className="fixed right-0 top-0 w-32 h-32 opacity-30 pointer-events-none z-0 blur-[2px] animate-float-x2 select-none">
                 {/* Asegúrate de tener el archivo /animations/house-3d.json.json en public o ajusta la ruta */}
            </div>

            {/* Círculo decorativo en el fondo */}
            <div className="fixed -bottom-24 -left-24 w-72 h-72 bg-gradient-to-br from-pink-400 via-indigo-300 to-blue-200 rounded-full opacity-20 blur-2xl z-0 animate-pulse pointer-events-none select-none" />
            
            {/* Contenedor principal limpio */}
            <div className="relative w-full max-w-sm bg-white/95 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 border border-blue-200 z-10">
                {/* Logo Placeholder - Ajusta la ruta a tu logo real */}
                <div className="mb-6 z-10 drop-shadow-xl">
                    <Image src="/assets/logo-froit.svg" alt="Logo Froit" width={110} height={50} />
                </div>
                
                <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-pink-500 mb-6 text-center tracking-tight z-10 animate-fade-in">Bienvenido/a</h1>
                
                {errorMsg && (
                  <div className="w-full mb-4 p-2 rounded-lg bg-red-50 text-red-600 text-center text-xs border border-red-200 animate-pulse z-10">
                    {errorMsg}
                  </div>
                )}
                
                <button
                    onClick={() => signIn("google", { callbackUrl: "/crm" })}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-white font-semibold text-base shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 mb-2 z-10 animate-fade-in delay-200"
                >
                    <MdEmail className="w-5 h-5" />
                    Ingresar con Google
                </button>
                
                <span className="text-[11px] text-gray-400 mt-4 text-center block z-10 animate-fade-in delay-300">© {new Date().getFullYear()} Remax NOA</span>
            </div>
        </div>
    );
}
