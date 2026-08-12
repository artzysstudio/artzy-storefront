import { aiReliable, buildCaricaturePrompt, CARICATURE_STYLES, hasExplicitConsent, parseCaricatureBrief } from '../../../src/features/caricatures/config';

type Env = { AI:{run(model:string,input:Record<string,unknown>):Promise<ReadableStream<Uint8Array>>}; CARICATURE_RATE_LIMITER?:{limit(input:{key:string}):Promise<{success:boolean}>} };
type Context = { request:Request; env:Env };
const noStore={'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};

export const onRequest=async({request,env}:Context):Promise<Response>=>{
  if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST'}});
  const origin=request.headers.get('origin');
  if(!origin||origin!==new URL(request.url).origin)return Response.json({error:'Same-origin request required.'},{status:403,headers:noStore});
  if(Number(request.headers.get('content-length')||0)>2_600_000)return Response.json({error:'The prepared photo is too large. Try a smaller image.'},{status:413,headers:noStore});
  const session=(request.headers.get('x-artzy-session')||'').replace(/[^a-zA-Z0-9-]/g,'').slice(0,64);
  if(!session)return Response.json({error:'Refresh the page and try again.'},{status:400,headers:noStore});
  if(env.CARICATURE_RATE_LIMITER){const limited=await env.CARICATURE_RATE_LIMITER.limit({key:`caricature:${session}`});if(!limited.success)return Response.json({error:'You have created several previews. Please wait a minute or ask the studio for help.'},{status:429,headers:{...noStore,'Retry-After':'60'}});}
  const referenceId=`ARTZY-CAR-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  try{
    const body=await request.json() as Record<string,unknown>;
    const image=typeof body.image_b64==='string'?body.image_b64.slice(0,2_400_000):'';
    const brief=parseCaricatureBrief(body);
    if(!hasExplicitConsent(body.consent))return Response.json({error:'Confirm photo permission before creating an AI concept.',referenceId},{status:400,headers:noStore});
    if(!image||!/^[A-Za-z0-9+/=]+$/.test(image)||!brief)return Response.json({error:'Review the photo and selected options, then try again.',referenceId},{status:400,headers:noStore});
    if(!aiReliable(brief))return Response.json({error:'This group is larger than the reliable AI preview limit. Your complete brief is ready for manual studio review.',referenceId,manualReview:true},{status:422,headers:noStore});
    const mapped=buildCaricaturePrompt(brief),style=CARICATURE_STYLES[brief.styleId];
    const output=await Promise.race([
      env.AI.run('@cf/runwayml/stable-diffusion-v1-5-img2img',{image_b64:image,prompt:mapped.prompt,negative_prompt:mapped.negative_prompt,width:768,height:768,num_steps:20,strength:mapped.strength,guidance:mapped.guidance}),
      new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('AI_TIMEOUT')),45000)),
    ]);
    return new Response(output,{headers:{...noStore,'Content-Type':'image/png','X-Artzy-Reference':referenceId,'X-Artzy-Style':style.id}});
  }catch(error){console.error(JSON.stringify({message:'Caricature preview failed',referenceId,error:error instanceof Error?error.message:String(error)}));return Response.json({error:'The AI preview is unavailable right now. Your details are safe in this page—please retry or continue with the studio.',referenceId},{status:503,headers:noStore});}
};
