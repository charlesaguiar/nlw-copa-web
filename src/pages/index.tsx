import { FormEvent, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../lib/axios";

import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImage from "../assets/logo.svg";
import avatarsImage from "../assets/users-avatar-example.png";
import iconCheckIcon from "../assets/icon-check.svg";

interface IHomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home({
  poolsCount,
  guessesCount,
  usersCount,
}: IHomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const createPool = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { code },
      } = await api.post("/pools", { title: poolTitle });
      navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso! O código foi copiado para sua área de transferência."
      );
      setPoolTitle("");
    } catch (err) {
      console.error("FAILED TO CREATE POOL: ", err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-28 h-screen mx-auto items-center max-w-[1124px] my-4">
      <main>
        <Image src={logoImage} alt="Logo" />
        <h1 className="mt-14 text-white font-bold text-5xl leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="flex items-center gap-1 mt-10">
          <Image src={avatarsImage} alt="Avatares" />
          <strong className="font-bold text-xl text-gray-100">
            <span className="text-ignite-500">{`+${usersCount}`}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="flex gap-2 mt-10">
          <input
            className="flex-1 py-4 px-6 bg-gray-800 text-gray-100 border border-solid border-gray-600 rounded text-sm"
            type="text"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
            placeholder="Qual nome do seu bolão?"
            required
          />
          <button
            className="py-5 px-6 bg-yellow-500 text-gray-900 rounded cursor-pointer font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="flex justify-between items-center mt-10 pt-10 border-t border-solid border-gray-600 text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckIcon} alt="Icon" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl leading-snug">{`+${poolsCount}`}</span>
              <span className="leading-relaxed">Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-20 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckIcon} alt="Icon" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl leading-snug">{`+${guessesCount}`}</span>
              <span className="leading-relaxed">Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo o app"
        quality={100}
      />
    </div>
  );
}

interface ICountData {
  count: number;
}

export const getStaticProps: GetStaticProps = async () => {
  const [pools, guesses, users] = await Promise.all([
    api.get<ICountData>("pools/count"),
    api.get<ICountData>("guesses/count"),
    api.get<ICountData>("users/count"),
  ]);

  return {
    props: {
      poolsCount: pools.data.count,
      guessesCount: guesses.data.count,
      usersCount: users.data.count,
    },
    revalidate: 600,
  };
};
