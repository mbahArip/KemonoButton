// ==UserScript==
// @name            Kemono Button
// @namespace       https://github.com/mbaharip
// @version         1.1.2-hotfix#1
// @author          mbaharip
// @description     Adds button to access artist's Kemono page
// @icon            https://kemono.su/static/favicon.ico
// @downloadURL     https://raw.githubusercontent.com/mbaharip/KemonoButton/main/src/kemono-button.user.js
// @updateURL       https://raw.githubusercontent.com/mbahArip/KemonoButton/main/src/kemono-button.meta.js
// @supportURL      https://github.com/mbahArip/KemonoButton/issues
// @match           https://fantia.jp/*
// @match           https://*.fanbox.cc/
// @match           https://www.fanbox.cc/@*
// @match           https://www.patreon.com/*
// @match           https://onlyfans.com/*
// @match           https://fansly.com/*
// @connect         self
// @connect         kemono.su
// @connect         coomer.su
// @connect         *
// @run-at          document-start
// @grant           GM.xmlHttpRequest
// @grant           GM.addStyle
// @license         GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// ==/UserScript==

var debugMode = false;
var loadUrl = window.location.href;

function styledLog ( message, isDebug = debugMode, isError = false ) {
    const kemonoBadgeStyle = [
        `background:${ isDebug ? '#ffc107' : '#22c283' }`,
        `color:${ isDebug ? '#333' : '#fff' }`,
        'font-weight: bold',
        'font-size: 14px',
        'padding: 0 0.5rem',
        'border-radius: 4px',
    ];
    const kemonoBadgeError = [
        'background: #dc3545',
        'color: #fff',
        'font-weight: bold',
        'font-size: 14px',
        'padding: 0 0.5rem',
        'border-radius: 4px',
    ];

    if ( isError ) {
        console.log( '%cKemonoButton - Error Occured', kemonoBadgeError.join(';'), `: ${ message }` );
    } else {
        console.log( `%cKemonoButton${ isDebug ? ' - Debug Mode' : '' }`, kemonoBadgeStyle.join(';'), `: ${ message }` );
    }
}

