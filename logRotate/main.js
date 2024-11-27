const { saveAccumulatedLogLines, accumulateLogLines } = require ( './index.js' );

( async () => {
    for ( let i = 1; ; i ++ ) {
        const message = 'Some log message....';
        // console.log ( message );
        accumulateLogLines ( message );
        if ( ! ( i % 10 ) ) {
            await saveAccumulatedLogLines ();
        }
        await new Promise ( resolve => setTimeout ( resolve, 300 ) );
    }
} ) ();