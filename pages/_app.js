import '../styles/globals.css';

//React imports
import { useEffect, useState } from 'react';

//Near imports
import { initNear } from '../near/near-setup';

function MyApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(true);

    //Loading the NEAR API and setting up the wallet and contract
    //At the start of the app
    useEffect(() => {
        initNear();
        setIsLoading(false);
    }, []);

    return isLoading ? (
        <div className='center-div'>
            <p>loading</p>
        </div>
    ) : (
        <Component {...pageProps} />
    );
}

export default MyApp;
