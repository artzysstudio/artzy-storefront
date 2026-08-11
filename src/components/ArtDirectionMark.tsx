import type { ArtDirectionId } from '@/data/artDirections';

type Props = {
  direction: ArtDirectionId;
  className?: string;
  frame?: boolean;
};

export default function ArtDirectionMark({ direction, className = '', frame = false }: Props) {
  const common = { vectorEffect: 'non-scaling-stroke' as const };
  return <svg className={`art-direction-mark ${frame ? 'art-direction-mark--frame' : ''} ${className}`} viewBox="0 0 120 80" aria-hidden="true" focusable="false">
    <rect className="art-direction-mark__paper" x="1" y="1" width="118" height="78" rx="5"/>
    {direction === 'botanical' && <g className="art-direction-mark__line" {...common}>
      <path d="M15 69C30 60 31 42 44 33S70 26 87 10"/><path d="M43 34C32 35 24 29 22 21c10-1 18 4 21 13ZM55 28c2-10 10-17 19-18 1 10-7 17-19 18ZM29 54c-9 2-17-2-21-9 8-4 17 0 21 9ZM68 22c5 3 8 9 7 15-7 0-12-5-13-11"/>
      <circle cx="91" cy="12" r="9"/><circle cx="91" cy="12" r="3"/><path d="m91 3 3 6 6-3-3 6 6 3-7 2 2 7-6-4-4 6-1-7-7 1 5-6-5-5 7 1Z"/>
    </g>}
    {direction === 'lotus' && <g className="art-direction-mark__line" {...common}>
      <path d="M60 64C36 56 27 42 31 28c12 1 22 7 29 19 7-12 17-18 29-19 4 14-5 28-29 36Z"/><path d="M60 58C46 48 44 30 60 14c16 16 14 34 0 44Z"/><path d="M60 57C54 44 58 32 70 23c8 13 4 26-10 34ZM60 57C66 44 62 32 50 23c-8 13-4 26 10 34Z"/><path d="M28 68c18-6 46-6 64 0"/>
    </g>}
    {direction === 'warli' && <g className="art-direction-mark__line art-direction-mark__line--warli" {...common}>
      <path d="M8 66h104M12 14h96M16 14l5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6 5-6 5 6"/>
      <path d="M14 53 28 39l14 14M18 53V39h20v14M24 31h8l8 8H16l8-8Z"/>
      <circle cx="59" cy="29" r="4"/><path d="m59 33-8 10h16l-8-10Zm0 10-8 10h16l-8-10ZM51 39l-9 5m25-5 9 5M55 53l-3 10m11-10 3 10"/>
      <circle cx="87" cy="33" r="4"/><path d="m87 37-7 9h14l-7-9Zm0 9-7 9h14l-7-9ZM80 42l-8-5m22 5 8-5M83 55l-2 8m10-8 2 8"/>
      <path d="M105 58V31m0 2-8 6m8-1 8 7m-8-20-6 6m6-6 5 5"/>
    </g>}
    {direction === 'madhubani' && <g className="art-direction-mark__line art-direction-mark__line--madhubani" {...common}>
      <rect x="8" y="8" width="104" height="64" rx="2"/><rect x="12" y="12" width="96" height="56" rx="2"/>
      <path d="M28 41c13-18 35-18 48 0-13 18-35 18-48 0Zm48 0 16-12v24L76 41Z"/><circle cx="39" cy="38" r="2.5"/><path d="M47 29c3 7 3 17 0 24m9-28c4 10 4 22 0 31m10-27c4 8 4 16 0 24"/>
      <path d="M19 63V24m0 7 7-5m-7 13-7-5m7 13 7-5m-7 13-7-5M99 63V24m0 7 7-5m-7 13-7-5m7 13 7-5m-7 13-7-5"/>
      <circle cx="19" cy="19" r="4"/><circle cx="99" cy="19" r="4"/>
    </g>}
    {direction === 'geometric' && <g className="art-direction-mark__line art-direction-mark__line--geometric" {...common}>
      <path d="m8 40 18-18 18 18-18 18L8 40Zm36 0 18-18 18 18-18 18-18-18Zm36 0 18-18 18 18-18 18-18-18Z"/><circle cx="26" cy="40" r="7"/><circle cx="62" cy="40" r="7"/><circle cx="98" cy="40" r="7"/><path d="M8 13h108M8 67h108"/>
    </g>}
    {direction === 'abstract' && <g className="art-direction-mark__fill">
      <path d="M5 59C19 29 33 17 54 29s24 7 35-14c16 10 25 28 25 55H5Z"/><circle cx="36" cy="27" r="17"/><path d="M63 8c15 7 24 19 25 36-13 5-24 0-34-14Z"/>
    </g>}
    {direction === 'watercolour' && <g className="art-direction-mark__wash">
      <circle cx="37" cy="37" r="24"/><circle cx="67" cy="29" r="21"/><circle cx="78" cy="52" r="23"/><circle cx="49" cy="57" r="17"/>
    </g>}
    {direction === 'minimal' && <g className="art-direction-mark__line" {...common}><path d="M18 24h84M18 56h84"/><circle cx="60" cy="40" r="5"/></g>}
    {direction === 'recommend' && <g className="art-direction-mark__line" {...common}><path d="m60 13 5 18 18 5-18 5-5 19-5-19-18-5 18-5 5-18Z"/><circle cx="60" cy="36" r="25"/></g>}
  </svg>;
}