async function main () {
    'use strict';

    loadUrl = window.location.href;
    const domain = window.location.hostname;
    const partyDomain = {
        coomer: 'https://coomer.su',
        kemono: 'https://kemono.su'
    }
    const pathname = window.location.toString();
    var attempt = 0;
    var loaded = true;
    // console.log( 'Kemono Button: Running on ' + domain );
    styledLog( `Loaded.` )

    const toastElement = ( active ) => {
        const style = [
            'position:fixed',
            'z-index: 10000002',
            'background: #22c283',
            'color: white',
            'padding: 0.5rem 4rem',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'border-radius: 8px',
            'transition-property: all',
            'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)',
            'transition-duration: 500ms',
            'transition-delay: 1s',
            'left: 50%',
            'transform: translateX(-50%)',
            'filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));'
        ];
        if ( active ) {
            style.push( 'bottom: 1.5rem' );
        } else {
            style.push( 'bottom: -4rem' );
        }

        return style.join( ';' );
    };
    const toast = document.createElement( 'div' );
    const toastText = ( text ) => {
        toast.innerText = text;
    };
    toastText( 'Loading Kemono Button...' );
    toast.style = toastElement( false );
    document.body.appendChild( toast );

    try {
        // Check for Kemono Button first.
        if ( document.getElementById( 'KemonoButton' ) ) {
            toastText('Button already exists.');
            loaded = true;
            checkDataLoaded();
            return;
        }

        // Make sure it only runs on fc page (about, plans, posts, products, etc)
        if ( domain.includes( 'fantia' ) && ( pathname.includes( 'fanclubs' ) || pathname.includes( 'posts' ) || pathname.includes( 'products' ) ) && /\d/.test( pathname ) ) {
            loaded = false;
            checkDataLoaded();
            // console.log( 'Kemono Button: Fantia detected' );
            styledLog( 'Fantia detected.' );

            await awaitForElement( '.fanclub-show-header', () => {
                const fcName = document.querySelector( '.fanclub-name' ).children[ 0 ].getAttribute( 'href' );
                const userId = fcName.split( 'fanclubs/' )[ 1 ].split( '/' )[ 0 ];
                const kemonoURL = `${partyDomain.kemono}/fantia/user/${ userId }`;

                const buttonContainer = document.querySelector( '.fanclub-btns' );

                const buttonStyle = 'btn btn-warning btn-block';

                const button = document.createElement( 'button' );
                button.className = buttonStyle;
                button.style = 'margin: 0.5rem 0 0 0;';

                const anchor = document.createElement( 'a' );
                anchor.id = 'KemonoButton';
                anchor.href = kemonoURL;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer nofollow';
                anchor.style = 'text-decoration:none; color: inherit; display: flex; align-items: center; justify-content: center; gap: 0.5rem;';

                // Kemono img
                const img = document.createElement( 'img' );
                img.className = 'mr-5'
                img.src = `${partyDomain.kemono}/static/klogo.png`;
                img.style = 'width: 1.5rem; height: 1.5rem; filter: invert(100%)';

                // Text
                const text = document.createElement( 'span' );

                checkKemonoPage( kemonoURL, ( exists ) => {
                    if ( exists ) {
                        text.innerText = 'Kemono';
                    } else {
                        button.className = 'btn btn-black btn-block';
                        button.disabled = true;
                        anchor.style = 'text-decoration:none; color: inherit; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: not-allowed;';
                        anchor.onclick = ( e ) => {
                            e.preventDefault();
                        };
                        text.innerText = 'Not found';
                    }
                    button.appendChild( img );
                    button.appendChild( text );
                    anchor.appendChild( button );
                    buttonContainer.appendChild( anchor );
                } );
            } );
            // element query select .fanclub-btns
        }
        if ( domain.includes( 'fanbox' ) ) {
            loaded = false;
            checkDataLoaded();
            // console.log( 'Kemono Button: Fanbox detected' );
            styledLog( 'Fanbox detected.' )

            const tempSelector = {
                avatar: '.CreatorHeader__IsNotMobileSmallWrapper-sc-mkpnwe-3 > div:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
                container: 'div.styled__UserStatusWrapper-sc-1upaq18-19:nth-child(3)'
            };

            await awaitForElement( tempSelector.avatar, ( avatar ) => {
                const avatarURL = window.getComputedStyle( avatar ).getPropertyValue( 'background-image' );
                const userId = avatarURL.split( 'user/' )[ 1 ].split( '/' )[ 0 ];
                const kemonoURL = `${partyDomain.kemono}/fanbox/user/${ userId }`;

                const buttonContainer = document.querySelector( tempSelector.container );

                const buttonStyle = 'CommonButton__CommonButtonLikeOuter-sc-1s35wwu-1 jWpLkw';
                const divStyle = 'CommonButton__CommonButtonInner-sc-1s35wwu-2 ioTSpN';

                const button = document.createElement( 'button' );
                button.className = buttonStyle;
                button.style = 'margin: 0 0 0 0.5rem;';

                const div = document.createElement( 'div' );
                div.className = divStyle;

                const anchor = document.createElement( 'a' );
                anchor.id = 'KemonoButton'
                anchor.href = kemonoURL;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer nofollow';
                anchor.style = 'text-decoration:none; color: inherit; display: flex; align-items: center; justify-content: center; gap: 0.25rem;';

                // Kemono img
                const img = document.createElement( 'img' );
                img.src = `${partyDomain.kemono}/static/klogo.png`;
                img.className = 'FollowButton__Icon-sc-q84so8-0 beOViB';
                img.style = 'width: 1rem; height: 1rem; margin: 0 0.5rem;';

                // Text
                const text = document.createElement( 'span' );

                checkKemonoPage( kemonoURL, ( exists ) => {
                    if ( exists ) {
                        text.innerText = 'Kemono';
                    } else {
                        button.disabled = true;
                        anchor.style = 'text-decoration:none; color: inherit; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: not-allowed;';
                        anchor.onclick = ( e ) => {
                            e.preventDefault();
                        };
                        text.innerText = 'Not found';
                    }
                    div.appendChild( img );
                    div.appendChild( text );
                    button.appendChild( div );
                    anchor.appendChild( button );
                    buttonContainer.appendChild( anchor );
                } );
            } );
        }
        // Fast script, need more testing.
        // ID are changed every day (?)
        // Need better implementation
        if ( domain.includes( 'patreon' ) ) {
            loaded = false;
            checkDataLoaded();
            // console.log( 'Kemono Button: Fanbox detected' );
            styledLog( 'Patreon detected.' )

            const nameHeader = 'h1#pageheader-title';

            await awaitForElement( nameHeader, ( name ) => {
                const creatorName = name.innerText;
                let creatorId;

                const headElement = document.getElementsByTagName('head')[0].children;
                const headKeys = Object.keys(headElement);

                for(const key of headKeys){
                    const headItem = headElement[key].innerText;
                    if(headItem.includes('window.patreon')){
                        creatorId = headItem.split(`"creator":`)[1].split(`"type": "user"`)[0].split(`\"id\": \"`)[1].split(`\",\n`)[0];
                    }
                }

                const kemonoURL = `${partyDomain.kemono}/patreon/user/${ creatorId }`;
                console.log(kemonoURL);

                const containerClass = name.parentElement.className;
                const nameContainer = name.parentElement.parentElement;
                const anchorClass = document.querySelector('a[aria-disabled="false"]').className;
                const anchorTextContainerClass = document.querySelector('a[aria-disabled="false"]').children[0].className;
                const anchorTextClass = document.querySelector('a[aria-disabled="false"]').children[0].children[0].className

                const container = document.createElement('div');
                const anchorText = document.createElement('div');
                const anchorTextContainer = document.createElement('div');
                const anchor = document.createElement('a');

                container.className = containerClass;

                anchorText.innerText = 'Kemono';
                anchorText.className = anchorTextClass;

                anchorTextContainer.className = anchorTextContainerClass;

                anchor.href = kemonoURL;
                anchor.setAttribute('aria-disabled', false);
                anchor.className = anchorClass;
                anchor.id = "kemonoButton"
                anchor.style = 'width:fit-content; margin:8px 0px;'

                const img = document.createElement( 'img' );
                img.src = `${partyDomain.kemono}/static/klogo.png`;
                img.style = 'width: 1rem; height: 1rem; margin: 0 0.5rem;';

                checkKemonoPage( kemonoURL, (exists) => {
                    if(exists) {
                        anchor.setAttribute('aria-disabled', false);
                        anchor.href = kemonoURL;
                    } else {
                        anchor.setAttribute('aria-disabled', true);
                        anchor.href = '#';
                        anchor.style = 'width:fit-content; margin:8px 0px; cursor:default; pointer-events:none;'
                        anchorText.innerText = "Not found"
                    }

                    anchorTextContainer.appendChild(anchorText);
                    anchor.appendChild(img)
                    anchor.appendChild(anchorTextContainer);
                    container.appendChild(anchor);
                    nameContainer.appendChild(container);
                })
            });
        }

        // Coomer button
        if ( domain.includes( 'onlyfans' ) ) {
            loaded = false;
            checkDataLoaded();
            // console.log( 'Kemono Button: OnlyFans detected' );
            styledLog( 'Onlyfans detected.' )

            // Check if using dark mode / light mode
            let isDarkMode = document.documentElement.classList.contains( 'm-mode-dark' );
            let pageExist = false;

            // Observe change
            const observer = new MutationObserver( ( mutations ) => {
                mutations.forEach( ( mutation ) => {
                    if ( mutation.attributeName === 'class' ) {
                        if ( document.documentElement.className === 'm-mode-dark' || document.documentElement.className === '' ) {
                            isDarkMode = document.documentElement.classList.contains( 'm-mode-dark' );
                            const kemonoButtonImg = document.querySelector( '#KemonoButton > button > img' );
                            if ( !kemonoButtonImg ) return;
                            if ( pageExist ) {
                                kemonoButtonImg.style = 'width: 2.5rem; height: 2.5rem; filter: hue-rotate(190deg) brightness(1.4)';
                            } else {
                                kemonoButtonImg.style = `width: 2.5rem; height: 2.5rem; ${ isDarkMode ? '' : 'filter: invert(1)' }`;
                            }
                        }
                    }
                } );
            } );

            observer.observe( document.documentElement, { attributes: true } );

            await awaitForElement( '.b-profile__header__user.g-sides-gaps', () => {
                const usernames = document.querySelectorAll( '.g-user-username' )
                const username = usernames[usernames.length - 1].innerText.split( '@' )[ 1 ];
                if(!username) throw new Error('Can\'t find username. Please report in the thread / github.')
                const coomerURL = `${partyDomain.coomer}/onlyfans/user/${ username }`;

                const buttonContainer = document.querySelector( 'div.b-group-profile-btns:nth-child(2)' );

                const buttonStyle = 'g-btn m-rounded m-border m-icon m-icon-only m-colored has-tooltip';

                const button = document.createElement( 'button' );
                button.className = buttonStyle;

                const anchor = document.createElement( 'a' );
                anchor.id = 'KemonoButton';
                anchor.href = coomerURL;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer nofollow';

                // Coomer img
                const img = document.createElement( 'img' );
                img.src = `${partyDomain.kemono}/static/kemono-logo.svg`;
                img.style = 'width: 2.5rem; height: 2.5rem; filter: hue-rotate(190deg) brightness(1.4)';

                checkKemonoPage( coomerURL, ( exists ) => {
                    if ( exists ) {
                        pageExist = true;
                    } else {
                        pageExist = false;
                        button.disabled = true;
                        anchor.style = 'cursor: not-allowed;';
                        anchor.onclick = ( e ) => {
                            e.preventDefault();
                        };
                        img.src = `${partyDomain.kemono}/static/klogo.png`;
                        img.style = `width: 2.5rem; height: 2.5rem; ${ isDarkMode ? '' : 'filter: invert(1)' }`;
                    }
                    toastText( 'Adding button...' );
                    button.appendChild( img );
                    anchor.appendChild( button );
                    buttonContainer.appendChild( anchor );

                    const buttonArray = Array.from( buttonContainer.children ).reverse();
                    buttonArray.forEach( ( button ) => buttonContainer.appendChild( button ) );
                } );
            } );
        }

        // Fansly
        if( domain.includes( 'fansly' ) ) {
            loaded = false;
            checkDataLoaded();
            styledLog('Fansly detected.')

            await awaitForElement( 'div.profile-details', () => {
                const username = window.location.href.split('fansly.com/')[1].split('/')[0];
                if(!username) throw new Error('Can\'t find username. Please report in the thread / github.')
                const apiEndpoint = `https://apiv3.fansly.com/api/v1/account?usernames=${username}&ngsw-bypass=true`
                const xhrOptions = {
                    method: 'GET',
                    synchronous: false,
                    timeout: 50000,
                    url: apiEndpoint,
                    onload: function ( response ) {
                        if ( response.status === 200 && response.finalUrl === apiEndpoint ) {
                            const id = JSON.parse(response.responseText)['response'][0].id;
                            const coomerURL = `${partyDomain.coomer}/fansly/user/${ id }`;

                            const baseContainer = document.querySelector('div.profile-details');
                            const ngContentAttrName = Object.values(baseContainer.attributes).filter(key => key.name.startsWith('_ngcontent'))[0].name;
                            if(!ngContentAttrName) throw new Error('Can\'t find attribute name. Please report in the thread / github.');
                            const container = document.createElement('div');
                            container.className = 'follow-profile kemono-button';
                            container.setAttribute(ngContentAttrName, "");

                            const btn = document.createElement('btn');

                            const anchor = document.createElement('a')
                            anchor.href = coomerURL;
                            anchor.target = '_blank';
                            anchor.style.textDecoration = 'unset';
                            anchor.style.margin = '3.5em 0.25em 0 0.25em';
                            anchor.style.backgroundColor = 'transparent';
                            anchor.style.color = '#fff';
                            anchor.style.border = '1px solid var(--blue-1)';
                            anchor.style.borderRadius = '0.9em';
                            anchor.style.fontSize = '1.125em';
                            // anchor.style.fontWeight = '500';
                            anchor.style.display = 'flex';
                            anchor.style.justifyContent= 'center';
                            anchor.style.flexDirection = 'row';
                            anchor.style.gap = '2px';
                            anchor.style.width = '5em';
                            anchor.style.height = '1.8em';
                            anchor.style.alignItems = 'center';
                            anchor.style.cursor = 'pointer';

                            const span = document.createElement('span');
                            span.innerText = 'Coomer';
                            span.style.fontSize='0.8em';
                            span.style.fontWeight='500';


                            // Coomer img
                            const img = document.createElement( 'img' );
                            img.src = `${partyDomain.kemono}/static/kemono-logo.svg`;
                            img.style = 'width: 1em; height: 1em; filter: hue-rotate(190deg) brightness(1.4)';


                            checkKemonoPage( coomerURL, ( exists ) => {
                                if ( !exists ){
                                    btn.disabled = true;
                                    btn.style.opacity = 0.5
                                    anchor.style.cursor = 'not-allowed';
                                    anchor.onclick = ( e ) => {
                                        e.preventDefault();
                                    };
                                    img.src = `${partyDomain.kemono}/static/klogo.png`;
                                    img.style = `width: 1em; height: 1em;`;
                                }
                                toastText( 'Adding button...' );

                                anchor.append(img);
                                anchor.append(span);
                                btn.append(anchor)
                                container.append(btn)
                                baseContainer.append(container)
                            } );
                        } else {
                            styledLog('Failed to fetch data', debugMode, true)
                        }
                    },
                    onerror: function () {
                        alert( 'Request failed. Please try again later.' );
                        checkDataLoaded();
                        toastText( 'Error.' );
                    },
                    ontimeout: function () {
                        alert( 'Request timed out. Please try again later.' );
                        checkDataLoaded();
                        toastText( 'Error.' );
                    }
                };
                GM.xmlHttpRequest( xhrOptions );
            })
        }
    } catch ( error ) {
        toastText( 'Error adding button. Please report this to the developer.' );
        styledLog( error.message, debugMode, true )
        loaded = true;
        checkDataLoaded();
    }


    function awaitForElement ( selector, callback ) {
        // console.log( 'Kemono Button: Waiting for element...' );
        styledLog( 'Waiting for element...' )
        const el = document.querySelector( selector );
        return new Promise( ( resolve, reject ) => {
            if ( el ) {
                attempt = 0;
                resolve(
                    callback( el )
                );
            } else {
                if ( attempt > 10 ) {
                    toastText( 'Error: Element not found.' );
                    loaded = true;
                    checkDataLoaded();
                    reject( 'Error: Element not found.' );
                }
                attempt++;
                toastText( `Try attempt #${ attempt } - No element found. Retrying in 1 second...` );
                setTimeout( () => awaitForElement( selector, callback ), 1000 );
            }
        } )
    }

    function checkKemonoPage ( targetUrl, callback ) {
        toastText( 'Checking if page exists...' );
        loaded = false;
        const xhrOptions = {
            method: 'GET',
            synchronous: false,
            timeout: 50000,
            url: targetUrl,
            onload: function ( response ) {
                if ( response.status === 200 && response.finalUrl === targetUrl ) {
                    callback( true );
                } else {
                    callback( false );
                }
                loaded = true;
                checkDataLoaded();
                toastText( 'Done.' );
            },
            onerror: function () {
                alert( 'Request failed. Please try again later.' );
                checkDataLoaded();
                toastText( 'Error.' );
            },
            ontimeout: function () {
                alert( 'Request timed out. Please try again later.' );
                checkDataLoaded();
                toastText( 'Error.' );
            }
        };
        GM.xmlHttpRequest( xhrOptions );
    }

    function checkDataLoaded () {
        if ( loaded ) {
            toast.style = toastElement( false );
        } else {
            toast.style = toastElement( true );
        }
    }
};

// Run main function when url changes
setInterval( async () => {
    if ( window.location.href !== loadUrl ) {
        await main();
        loadUrl = window.location.href;
    }
}, 1000 );
window.addEventListener( 'load', await main, false );