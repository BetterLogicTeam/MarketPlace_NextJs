import { useState, useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Spinner from '../pages/Loading_Spinner/Spinner'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftmarketaddress, nftmarket_abi, nftMarketTokenAddress, nftMarketToken_Abi
} from '../config'
import { loadWeb3 } from './api/api'


// import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
// import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Auctionsbide() {
    const [fileUrl, setFileUrl] = useState(null)
    let [isSpinner, setIsSpinner] = useState(false)
    let [highbid, sethighbid] = useState(0)
    let [dueAmout, setdueAmout] = useState(0)
    let [Userdata, setUserdata] = useState([])





    const inputdata_price = useRef();
    const inputdata_price2 = useRef();

    let selectoption = useRef()

    const addOrder = async () => {
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
                let value_price = inputdata_price.current.value;
                let selecthere = selectoption.current.value;
                console.log("selecthere", value_price);


                // if (current_time_and_days > curreny_time) {
                // }

                if (value_price <= 0) {
                    setIsSpinner(false)
                    alert("Please Enter Price Grater then 0")

                } else {



                    if (selecthere <= 0) {
                        setIsSpinner(false)

                        alert("Please Select days")
                    }
                    else {

                        value_price = web3.utils.toWei(value_price);
                        let curreny_time = Math.floor(new Date().getTime() / 1000.0);
                        let current_time_and_days = 86400 * selecthere;
                        current_time_and_days = current_time_and_days + curreny_time;
                        let tokenid = 26;
                        let nftAddress = "0x84D1c1F7b33c70eaDCf9f8B29140A18AeC389fCB";
                        console.log("selecthere", current_time_and_days);
                        console.log("current_time_and_days", current_time_and_days);
                        console.log("curreny_time", curreny_time);

                        console.log("selecthere", value_price);
                        let nftContractOftoken = new web3.eth.Contract(
                            nftMarketToken_Abi,
                            acc
                        );
                        let nftContractInstance = new web3.eth.Contract(
                            nftmarket_abi,
                            nftmarketaddress
                        );
                        const getItemId = await nftContractInstance.methods
                            .tokenIdToItemId(nftAddress, tokenid)
                            .call();

                        console.log("tokenIdToItemId", getItemId);

                        let getListingPrice = await nftContractInstance.methods
                            .getListingPrice()
                            .call();

                        await nftContractOftoken.methods
                            .setApprovalForAll(nftmarketaddress, true)
                            .send({
                                from: acc,
                            })
                        setIsSpinner(false)

                        console.log("getItemId", getItemId);
                        //   const polygRes = nftContractInstance.methods
                        //     .idToMarketItem(getItemId)
                        //     .call();
                        // toast.success("Approved Successfuly");
                        alert("Approved Successfuly")


                        let nftContractOf = new web3.eth.Contract(
                            nftmarket_abi,
                            nftmarketaddress
                        );
                        setIsSpinner(true)

                        await nftContractOf.methods
                            .createMarketItem(
                                tokenid,
                                value_price,
                                1,
                                true,
                                current_time_and_days,
                                nftAddress
                            )
                            .send({
                                from: acc,
                                value: getListingPrice,
                            });
                        setIsSpinner(false)

                        alert("Transion Compelete")
                    }

                }



                // toast.success("Transion Compelete");
            } catch (e) {
                console.log("Error while addOrder ", e);
                setIsSpinner(false)

            }
        }
    };






    const createBidOnItem = async () => {
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
                let value_price = inputdata_price2.current.value;




                if (value_price <= 0) {
                    setIsSpinner(false)
                    alert("Please Enter Price Grater then 0")

                } else {



                    value_price = web3.utils.toWei(value_price);
                    let tokenid = 26;
                    let nftAddress = "0x84D1c1F7b33c70eaDCf9f8B29140A18AeC389fCB";

                    let nftContractOf = new web3.eth.Contract(
                        nftmarket_abi,
                        nftmarketaddress
                    );


                    let highestBidderMapping = await nftContractOf.methods
                        .highestBidderMapping(tokenid)
                        .call();

                    const getItemId = await nftContractOf.methods
                        .tokenIdToItemId(nftAddress, tokenid)
                        .call();
                    console.log("getItemId", getItemId);

                    const idToMarketitem = await nftContractOf.methods
                        .idToMarketItem(getItemId)
                        .call();





                    let price_items = idToMarketitem.price;
                    console.log("price_items", price_items);
                    if (highestBidderMapping && price_items < value_price) {
                        sethighbid(highestBidderMapping)

                        console.log("highestBidderMapping", highestBidderMapping.amount);
                        setIsSpinner(true)

                        await nftContractOf.methods
                            .createBidOnItem(
                                tokenid,
                                nftAddress
                            )
                            .send({
                                from: acc,
                                value: value_price
                            });
                        setIsSpinner(false)

                        alert("Transion Compelete")
                    } else {
                        setIsSpinner(false)

                        alert("Please Enter Value from Highest Bid and Listing Price")
                    }
                }







                // toast.success("Transion Compelete");
            } catch (e) {
                console.log("Error while addOrder ", e);
                setIsSpinner(false)

            }
        }
    };





    const getDueAmount = async () => {
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

                let tokenid = 26;
                let nftAddress = "0x84D1c1F7b33c70eaDCf9f8B29140A18AeC389fCB";

                let nftContractOf = new web3.eth.Contract(
                    nftmarket_abi,
                    nftmarketaddress
                );


                let getDueAmount = await nftContractOf.methods
                    .getDueAmount(acc)
                    .call();
                setdueAmout(getDueAmount)
                await nftContractOf.methods
                    .withdrawDueAmount().send({
                        from: acc

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






    const claimBidItem = async () => {
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

                let tokenid = 26;
                let nftAddress = "0x84D1c1F7b33c70eaDCf9f8B29140A18AeC389fCB";

                let nftContractOf = new web3.eth.Contract(
                    nftmarket_abi,
                    nftmarketaddress
                );


                let getDueAmount = await nftContractOf.methods
                    .getDueAmount(acc)
                    .call();
                setdueAmout(getDueAmount)
                await nftContractOf.methods
                    .claimBidItem(tokenid, nftAddress).send({
                        from: acc

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



    const userdata = async () => {
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
            const web3 = window.web3;

            let tokenid = 26;
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
            console.log("getItemId", idToMarketitem);
        
        setUserdata(idToMarketitem)

    }catch (e) {
        console.log("Error While Userdata",e);
    }
}
}


    useEffect(() => {
        // userdata();
        //   setInterval(() => {
        //   }, 1000);
    }, []);


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
                    required

                />


                <select
                    name="days"
                    className="dropdown__filter mt-8 border rounded p-4 w-100"
                    id=""
                    // style={{ backgroundColor: "rgba(0, 0, 0, .12)" }}
                    ref={selectoption}
                >
                    <option value="" selected disabled hidden>
                        Select Days
                    </option>
                    <option value="1" class="dropdown__select">

                        1 Day
                    </option>
                    <option value="3"> 3 Days</option>
                    <option value="7"> 7 Days</option>
                    <option value="90"> 3 Months</option>
                    <option value="180"> 6 Months</option>
                </select>


                <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={() => addOrder()} >
                    Complete Listing
                </button>

                <input
                    placeholder="Enter Value For Bid"
                    className="mt-8 border rounded p-4"
                    ref={inputdata_price2}
                    required

                />

                <p className='mt-4'><span className=' text-pink-500'>Highest Bid: </span>{highbid}</p>


                <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={() => createBidOnItem()} >
                    Bid On NFT
                </button>

                <div className="row">
                    <div className="col-lg-6">
                        <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={() => getDueAmount()} >
                            Withdraw Due Amount
                        </button>      <span className='ml-10'> {dueAmout}</span>
                    </div>
                    <div className="col-lg-4">

                    </div>
                </div>

                <button className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg" onClick={() => claimBidItem()} >
                    Claim Your Bid
                </button>

           


            </div>
        </div>
    )
}