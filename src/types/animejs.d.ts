declare module 'animejs' {
  interface AnimeParams {
    targets?: string | Element | Element[] | NodeList | Record<string, unknown> | null;
    duration?: number;
    delay?: number | ((el: Element, i: number, l: number) => number);
    endDelay?: number;
    easing?: string;
    round?: number;
    direction?: 'normal' | 'reverse' | 'alternate';
    loop?: boolean | number;
    autoplay?: boolean;
    begin?: (anim: AnimeInstance) => void;
    update?: (anim: AnimeInstance) => void;
    complete?: (anim: AnimeInstance) => void;
    // Animatable properties
    translateX?: number | string | (number | string)[];
    translateY?: number | string | (number | string)[];
    translateZ?: number | string | (number | string)[];
    rotate?: number | string | (number | string)[];
    rotateX?: number | string | (number | string)[];
    rotateY?: number | string | (number | string)[];
    rotateZ?: number | string | (number | string)[];
    scale?: number | (number | string)[];
    scaleX?: number | (number | string)[];
    scaleY?: number | (number | string)[];
    opacity?: number | number[];
    color?: string | string[];
    backgroundColor?: string | string[];
    borderRadius?: number | string | (number | string)[];
    width?: number | string | (number | string)[];
    height?: number | string | (number | string)[];
    boxShadow?: string | string[];
    innerHTML?: number | string;
    // Stagger
    [key: string]: unknown;
  }

  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    began: boolean;
    paused: boolean;
    completed: boolean;
    finished: Promise<void>;
    animatables: unknown[];
    animations: unknown[];
    duration: number;
    currentTime: number;
    progress: number;
  }

  interface AnimeStaggerOptions {
    start?: number | string;
    from?: number | string | 'first' | 'last' | 'center';
    direction?: 'normal' | 'reverse';
    easing?: string;
    grid?: [number, number];
    axis?: 'x' | 'y';
  }

  function anime(params: AnimeParams): AnimeInstance;

  namespace anime {
    function stagger(
      value: number | string | (number | string)[],
      options?: AnimeStaggerOptions,
    ): (el: Element, i: number, l: number) => number;
    function remove(targets: string | Element | Element[] | NodeList): void;
    function timeline(params?: AnimeParams): AnimeInstance & {
      add(params: AnimeParams, offset?: number | string): AnimeInstance;
    };
    function random(min: number, max: number): number;
    function set(
      targets: string | Element | Element[] | NodeList,
      props: Record<string, unknown>,
    ): void;
    const running: AnimeInstance[];
  }

  export = anime;
}
