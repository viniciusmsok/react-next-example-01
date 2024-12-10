"use client"
import Image from "next/image";

export default function Avatar() {
  return (
    <a href="#" className="flex-shrink-0">
      <Image className="h-8 w-8 rounded-full" src="/photo.png" alt="Vinícius de Moraes" width="32" height="32"/>
    </a>
  );
}