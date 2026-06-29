"use client";


import { useEffect, useRef, useState } from "react";
import styles from "./PreloaderSection.module.css";


export function Preloader() {
    const [ visible, set_visible ] = useState( true );
    const [ fading, set_fading ] = useState( false );
    const preloader_ref = useRef( null );

    function wait_for_transition_end(  callback: () => void ) {
        callback();

        setTimeout( () => {
            //document.querySelector(".preloader_section").style.display = "none";
        }, 1000);
    }

    useEffect( () => {
        document.body.style.overflow = "hidden";
        const delay = 3300;

        const on_load = async () => {
            await new Promise( ( resolve ) => setTimeout( resolve, delay ) );

            set_fading( true );
            document.body.classList.add( "preloader_done" );

            const el = preloader_ref.current;


            wait_for_transition_end( () => {
                document.body.style.overflow = "";
            });
        };

        if ( document.readyState === "complete" ) {
            on_load();
        } else {
            window.addEventListener( "load", on_load );
        }

        return () => {
            window.removeEventListener( "load", on_load );
            document.body.style.overflow = "";
        };

    }, [] );

    if ( !visible ) {

        //return null;
    }

    return (
        <section
            ref={ preloader_ref }
            className={
                `${ styles.preloader_section } ${ fading ? styles.hidden : "" }`
            }
            data-preloader-section={1}>
            <div className={styles.preloader_container}>
                <h3 className={styles.top_title}>Инвестируй</h3>
                <h3 className={styles.bottom_title}>в будущее</h3>
            </div>
        </section>
    );

}