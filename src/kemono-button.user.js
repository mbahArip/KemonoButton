// ==UserScript==
// @version         1.0.2
// @name            Kemono Button
// @namespace       https://github.com/mbaharip
// @author          mbaharip
// @description     Adds button to access artist's Kemono page
// @icon            https://kemono.party/static/favicon.ico
// @downloadURL     https://raw.githubusercontent.com/mbaharip/KemonoButton/master/src/kemono-button.user.js
// @updateURL       https://raw.githubusercontent.com/mbaharip/KemonoButton/master/src/kemono-button.meta.js
// @supportURL      https://github.com/mbahArip/KemonoButton/issues
// @match           https://fantia.jp/*
// @match           https://*.fanbox.cc/
// @match           https://www.fanbox.cc/@*
// @match           https://www.patreon.com/user/*
// @match           https://onlyfans.com/*
// @connect         self
// @connect         kemono.party
// @connect         coomer.party
// @connect         *
// @run-at          document-start
// @grant           GM.xmlHttpRequest
// @grant           GM.addStyle
// @license         GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// ==/UserScript==

var loadUrl = window.location.href;

function main () {
    'use strict';

    const domain = window.location.hostname;
    const pathname = window.location.toString();
    var attempt = 0;
    var loaded = true;
    console.log( 'Kemono Button: Running on ' + domain );

    const toastElement = ( active ) => {
        const style = [
            'position:fixed',
            'z-index: 10000002',
            'background: #47ccff',
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

    checkDataLoaded();

    try {
        // Make sure it only runs on fc page (about, plans, posts, products, etc)
        if ( domain.includes( 'fantia' ) && ( pathname.includes( 'fanclubs' ) || pathname.includes( 'posts' ) || pathname.includes( 'products' ) ) && /\d/.test( pathname ) ) {
            loaded = false;
            checkDataLoaded();
            console.log( 'Kemono Button: Fantia detected' );
            awaitForElement( '.fanclub-show-header', () => {
                const fcName = document.querySelector( '.fanclub-name' ).children[ 0 ].getAttribute( 'href' );
                const userId = fcName.split( 'fanclubs/' )[ 1 ].split( '/' )[ 0 ];
                const kemonoURL = `https://kemono.party/fantia/user/${ userId }`;

                console.log( 'Kemono Button: User ID: ' + userId );
                console.log( 'Kemono Button: Kemono URL: ' + kemonoURL );
                console.log( 'Kemono Button: Creating button' );

                const buttonContainer = document.querySelector( '.fanclub-btns' );

                const buttonStyle = 'btn btn-warning btn-block';

                const button = document.createElement( 'button' );
                button.className = buttonStyle;
                button.style = 'margin: 0.5rem 0 0 0;';

                const anchor = document.createElement( 'a' );
                anchor.href = kemonoURL;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer nofollow';
                anchor.style = 'text-decoration:none; color: inherit; display: flex; align-items: center; justify-content: center; gap: 0.5rem;';

                // Kemono img
                const img = document.createElement( 'img' );
                img.src = 'https://kemono.party/static/klogo.png';
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
                    anchor.appendChild( img );
                    anchor.appendChild( text );
                    button.appendChild( anchor );
                    buttonContainer.appendChild( button );
                } );
            } );
            // element query select .fanclub-btns
        }
        if ( domain.includes( 'fanbox' ) ) {
            loaded = false;
            checkDataLoaded();
            console.log( 'Kemono Button: Fanbox detected' );
            /**
             * Check avatar class
             * 26 March - .sc-14k46gk-3.dMigcK.sc-dzfsti-1.dFkQHW.sc-1upaq18-10.iqxGkh
             * 28 March - .LazyImage__BgImage-sc-14k46gk-3.pVmiQ.UserIcon__Icon-sc-dzfsti-1.fGNywG.styled__StyledUserIcon-sc-1upaq18-10.heHjIG
             * 
             * Check again tmrw. If it changing again, search another way to get ID, and button container.
             */
            awaitForElement( '.sc-14k46gk-3.dMigcK.sc-dzfsti-1.dFkQHW.sc-1upaq18-10.iqxGkh', ( avatar ) => {
                const avatarURL = window.getComputedStyle( avatar ).getPropertyValue( 'background-image' );
                const userId = avatarURL.split( 'user/' )[ 1 ].split( '/' )[ 0 ];
                const kemonoURL = `https://kemono.party/fanbox/user/${ userId }`;

                const buttonContainer = document.querySelector( 'div.sc-1upaq18-7.dyOA-dD > div.sc-1upaq18-19.geuERQ' );

                const buttonStyle = 'sc-1pize7g-0 sc-1s35wwu-0 iMpXkC cQaBde CreatorHeader__HeaderFollowButton-sc-mkpnwe-1 dxFMmE cCRauH';
                const divStyle = 'sc-1s35wwu-2 ieoUtK';

                const button = document.createElement( 'button' );
                button.className = buttonStyle;
                button.style = 'margin: 0 0 0 0.5rem;';

                const anchor = document.createElement( 'a' );
                anchor.className = divStyle;
                anchor.href = kemonoURL;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer nofollow';
                anchor.style = 'text-decoration:none; color: inherit; display: flex; align-items: center; justify-content: center; gap: 0.25rem;';

                // Kemono img
                const img = document.createElement( 'img' );
                img.src = 'https://kemono.party/static/klogo.png';
                img.className = 'sc-q84so8-0 fLiaHw';
                img.style = 'width: 1rem; height: 1rem;';

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
                    anchor.appendChild( img );
                    anchor.appendChild( text );
                    button.appendChild( anchor );
                    buttonContainer.appendChild( button );
                } );
            } );
        }
        if ( domain === 'patreon' ) { }

        // Coomer button
        if ( domain.includes( 'onlyfans' ) ) {
            loaded = false;
            checkDataLoaded();
            console.log( 'Kemono Button: OnlyFans detected' );

            // Check if using dark mode / light mode
            let isDarkMode = document.documentElement.classList.contains( 'm-mode-dark' );
            let pageExist = false;

            // Observe change
            const observer = new MutationObserver( ( mutations ) => {
                mutations.forEach( ( mutation ) => {
                    if ( mutation.attributeName === 'class' ) {
                        if ( document.documentElement.className === 'm-mode-dark' || document.documentElement.className === '' ) {
                            isDarkMode = document.documentElement.classList.contains( 'm-mode-dark' );
                            const kemonoButton = document.querySelector( '#KemonoButton > button > img' );
                            if ( !kemonoButton ) return;
                            if ( pageExist ) {
                                kemonoButton.style = 'width: 2.5rem; height: 2.5rem; filter: hue-rotate(190deg) brightness(1.4)';
                            } else {
                                kemonoButton.style = `width: 2.5rem; height: 2.5rem; ${ isDarkMode ? '' : 'filter: invert(1)' }`;
                            }
                        }
                    }
                } );
            } );

            observer.observe( document.documentElement, { attributes: true } );


            awaitForElement( '.g-user-username', ( username ) => {
                const user = username.innerText.split( '@' )[ 1 ];
                const coomerURL = `https://coomer.party/onlyfans/user/${ user }`;

                const buttonContainer = document.querySelector( 'div.b-group-profile-btns:nth-child(2)' );

                const buttonStyle = 'g-btn m-rounded m-border m-icon m-icon-only m-colored has-tooltip';

                const button = document.createElement( 'button' );
                button.className = buttonStyle;

                const anchor = document.createElement( 'a' );
                anchor.href = coomerURL;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer nofollow';
                anchor.id = 'KemonoButton';

                // Coomer img
                const img = document.createElement( 'img' );
                img.src = 'https://kemono.party/static/kemono-logo.svg';
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
                        img.src = 'https://kemono.party/static/klogo.png';
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
    } catch ( error ) {
        toastText( 'Error adding button. Please report this to the developer.' );
        console.error( error );
        loaded = true;
        checkDataLoaded();
    }


    function awaitForElement ( selector, callback ) {
        const el = document.querySelector( selector );
        if ( el ) {
            attempt = 0;
            callback( el );
        } else {
            if ( attempt > 10 ) {
                toastText( 'Error: Element not found.' );
                loaded = true;
                checkDataLoaded();
                return;
            }
            setTimeout( () => awaitForElement( selector, callback ), 1000 );
            attempt++;
            toastText( `Try attempt #${ attempt } - No element found. Retrying in 1 second...` );
        }
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
                console.log( response );
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
            console.log( 'Data is loaded, hiding toast...' );
            toast.style = toastElement( false );
        } else {
            console.log( 'Data isn\'t loaded, showing toast...' );
            toast.style = toastElement( true );
        }
    }
};

// Run main function when url changes
setInterval( () => {
    if ( window.location.href !== loadUrl ) {
        main();
        loadUrl = window.location.href;
    }
}, 1000 );
window.addEventListener( 'hashchange', () => {
    if ( window.location.href !== loadUrl ) {
        main();
        loadUrl = window.location.href;
    }
}, false );
window.addEventListener( 'popstate', () => {
    if ( window.location.href !== loadUrl ) {
        main();
        loadUrl = window.location.href;
    }
}, false );
window.addEventListener( 'load', main, false );