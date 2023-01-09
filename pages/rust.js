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
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Rust() {
    const [user, setUser] = useState(null);
    const [newNft, setNewNft] = useState(null);
    const [newTitle, setNewTitle] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [newMedia, setNewMedia] = useState('');
    const id = uuid();
    const supabase = useSupabaseClient();

    useEffect(() => {
        if (wallet.getAccountId()) {
            setUser(wallet.getAccountId());
            viewFunction('nft_tokens_for_owner', { account_id: user }).then(
                (result) => {
                    setNewNft(result);
                }
            );
        }
    }, [user]);

    const createNFT = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: newTitle,
                    description: newDescription,
                    media:
                        newMedia ||
                        'https://media.licdn.com/dms/image/C560BAQGnbrbibTKR6Q/company-logo_200_200/0/1672737295471?e=1680739200&v=beta&t=dhlWalKcErYK8iwwIWGmIr4C1U2SIDT43OCGDMzIn7w',
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const handleUpload = async (event) => {
        let file;

        if (event.target.files) {
            file = event.target.files[0];
        }

        const { data, error } = supabase.storage
            .from('cryptonized')
            .upload(id, file);
        setNewMedia(
            `https://wltimvhurxpqqsrwdenw.supabase.co/storage/v1/object/public/cryptonized/${id}`
        );
        if (data) {
            console.log('data', data);
        }
        if (error) {
            console.log('error', error);
        }
    };

    const handleTransfer = async (token) => {
        await callFunction(
            'nft_transfer',
            {
                receiver_id: prompt('Enter the receiver ID'),
                token_id: token,
            },
            '0.000000000000000000000001', // attached GAS (optional)
            '0.000000000000000000000001' // attached GAS (optional)
        );
    };

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
                                    <input
                                        type='file'
                                        onChange={(event) => {
                                            handleUpload(event);
                                        }}
                                    />
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
                                    <div class='flex flex-wrap'>
                                        {newNft.map((token) => (
                                            <div class='rounded-lg shadow-lg bg-white p-1 border m-1 md:w-1/4 xs:w-full xl:w-1/6' key={token.token_id}>
                                                <a
                                                    href='#!'
                                                    data-mdb-ripple='true'
                                                    data-mdb-ripple-color='light'>
                                                    <img
                                                        class='rounded-t-lg w-full'
                                                        src={
                                                            token.metadata.media
                                                        }
                                                        alt={
                                                            token.metadata.title
                                                        }
                                                    />
                                                </a>
                                                <div class='p-6'>
                                                    <h5 class='text-gray-900 text-xl font-medium mb-2'>
                                                        {token.metadata.title}
                                                    </h5>
                                                    <p class='text-gray-700 text-base mb-4'>
                                                        {
                                                            token.metadata
                                                                .description
                                                        }
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            handleTransfer(
                                                                token.token_id
                                                            );
                                                        }}
                                                        type='button'
                                                        class=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                        Transfer NFT
                                                    </button>
                                                </div>
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
