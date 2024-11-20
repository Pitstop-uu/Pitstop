"use client";

import { useEffect, useState, createContext, useContext } from "react";

const SmoothScrollerContext = createContext();

export const useSmoothScroller = () => useContext(SmoothScrollerContext)

export default function ScrollContext({ children }) {
    const [lenisRef, setLenis] = useState(null);
    const [rafState, setRaf] = useState(null);
    
    useEffect(() => {
        const scroller = new Lenis();
        let rf;
  
        function raf(time) {
            scroller.raf(time)
            requestAnimationFrame(raf)
        }
        rf = requestAnimationFrame(raf);
        setRaf(rf);
        setLenis(scroller);

    return () => {
        if (lenisRef) {
            cancelAnimationFrame(rafState)
            lenisRef.destroy();
        }
    };
    }, []);
    return <SmoothScrollerContext.Provider value={lenisRef}>
        {children}
    </SmoothScrollerContext.Provider>;
}