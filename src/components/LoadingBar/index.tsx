"use client";

import NextNProgress from "nextjs-progressbar";

export default function TopLoadingBar() {

  return (
    <NextNProgress
      {...{
        color: '#009487',
        showOnShallow: true,
        height: 3,
        // options: {
        //   showSpinner: false
        // },
        // style: {
        //   zIndex: 9999
        // }
      }}
    />
  );
}