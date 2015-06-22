/**
 * This is used to perform pseduo translation
 */
var fs = require( 'fs' ),
    path = require( 'path' );


//List of languages to translate and their prefixes
var languages = {
    'en':    '',
    'en-US': '',
    'de':    'deößü',
    'es':    'és',
    'fr':    'frê',
    'it':    'ìt',
    'ja':    'かきま',
    'ko':    '안올외',
    'ru':    'шдь',
    'pt-br': 'pt-àí',
    'zh-cn': '术语表',
    'zh-tw': '術語'
};

function translateObject( messageJson, prefix ) {
    for( var key in messageJson ) {
        if( messageJson.hasOwnProperty( key ) ) {
            if( typeof messageJson[key] === 'object' ) {
                translateObject( messageJson[key], prefix );
            } else {
                messageJson[key] = prefix + messageJson[key];
            }

        }
    }
}

function createTranslatedFile( messageJson, language, pathToDestLangs ) {

    //Get the character set to append
    var prefix = languages[language];

    //Translate the JSON
    translateObject( messageJson, prefix );

    //JSON the translated file
    var translatedMessageJson = JSON.stringify( messageJson, null, 4 );

    // write-out the json text
    destinationFile = pathToDestLangs + '/lang_' + language + '.js';
    fs.writeFile( destinationFile, translatedMessageJson, function( err ) {
        if( err ) {
            console.log( err );
        }
    } );

}

function pseudoTranslate( messageFile, pathToDestLangs ) {
    

    fs.readFile( messageFile, 'utf8', function( err, data ) {
        if( err ) {
            console.log( 'Error: ' + err );
            return;
        }

        //Loop through the supported languages and create the translation file
        for( var supportedLanguage in languages ) {
            var messageJsonObject = JSON.parse( data );
            createTranslatedFile( messageJsonObject, supportedLanguage, pathToDestLangs );
        }

    } );
}


// prefix of generated filename (with e.g. "_en-us.js" appended)
pseudoTranslate('src/messages/lang-en.js', 'src/messages/');                  
	

    