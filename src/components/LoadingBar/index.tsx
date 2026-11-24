"use client";

import NextTopLoader from 'nextjs-toploader';

export default function TopLoadingBar() {

  return (
    <NextTopLoader
      {...{
        color: "#943a00",
        height: 3,
        showSpinner: false,
        zIndex: 9999
      }}
    />
  );
}