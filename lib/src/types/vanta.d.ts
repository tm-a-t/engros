declare module 'vanta/dist/vanta.fog.min' {
    interface VantaFogOptions {
        el: string | HTMLElement;
        THREE: typeof THREE;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        highlightColor?: string;
        midtoneColor?: string;
        lowlightColor?: string;
        baseColor?: string;
        blurFactor?: number;
        speed?: number;
        zoom?: number;
    }

    const FOG: (options: VantaFogOptions) => { destroy: () => void };

    export default FOG;
}

declare module 'vanta/dist/vanta.waves.min' {
    interface VantaWavesOptions {
        el: string | HTMLElement;
        THREE: typeof THREE;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        color?: string;
        shininess?: number;
        waveHeight?: number;
        waveSpeed?: number;
        zoom?: number;
    }

    const WAVES: (options: VantaWavesOptions) => { destroy: () => void };

    export default WAVES;
}

declare module 'vanta/dist/vanta.birds.min' {
    interface VantaBirdsOptions {
        el: string | HTMLElement;
        THREE: typeof THREE;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        backgroundColor?: string;
        color1?: string;
        color2?: string;
        colorMode?: string;
        quantity?: number;
        birdSize?: number;
        wingSpan?: number;
        speedLimit?: number;
        separation?: number;
        alignment?: number;
        cohesion?: number;
    }

    const BIRDS: (options: VantaBirdsOptions) => { destroy: () => void };

    export default BIRDS;
}

declare module 'vanta/dist/vanta.net.min' {
    interface VantaNetOptions {
        el: string | HTMLElement;
        THREE: typeof THREE;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        color?: string;
        backgroundColor?: string;
        points?: number;
        maxDistance?: number;
        spacing?: number;
        showDots?: boolean;
    }

    const NET: (options: VantaNetOptions) => { destroy: () => void };

    export default NET;
}

declare module 'vanta/dist/vanta.rings.min' {
    interface VantaRingsOptions {
        el: string | HTMLElement;
        THREE: typeof THREE;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        backgroundColor?: string;
        color?: string;
    }

    const RINGS: (options: VantaRingsOptions) => { destroy: () => void };

    export default RINGS;
}
