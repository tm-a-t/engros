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