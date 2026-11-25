import { useId } from 'react';

interface BrandLogoProps {
  /** Whether the logo is rendered over the dark Hero (unscrolled nav) vs. theme-aware scrolled nav. */
  onHero?: boolean;
}

export function BrandLogo({ onHero = false }: BrandLogoProps) {
  const uid = useId().replace(/:/g, '');
  const cyanBrightId = `${uid}-cyan-bright`;
  const cyanVertId = `${uid}-cyan-vert`;
  const midBlueId = `${uid}-mid-blue`;
  const violetShadowId = `${uid}-violet-shadow`;
  const violetDeepId = `${uid}-violet-deep`;
  const glowId = `${uid}-neon-glow`;

  return (
    <span className='inline-flex items-center gap-2.5 sm:gap-3'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='16 14 340 318'
        className='h-8 w-auto shrink-0 sm:h-9'
        aria-hidden='true'
        focusable='false'
      >
        <defs>
          <linearGradient id={cyanBrightId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#A5FCFF' />
            <stop offset='45%' stopColor='#22E5FF' />
            <stop offset='100%' stopColor='#2B8CFF' />
          </linearGradient>

          <linearGradient id={cyanVertId} x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#9BFAFF' />
            <stop offset='50%' stopColor='#1FD4FF' />
            <stop offset='100%' stopColor='#4A7DFF' />
          </linearGradient>

          <linearGradient id={midBlueId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#38BDF8' />
            <stop offset='50%' stopColor='#4F6BFF' />
            <stop offset='100%' stopColor='#7C3AED' />
          </linearGradient>

          <linearGradient
            id={violetShadowId}
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#6D4AFF' />
            <stop offset='55%' stopColor='#8B35FF' />
            <stop offset='100%' stopColor='#C03EFF' />
          </linearGradient>

          <linearGradient id={violetDeepId} x1='0%' y1='100%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#5B21B6' />
            <stop offset='55%' stopColor='#7E22CE' />
            <stop offset='100%' stopColor='#A855F7' />
          </linearGradient>

          <filter id={glowId} x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='5' result='blur' />
            <feColorMatrix
              in='blur'
              type='matrix'
              values='0.5 0 0 0 0.1  0 0.6 0 0 0.1  0 0 1 0 0.25  0 0 0 0.65 0'
              result='tinted'
            />
            <feMerge>
              <feMergeNode in='tinted' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        <g
          transform='translate(-14, -30)'
          filter={`url(#${glowId})`}
          strokeLinejoin='miter'
        >
          {/* Top-center Y fork accent wedge */}
          <g>
            <polygon
              points='140,48 206,48 164,126 140,126'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='140,48 206,48 188,68 156,68'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='140,48 156,68 156,112 140,126'
              fill={`url(#${violetDeepId})`}
            />
            <polygon
              points='206,48 164,126 156,112 188,68'
              fill={`url(#${midBlueId})`}
            />
          </g>

          {/* Left-side accent triangle */}
          <g>
            <polygon
              points='82,166 122,222 82,276'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='82,166 122,222 96,222'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='82,166 96,222 82,276'
              fill={`url(#${midBlueId})`}
            />
          </g>

          {/* Bottom-left accent triangle */}
          <g>
            <polygon
              points='148,352 176,306 176,352'
              fill={`url(#${midBlueId})`}
            />
            <polygon
              points='148,352 176,306 168,338'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='148,352 168,338 176,352'
              fill={`url(#${violetShadowId})`}
            />
          </g>

          {/* Y Left Arm */}
          <g>
            <polygon
              points='36,48 72,48 166,204 146,236'
              fill={`url(#${cyanVertId})`}
            />
            <polygon
              points='72,48 106,48 184,174 166,204'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='36,48 106,48 88,64 56,64'
              fill='#B8FDFF'
              opacity='0.85'
            />
            <polyline
              points='72,48 166,204'
              fill='none'
              stroke='#E0FEFF'
              strokeWidth='2'
              opacity='0.85'
            />
            <polygon
              points='36,48 56,64 150,220 146,236'
              fill={`url(#${midBlueId})`}
              opacity='0.55'
            />
          </g>

          {/* Y Main Diagonal Spine */}
          <g>
            <polygon
              points='222,48 256,48 98,352 62,352'
              fill={`url(#${cyanVertId})`}
            />
            <polygon
              points='256,48 290,48 132,352 98,352'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='222,48 290,48 272,62 236,62'
              fill='#B8FDFF'
              opacity='0.9'
            />
            <polygon
              points='62,352 98,334 132,352'
              fill={`url(#${violetDeepId})`}
            />
            <polyline
              points='256,48 98,352'
              fill='none'
              stroke='#E0FEFF'
              strokeWidth='2.2'
              opacity='0.9'
            />
            <polygon
              points='222,48 290,48 132,352 62,352'
              fill='none'
              stroke='#7CF9FF'
              strokeWidth='1.2'
              opacity='0.6'
            />
          </g>

          {/* Interlocking Angular 3D "B" */}
          <g>
            <polygon
              points='304,48 358,98 334,110 294,74'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='304,48 294,74 282,96 270,116'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='358,98 358,174 334,164 334,110'
              fill={`url(#${cyanVertId})`}
            />
            <polygon
              points='334,110 334,164 316,154 316,118'
              fill={`url(#${midBlueId})`}
            />
            <polygon
              points='294,74 334,110 316,118 286,92'
              fill={`url(#${violetShadowId})`}
            />

            <polygon
              points='262,128 262,180 232,180'
              fill={`url(#${cyanVertId})`}
            />
            <polygon
              points='262,128 250,152 250,180 232,180'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='232,180 316,180 334,164 358,174 328,202 222,202'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='222,202 328,202 312,222 222,222'
              fill={`url(#${violetShadowId})`}
            />
            <line
              x1='224'
              y1='202'
              x2='328'
              y2='202'
              stroke='#B8FDFF'
              strokeWidth='1.8'
              opacity='0.85'
            />

            <polygon
              points='328,202 358,232 334,242 312,222'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='358,232 358,302 334,292 334,242'
              fill={`url(#${midBlueId})`}
            />
            <polygon
              points='334,242 334,292 314,282 314,250'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='358,302 308,352 296,328 334,292'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='334,292 296,328 288,308 314,282'
              fill={`url(#${cyanVertId})`}
            />

            <polygon
              points='190,352 308,352 296,328 214,328'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='214,328 296,328 288,308 232,308'
              fill={`url(#${cyanBrightId})`}
            />

            <polygon
              points='190,352 232,272 232,308 214,328'
              fill={`url(#${cyanVertId})`}
            />
            <polygon
              points='232,272 246,246 246,308 232,308'
              fill={`url(#${violetShadowId})`}
            />
            <polygon
              points='190,352 214,328 214,306 232,272'
              fill={`url(#${midBlueId})`}
              opacity='0.5'
            />

            <polygon
              points='256,248 284,248 256,278'
              fill={`url(#${cyanBrightId})`}
            />
            <polygon
              points='256,248 268,258 256,278'
              fill={`url(#${midBlueId})`}
            />

            <polyline
              points='304,48 358,98 358,174 328,202 358,232 358,302 308,352 190,352'
              fill='none'
              stroke='#9BFAFF'
              strokeWidth='1.4'
              opacity='0.65'
            />
          </g>
        </g>
      </svg>

      <span className='flex flex-col leading-tight'>
        <span
          className={`font-display text-sm font-extrabold tracking-[0.04em] uppercase sm:text-base transition-colors duration-300 ${
            onHero ? 'text-white' : 'text-ink-900 dark:text-white'
          }`}
        >
          Yunior Batista
        </span>
        <span
          className={`hidden sm:block text-[10px] font-bold tracking-[0.16em] uppercase bg-clip-text text-transparent ${
            onHero
              ? 'bg-linear-to-r from-[#c056ff] via-[#7c8bff] to-[#4ce8ff]'
              : 'bg-linear-to-r from-violet-a to-primary-600 dark:from-[#c056ff] dark:via-[#7c8bff] dark:to-[#4ce8ff]'
          }`}
        >
          Senior Frontend Engineer
        </span>
      </span>
    </span>
  );
}
