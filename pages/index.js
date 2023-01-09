//Next JS imports
import Head from 'next/head';

//React import
import { useState, useEffect } from 'react';

//Near imports
import {
    signIn,
    signOut,
    wallet,
    viewFunction,
    callFunction,
} from '../near/near-setup';
import JS from './js';
import Rust from './rust';

export default function Home() {
    const [user, setUser] = useState(null);
    const [greeting, setGreeting] = useState(null);

    useEffect(() => {
        if (wallet.getAccountId()) {
            setUser(wallet.getAccountId());
        }
        viewFunction('get_greeting').then((result) => {
            setGreeting(result);
        });
    }, []);

    function changeGreeting(e) {
        e.preventDefault();
        const greeting = e.target.greetingInput.value;
        callFunction('set_greeting', { message: greeting }).then((result) => {
            setGreeting(greeting);
        });
    }

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

            <div className='m-6 border-t-4'>
                {!user ? (
                    <div className='text-center mt-40'>
                        <h4>
                            Welcome to Cryptonized please connect your near
                            wallet
                        </h4>
                        <button
                            className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded'
                            onClick={() => {
                                signIn();
                            }}>
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className='mt-6 text-red-500 text-xl mb-2'>Rust Smart Contract</h1>
                        <div>
                            <span>Welcome </span>
                            <span className='text-blue-400 text-xl'>
                                {user}
                            </span>
                        </div>
                        <div>
                            <span>The contract says: </span>
                            <span className='text-blue-400 text-xl'>
                                {greeting}
                            </span>
                        </div>
                        <form onSubmit={changeGreeting}>
                            <label>Change the contract's message:</label>
                            <input
                                className='mr-4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                autoComplete='off'
                                id='greetingInput'
                                placeholder='New message'
                            />
                            <button className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded'>
                                Save
                            </button>
                        </form>
                        <button
                            className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded my-1'
                            onClick={() => {
                                signOut();
                                setUser(null);
                            }}>
                            Sign out
                        </button>
                        <Rust />
                        {/* <JS /> */}
                    </>
                )}
            </div>
        </div>
    );
}
