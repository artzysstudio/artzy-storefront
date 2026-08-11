export type ArtDirectionId =
  | 'abstract'
  | 'geometric'
  | 'botanical'
  | 'lotus'
  | 'warli'
  | 'madhubani'
  | 'watercolour'
  | 'minimal'
  | 'recommend';

export type ArtDirection = {
  id: ArtDirectionId;
  name: string;
  shortNote: string;
  visualLanguage: string;
  studioNote: string;
};

/**
 * Shared catalogue of visual directions used by customer-facing builders.
 * Folk-art names describe the requested visual language; they do not claim
 * provenance, community authorship or certification for a finished piece.
 */
export const ART_DIRECTIONS: Record<ArtDirectionId, ArtDirection> = {
  abstract: {
    id: 'abstract',
    name: 'Abstract & modern',
    shortNote: 'Layered colour, movement and atmosphere',
    visualLanguage: 'Overlapping organic forms, gestural marks and open space',
    studioNote: 'Original Artzy composition developed for the chosen palette and space.',
  },
  geometric: {
    id: 'geometric',
    name: 'Geometric',
    shortNote: 'Balanced lines, repeated shapes and visual rhythm',
    visualLanguage: 'Grids, diamonds, triangles, circles and measured repetition',
    studioNote: 'A contemporary geometric composition, not a generic folk-art substitute.',
  },
  botanical: {
    id: 'botanical',
    name: 'Flowers & botanical',
    shortNote: 'Recognisable stems, leaves, buds and open flowers',
    visualLanguage: 'Curving stems, paired leaves and hand-drawn floral forms',
    studioNote: 'Botanical details are composed in Deepti’s own studio style.',
  },
  lotus: {
    id: 'lotus',
    name: 'Lotus',
    shortNote: 'Layered lotus petals with fine foliage',
    visualLanguage: 'A centred lotus, nested petals, leaves and calm symmetry',
    studioNote: 'A lotus-led Artzy composition adapted to the selected format.',
  },
  warli: {
    id: 'warli',
    name: 'Warli-inspired narrative',
    shortNote: 'Storytelling figures, village life and rhythmic borders',
    visualLanguage: 'Circle-and-triangle figures, movement, huts, trees and linear borders',
    studioNote: 'A respectful Warli-inspired direction; final authorship and provenance are stated accurately by the studio.',
  },
  madhubani: {
    id: 'madhubani',
    name: 'Madhubani-inspired detail',
    shortNote: 'Double outlines, dense florals and patterned forms',
    visualLanguage: 'Double-line drawing, fish or nature motifs and filled decorative hatching',
    studioNote: 'A Madhubani-inspired direction, not represented as a certified traditional community artwork.',
  },
  watercolour: {
    id: 'watercolour',
    name: 'Watercolour softness',
    shortNote: 'Transparent washes and expressive edges',
    visualLanguage: 'Layered translucent colour, soft blooms and visible paper space',
    studioNote: 'Final colour behaviour varies between original watercolour and printed artwork.',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    shortNote: 'Clean border with one signature accent',
    visualLanguage: 'Fine lines, restrained spacing and a single focal mark',
    studioNote: 'Lettering and proportion carry the composition.',
  },
  recommend: {
    id: 'recommend',
    name: 'Recommend a direction',
    shortNote: 'Let Deepti interpret the brief',
    visualLanguage: 'Selected after reviewing the story, room, purpose and references',
    studioNote: 'The studio explains the proposed direction before production.',
  },
};

export const DIGITAL_ART_DIRECTION_IDS: ArtDirectionId[] = [
  'abstract', 'geometric', 'botanical', 'warli', 'madhubani', 'watercolour', 'recommend',
];
