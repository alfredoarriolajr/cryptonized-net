//Next JS imports
import Head from 'next/head';
import { v4 as uuid } from 'uuid';

//React import
import { useState, useEffect } from 'react';

//Near imports
import {
    signIn,
    signOut,
    wallet,
    viewFunction,
    callFunction,
} from '../near/cryptonized';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function NFT() {
    const [user, setUser] = useState(null);
    // const [metadata, setMetadata] = useState(null);
    const [newNft, setNewNft] = useState(null);
    const [newTitle, setNewTitle] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    // const [newMedia, setNewMedia] = useState('');
    const id = uuid().slice(0, 16).replace(/-/g, '');
    // const supabase = useSupabaseClient();

    useEffect(() => {
        if (wallet.getAccountId()) {
            setUser(wallet.getAccountId());
            viewFunction('nft_tokens_for_owner', { account_id: user }).then(
                (result) => {
                    setNewNft(result);
                }
            );
            // getStripeSubscription();
        }
    }, [user]);

    // const getStripeSubscription = async () => {
    //     const { data } = supabase.storage
    //         .from('cryptonized')
    //         .getPublicUrl('folder/avatar1.png');
    //     setNewMedia(data.publicURL);
    // };

    // const uploadFile = async () => {
    //     const { data, error } = await supabase.storage.getBucket('cryptonized');
    // };

    const createNFT = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: newTitle,
                    description: newDescription,
                    // media: newMedia,
                    media: 'https://media.licdn.com/dms/image/C560BAQGnbrbibTKR6Q/company-logo_200_200/0/1672737295471?e=1680739200&v=beta&t=dhlWalKcErYK8iwwIWGmIr4C1U2SIDT43OCGDMzIn7w',
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    // function handleChange(event) {
    //     setNewMedia(event.target.files[0]);
    // }

    return (
        <div>
            <Head>
                <title>Cryptonized</title>
                <meta
                    name='description'
                    content='Generated by create next app'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='mt-6 border-t-4 border-b-4 pb-2'>
                {!user ? (
                    <>
                        <h4>
                            Welcome to Cryptonized please connect your near
                            wallet
                        </h4>
                        <button
                            className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded'
                            onClick={() => {
                                signIn();
                            }}>
                            Sign In
                        </button>
                    </>
                ) : (
                    <>
                        <div className='mt-6'>
                            <div>
                                <h1 className='text-yellow-500 mb-4'>
                                    Javascript Contract
                                </h1>
                                <form className=''>
                                    <label htmlFor='title'>Title: </label>
                                    <input
                                        className='border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mx-2'
                                        type='text'
                                        name='title'
                                        id='title'
                                        onChange={(e) =>
                                            setNewTitle(e.target.value)
                                        }
                                    />
                                    <label htmlFor='description'>
                                        Description:
                                    </label>
                                    <input
                                        className='border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mx-2'
                                        type='text'
                                        name='description'
                                        id='description'
                                        onChange={(e) =>
                                            setNewDescription(e.target.value)
                                        }
                                    />
                                    {/* <input
                                        type='file'
                                        onChange={async (event) => {
                                            const avatarFile =
                                                event.target.files[0];
                                            const { data, error } =
                                                await supabase.storage
                                                    .from('cryptonized')
                                                    .upload(
                                                        'public/avatar2.png',
                                                        avatarFile,
                                                        {
                                                            cacheControl:
                                                                '3600',
                                                            upsert: false,
                                                        }
                                                    );
                                            setNewMedia(data);
                                            console.log(data);
                                        }}
                                    /> */}
                                </form>
                                <button
                                    className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded my-6'
                                    onClick={createNFT}>
                                    Create NFT
                                </button>
                            </div>
                            {newNft && (
                                <div>
                                    <h1 className='text-2xl border-t-4 pt-4'>
                                        Your NFTs
                                    </h1>
                                    <div className='flex flex-wrap'>
                                        {newNft.map((token) => (
                                            <div
                                                key={token.token_id}
                                                className='w-1/4 p-2'>
                                                <img
                                                    src={token.metadata.media}
                                                    alt={token.metadata.title}
                                                />
                                                <p>{token.metadata.title}</p>

                                                <p>
                                                    {token.metadata.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
