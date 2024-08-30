"use client"

import TapOnCoinCounter from "@/components/game/TapOnCoin";
import DefaultLayout from "@/components/layout/DefaultLayout";


export default function Home() {
  return (
    <>
      <DefaultLayout>
        <TapOnCoinCounter />
      </DefaultLayout>
    </>
  );
}
