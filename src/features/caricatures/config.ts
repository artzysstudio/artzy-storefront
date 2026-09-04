export const CARICATURE_STYLE_IDS = ['cute_cartoon','classic_exaggerated','semi_realistic','digital_painting','watercolour','pencil_sketch'] as const;
export type CaricatureStyleId = typeof CARICATURE_STYLE_IDS[number];
export type CompositionId = 'face'|'half_body'|'full_body'|'themed_scene';
export type SubjectId = 'one_person'|'couple'|'family'|'friends_team'|'pet_only'|'person_with_pet'|'group';

export type CaricatureStyle = {
  id: CaricatureStyleId; name: string; summary: string; bestFor: string; image: string;
  positive: string; negative: string; strength: number; guidance: number;
  compositions: CompositionId[];
};

const ALL: CompositionId[] = ['face','half_body','full_body','themed_scene'];
export const CARICATURE_STYLES: Record<CaricatureStyleId, CaricatureStyle> = {
  cute_cartoon:{id:'cute_cartoon',name:'Cute Cartoon',summary:'Friendly expressions, soft colour and gently enlarged heads.',bestFor:'Children, birthdays and families',image:'/images/caricature-style-cute-cartoon.webp',positive:'clean polished 2D cute cartoon portrait illustration, crisp confident outlines, smooth warm colour, gently enlarged head, cheerful friendly expression, bright recognisable eyes, flattering youthful finish',negative:'oil paint, oil painting, canvas texture, impasto, rough brush strokes, muddy colour, elderly appearance, wrinkles, asymmetrical eyes, distorted glasses, babyish distortion, plastic 3D character',strength:.34,guidance:9.5,compositions:ALL},
  classic_exaggerated:{id:'classic_exaggerated',name:'Classic Exaggerated',summary:'Recognisable features with playful exaggeration and smaller body proportions.',bestFor:'Humorous gifts, farewells and retirement',image:'/images/caricature-style-classic-exaggerated.webp',positive:'classic editorial caricature, respectfully exaggerated distinctive features, smaller body proportions, lively ink line',negative:'grotesque features, ridicule, offensive exaggeration',strength:.68,guidance:8.5,compositions:ALL},
  semi_realistic:{id:'semi_realistic',name:'Semi-Realistic',summary:'Strong resemblance with moderate exaggeration and a refined finish.',bestFor:'Couples, professionals and premium gifts',image:'/images/caricature-style-semi-realistic.webp',positive:'semi-realistic refined digital portrait, strong resemblance, moderate flattering exaggeration',negative:'photographic copy, extreme distortion',strength:.48,guidance:7.5,compositions:ALL},
  digital_painting:{id:'digital_painting',name:'Digital Painting',summary:'Detailed painted appearance with rich light, shading and colour.',bestFor:'Framed personalised gifts',image:'/images/caricature-style-digital-painting.webp',positive:'detailed original digital painting, rich natural lighting, painterly shading, subtle caricature proportions',negative:'flat vector art, muddy colour',strength:.52,guidance:8,compositions:ALL},
  watercolour:{id:'watercolour',name:'Watercolour',summary:'Soft brush texture, artistic blending and an elegant light background.',bestFor:'Weddings, anniversaries and families',image:'/images/caricature-style-watercolour.webp',positive:'elegant hand-painted watercolour and fine ink, soft brush texture, artistic colour blending, light paper background',negative:'hard 3D render, heavy black background',strength:.55,guidance:8,compositions:ALL},
  pencil_sketch:{id:'pencil_sketch',name:'Pencil Sketch',summary:'Graphite-inspired drawing with restrained colour and clean facial detail.',bestFor:'Classic portraits and memorial tributes',image:'/images/caricature-style-pencil-sketch.webp',positive:'refined graphite and charcoal portrait sketch, mostly monochrome, clean facial detail, subtle paper grain',negative:'bright saturated colour, messy scribble',strength:.46,guidance:7.5,compositions:['face','half_body','full_body']},
};

export const OCCASIONS = ['birthday','wedding','anniversary','retirement','farewell','graduation','corporate_recognition','festival','memorial_tribute','social_avatar','invitation_card','framed_gift','other'] as const;
export const COMPOSITIONS: {id:CompositionId;label:string}[] = [{id:'face',label:'Face only'},{id:'half_body',label:'Half body'},{id:'full_body',label:'Full body'},{id:'themed_scene',label:'Themed scene'}];
export const SUBJECTS: {id:SubjectId;label:string;people:number;pets:number}[] = [{id:'one_person',label:'One person',people:1,pets:0},{id:'couple',label:'Couple',people:2,pets:0},{id:'family',label:'Family',people:3,pets:0},{id:'friends_team',label:'Friends / team',people:3,pets:0},{id:'pet_only',label:'Pet only',people:0,pets:1},{id:'person_with_pet',label:'Person with pet',people:1,pets:1},{id:'group',label:'Group',people:4,pets:0}];
export const OUTPUTS = ['digital_file','printed_artwork','framed_artwork','gift_ready','studio_guidance'] as const;

