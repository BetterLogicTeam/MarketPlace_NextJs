import { useState,useEffect } from 'react'

import '../styles/globals.css'

import Link from 'next/Link'
import { loadWeb3, } from '../pages/api/api';


function MyApp({ Component, pageProps }) {


  let [btnTxt, setBtTxt] = useState("Connect")

  const getAccount = async () => {
      let acc = await loadWeb3();
      console.log("ACC=",acc)
      if (acc == "No Wallet") {
          setBtTxt("No Wallet")
      }
      else if (acc == "Wrong Network") {
          setBtTxt("Wrong Network")
      } else {
          let myAcc = acc?.substring(0, 4) + "..." + acc?.substring(acc?.length - 4);
          setBtTxt(myAcc);

      }
  }

  useEffect(() => {
      setInterval(() => {
          getAccount();
      }, 1000);
  }, []);
  return (
    <div>
      <nav className='border-b p-6'>
        <div className="inner_div">
          <p className='text-4xl font-bold'>Marketplace</p>
          <button className='font-bold mt-1 bg-pink-500 text-white rounded p-4 shadow-lg ml-auto'>{btnTxt}</button>
        </div>

        <div className='flex mt-4'>
          <Link href='/'>
            <a className='mr-6 text-pink-500'>
              Home
            </a>
          </Link>
          <Link href='/Sel_nft'>
            <a className='mr-6 text-pink-500'>
              Sell NFT
            </a>
          </Link>
          <Link href='/Auctionsbide'>
            <a className='mr-6 text-pink-500'>
            Auctionsbide NFT
            </a>
          </Link>
          <Link href='/create-nft'>
            <a className='mr-6 text-pink-500'>
              Create NFT
            </a>
          </Link>
          <Link href='/my-assets'>
            <a className='mr-6 text-pink-500'>
              My Assets
            </a>
          </Link>
          <Link href='/creator-dashboard'>
            <a className='mr-6 text-pink-500'>
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )

}

export default MyApp
