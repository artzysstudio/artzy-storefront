'use client';

import ArtzyAICreativeTool from '@/components/ArtzyAICreativeTool';

type ConceptBrief = {
  kind: 'name-plate' | 'digital-art' | 'caricature' | 'gift' | 'business' | 'personalised';
  style: string;
  palette: string;
  shape?: string;
  material?: string;
  purpose?: string;
};

type Props = {
  brief: ConceptBrief;
  title: string;
  primaryText?: string;
  secondaryText?: string;
  studioMessage: string;
  enabled?: boolean;
  disabledHint?: string;
  referenceFiles?: File[];
  referenceConsent?: boolean;
  maxGenerations?: number;
  quotaKey?: string;
  aspectRatio?: '1:1' | '4:5' | '3:2' | '16:9';
};

export default function AIConceptPreview({ brief, title, primaryText = '', secondaryText = '', studioMessage, enabled = true, disabledHint, referenceFiles = [], referenceConsent = false, maxGenerations, quotaKey, aspectRatio }: Props) {
  const variant = brief.kind === 'name-plate' ? 'namePlate' : brief.kind === 'digital-art' ? 'digitalArt' : brief.kind === 'gift' ? 'gift' : 'personalised';
  return <ArtzyAICreativeTool
    variant={variant}
    title={title}
    purpose={[brief.purpose, brief.shape, brief.material].filter(Boolean).join('. ') || 'Personal custom artwork'}
    style={brief.style}
    palette={brief.palette.split(',').map(item => item.trim()).filter(Boolean)}
    exactText={primaryText}
    secondaryText={secondaryText}
    enabled={enabled}
    disabledHint={disabledHint}
    referenceFiles={referenceFiles}
    referenceConsent={referenceConsent}
    studioMessage={studioMessage}
    maxGenerations={maxGenerations}
    quotaKey={quotaKey}
    aspectRatio={aspectRatio}
  />;
}
