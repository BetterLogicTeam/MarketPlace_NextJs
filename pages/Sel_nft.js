import { useState, useRef } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftmarketaddress, nftmarket_abi, nftMarketTokenAddress, nftMarketToken_Abi
} from '../config'
import { loadWeb3 } from './api/api'
import Spinner from './Loading_Spinner/Spinner'


// import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
// import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  let [isSpinner, setIsSpinner] = useState(false)


  const inputdata_price = useRef();

  const addOrder = async () => {
    let acc = await loadWeb3();
    // console.log("ACjjjjjC=",acc)
    if (acc == "No Wallet") {
      //  toast.error("No Wallet Connected")
    }
    else if (acc == "Wrong Network") {
      // toast.error("Wrong Newtwork please connect to test net")
    } else {
      try {
        setIsSpinner(true)
        const web3 = window.web3;
        let address = "0x4113ccD05D440f9580d55B2B34C92d6cC82eAB3c"
        let value_price = inputdata_price.current.value;

        if (value_price <= 0) {
          setIsSpinner(false)
          alert("Please Enter Price Grater then 0")
        } else {
          value_price = web3.utils.toWei(value_price)
          let curreny_time = Math.floor(new Date().getTime() / 1000.0)

          console.log("tayyab", curreny_time)

          let tokenid = 28;
          let nftAddress = "0x84D1c1F7b33c70eaDCf9f8B29140A18AeC389fCB";

          let nftContractOftoken = new web3.eth.Contract(nftMarketToken_Abi, nftAddress);
          let getodernumberhere = new web3.eth.Contract(nftmarket_abi, nftmarketaddress);

          let getorderhere = await getodernumberhere.methods.tokenIdToItemId(nftAddress, tokenid).call();
          console.log("getorderhere", getorderhere)
          console.log("ownaddress", tokenid)
          console.log("ownaddress", tokenid)


          let getListingPrice = await getodernumberhere.methods.getListingPrice().call();

          console.log("getListingPrice", getListingPrice);

          await nftContractOftoken.methods.setApprovalForAll(nftmarketaddress, true).send({
            from: acc,
          })
          setIsSpinner(false)

          // toast.success("Approved Successfuly")
          alert("Approved Successfuly")
          setIsSpinner(true)


          let nftContractOf = new web3.eth.Contract(nftmarket_abi, nftmarketaddress);
          await nftContractOf.methods.createMarketItem(tokenid, value_price, 1, false, curreny_time, nftAddress).send({
            from: acc,
            value: getListingPrice,
            // feelimit: 10000000000
          })
          setIsSpinner(false)

          alert("Transion Compelete")
          // toast.success("Transion Compelete")

        }

      }
      catch (e) {
        console.log("Error while addOrder ", e)
        setIsSpinner(false)

      }
    }
  }

  const createMarketSale = async () => {
    let acc = await loadWeb3();
    // console.log("ACC=",acc)
    if (acc == "No Wallet") {
      alert("No Wallet Connected")
      //   toast.error("No Wallet Connected");
    } else if (acc == "Wrong Network") {
      alert("Wrong Newtwork please connect to test net")
      //   toast.error("Wrong Newtwork please connect to test net");
    } else {
      try {

        setIsSpinner(true)
        const web3 = window.web3;
        let address = "0x4113ccD05D440f9580d55B2B34C92d6cC82eAB3c";


        let tokenid = 28;
        let nftAddress = "0x84D1c1F7b33c70eaDCf9f8B29140A18AeC389fCB";



        let nftContractOf = new web3.eth.Contract(
          nftmarket_abi,
          nftmarketaddress
        );

        const getItemId = await nftContractOf.methods
          .tokenIdToItemId(nftAddress, tokenid)
          .call();
        console.log("getItemId", getItemId);

        const idToMarketitem = await nftContractOf.methods
          .idToMarketItem(getItemId)
          .call();




        let price_items = idToMarketitem.price;
        console.log("price_items", price_items);



        await nftContractOf.methods
          .createMarketSale(
            tokenid,
            nftAddress
          )
          .send({
            from: acc,
            value: price_items,
          });
        setIsSpinner(false)

        alert("Transion Compelete")




        // toast.success("Transion Compelete");
      } catch (e) {
        console.log("Error while addOrder ", e);
        setIsSpinner(false)

      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        {
          isSpinner ? <Spinner /> : <></>

        }
        <input
          placeholder="Enter Value"
          className="mt-8 border rounded p-4"
          ref={inputdata_price}

        />

        <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={() => addOrder()} >
          Sell NFT
        </button>
        <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={() => createMarketSale()} >
          Buying NFT
        </button>
      </div>
    </div>
  )
}