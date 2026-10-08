import Image from 'next/image'
import React from 'react'

const BeforeLogin: React.FC = () => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: "center"
    }}>
      <Image
        alt={'Terandina LLC'}
        width={100}
        height={100}
        src="/logos/Terandina_clear.png"
        className="w-[50rem] h-auto pb-2"
      />
      <p>
        <b>Welcome to your dashboard!</b>
        {' Contant site admin if you forget your password.'}
      </p>
    </div>
  )

}

export default BeforeLogin
