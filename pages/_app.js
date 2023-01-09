import '../styles/globals.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

//React imports
import { useEffect, useState } from 'react';

//Near imports
import { initNear } from '../near/near-setup';
import { initNear2 } from '../near/cryptonized';
import { initNear3 } from '../near/rust';

function MyApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);
    const [supabase] = useState(() => createBrowserSupabaseClient());

    //Loading the NEAR API and setting up the wallet and contract
    //At the start of the app
    useEffect(() => {
        initNear();
        initNear2();
        initNear3();
        setIsLoading(false);
    }, []);

    return isLoading ? (
        <div className='center-div'>
            <p>loading</p>
        </div>
    ) : (
        <SessionContextProvider
            supabaseClient={supabase}
            initialSession={pageProps.initialSession}>
            <Component {...pageProps} />
        </SessionContextProvider>
    );
}

export default MyApp;
