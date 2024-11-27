const { statSync } = require ( 'node:fs' );

const { writeFile, readdir, appendFile, rename, rm } = require ( 'node:fs/promises' );

const {
    logDirectory = './log/',
    maxFilesCount = 10,
    maxFileSize = 128
} = require ( './config.json' );

let accumulatedLogLines = '';
let accumulatedCharacterCount = 0;

// const waitMilliSecs = ( milliSecs, optionalMessage ) => new Promise ( resolve => setTimeout ( resolve, milliSecs, optionalMessage ) );


const rotateLogs = async () => {
    const logDirectoryContent = await readdir ( logDirectory );
    const filteredLogDirectoryContent = logDirectoryContent.filter ( fileName => fileName.match ( /log\.\d{2}$/ ) );
    
    while ( filteredLogDirectoryContent.length >= maxFilesCount ) {
        const toRemove = logDirectory + filteredLogDirectoryContent.pop ();
        await rm ( toRemove );
    }

    for ( let i = filteredLogDirectoryContent.length - 1; i >= 0 ; i -- ) {
        
        const currentLogfFileName = logDirectory + filteredLogDirectoryContent[ i ];
        const currentLogFileDigits = filteredLogDirectoryContent[ i ].split ( '.' )[ 1 ];
        const currentLogfFileNumber = parseInt ( currentLogFileDigits );
        const newLogFileNumber = currentLogfFileNumber + 1;
        const newLogFileDigits = newLogFileNumber.toString ();
        const padStartedNewLogFileDigits = newLogFileDigits.padStart ( 2, '0' );
        
        await rename ( currentLogfFileName, logDirectory + 'log.' + padStartedNewLogFileDigits );
    }

    await writeFile ( logDirectory + 'log.00', '' );
    
};

const saveAccumulatedLogLines = async () => {
    console.log ( accumulatedCharacterCount );
    console.log ( accumulatedLogLines.length )
    if ( accumulatedCharacterCount >= maxFileSize ) {
        accumulatedCharacterCount = accumulatedLogLines.length;
        await rotateLogs ();
    }
    
    await appendFile ( logDirectory + 'log.00', accumulatedLogLines + '\n' );
    accumulatedLogLines = '';    
};

const accumulateLogLines = logLines => {
    const formattedLogLines = ( new Date ().toISOString () ) + ' ' + logLines + '\n';
    accumulatedLogLines += formattedLogLines;
    accumulatedCharacterCount += formattedLogLines.length;
};

const { size: activeLogFileSize } = statSync ( logDirectory + 'log.00' );
accumulatedCharacterCount = activeLogFileSize;

console.log ( accumulatedCharacterCount )

module.exports = { saveAccumulatedLogLines, accumulateLogLines };