export type CaricatureBrief = {styleId:CaricatureStyleId;occasion:typeof OCCASIONS[number];composition:CompositionId;subject:SubjectId;people:number;pets:number;profession:string;hobbies:string;colours:string;clothing:string;background:string;props:string;notes:string;output:typeof OUTPUTS[number]};
export type CaricatureExaggeration = 'soft' | 'classic' | 'funny';
const plain=(v:unknown,max=120)=>typeof v==='string'?v.replace(/[<>\r\n{}\[\]`]/g,' ').replace(/\s+/g,' ').trim().slice(0,max):'';
export function parseCaricatureBrief(body:Record<string,unknown>):CaricatureBrief|null{
  const styleId=plain(body.styleId,30) as CaricatureStyleId, occasion=plain(body.occasion,40) as CaricatureBrief['occasion'], composition=plain(body.composition,20) as CompositionId, subject=plain(body.subject,30) as SubjectId, output=plain(body.output,30) as CaricatureBrief['output'];
  const people=Number(body.people),pets=Number(body.pets);
  if(!CARICATURE_STYLE_IDS.includes(styleId)||!OCCASIONS.includes(occasion)||!COMPOSITIONS.some(x=>x.id===composition)||!SUBJECTS.some(x=>x.id===subject)||!OUTPUTS.includes(output)||!Number.isInteger(people)||!Number.isInteger(pets)||people<0||people>12||pets<0||pets>6) return null;
  if(!CARICATURE_STYLES[styleId].compositions.includes(composition)) return null;
  return {styleId,occasion,composition,subject,people,pets,output,profession:plain(body.profession),hobbies:plain(body.hobbies),colours:plain(body.colours,80),clothing:plain(body.clothing),background:plain(body.background),props:plain(body.props),notes:plain(body.notes,240)};
}
export const aiReliable=(brief:Pick<CaricatureBrief,'people'|'pets'>)=>brief.people<=4&&brief.pets<=2&&(brief.people+brief.pets)>0;
export const hasExplicitConsent=(value:unknown)=>value===true;
export function validatePhotoFile(file:{type:string;size:number}){if(!/^image\/(jpeg|png|webp)$/.test(file.type))return 'Choose a JPG, PNG or WebP photo.';if(file.size>8*1024*1024)return 'Choose a photo up to 8 MB.';return ''}
export function buildCustomerCaricaturePrompt(brief:CaricatureBrief, typeName:string, exaggeration:CaricatureExaggeration){
  const style=CARICATURE_STYLES[brief.styleId];
  return [
    `Create a ${exaggeration} ${style.name.toLowerCase()} ${typeName.toLowerCase()} for ${brief.occasion.replaceAll('_',' ')}.`,
    'Keep the person clearly recognisable: preserve their face shape, skin tone, age appearance, hairstyle, spectacles, facial hair and distinguishing features.',
    `Show exactly ${brief.people} ${brief.people===1?'person':'people'}${brief.pets?` and ${brief.pets} ${brief.pets===1?'pet':'pets'}`:''}.`,
    brief.profession?`Profession or role: ${brief.profession}.`:'', brief.hobbies?`Include these interests: ${brief.hobbies}.`:'',
    brief.clothing?`Clothing: ${brief.clothing}.`:'Keep clothing close to the reference photo.', brief.background?`Background: ${brief.background}.`:'Use a warm, uncluttered background.',
    brief.colours?`Favourite colours: ${brief.colours}.`:'', brief.props?`Pets or meaningful accessories: ${brief.props}.`:'', brief.notes?`Special instructions: ${brief.notes}.`:'',
    'Make it warm, dignified and gift-worthy. Do not exaggerate disability, ethnicity, body condition, age or any sensitive characteristic. Keep the complete head and important details inside the picture.'
  ].filter(Boolean).join(' ');
}
export function buildCaricaturePrompt(brief:CaricatureBrief){const style=CARICATURE_STYLES[brief.styleId];return {prompt:[`Transform the supplied reference photograph into the selected ${style.name} artwork—not a different person and not a generic portrait. Style: ${style.positive}.`,`Identity lock: preserve the same recognisable face, apparent age, skin tone, facial hair, hairstyle, glasses shape, smile, pose and clothing colour from the photograph. Keep both eyes aligned and natural. Show exactly ${brief.people} people and ${brief.pets} pets.`,`Composition: ${brief.composition.replace('_',' ')}. Occasion: ${brief.occasion.replaceAll('_',' ')}.`,`Profession: ${brief.profession||'not specified'}. Hobbies: ${brief.hobbies||'not specified'}. Preferred colours: ${brief.colours||'from reference'}. Clothing: ${brief.clothing||'from reference'}. Background: ${brief.background||'simple warm neutral'}. Props: ${brief.props||'none'}. Notes: ${brief.notes||'none'}.`,'The result must visibly match the selected style. Create a positive, dignified, gift-worthy concept. Do not exaggerate disability, race, religion, body type, age or any sensitive characteristic. No words unless separately approved.'].join(' '),negative_prompt:[style.negative,'different person, identity drift, aged face, old person, changed ethnicity, changed age, crossed eyes, uneven eyes, deformed face, malformed hands, duplicate subject, extra person, extra pet, missing subject, cropped head, text, letters, logo, watermark, copyrighted character, offensive stereotype'].join(', '),strength:style.strength,guidance:style.guidance};}
