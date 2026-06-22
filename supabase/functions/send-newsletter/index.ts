// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { articleTitle, articleExcerpt, articleUrl, subscribers } = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    // Send to up to 50 recipients at a time using Resend's batch or bcc (for simplicity we will use bcc, but loop is safer for personalization)
    // Actually Resend allows up to 50 in BCC. 
    // To send actual newsletters, Resend supports sending batch emails, but for this simple edge function we will send one email with multiple bcc, or multiple single emails.
    // We'll map the subscribers to a list of emails.
    const emails = subscribers.map((s: any) => s.email)
    
    if (emails.length === 0) {
      return new Response(JSON.stringify({ message: "No subscribers to send to." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'The Mix HQ <newsletter@themixhq.com>',
        bcc: emails.slice(0, 50), // Resend allows max 50 recipients per API call in BCC
        subject: `New Post: ${articleTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-weight: 900; letter-spacing: 2px;">THE MIX HQ</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="font-size: 24px; font-weight: 900; color: #000; margin-top: 0;">${articleTitle}</h2>
              <p style="color: #444; font-size: 16px; line-height: 1.6;">${articleExcerpt}</p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="${articleUrl}" style="background-color: #dc2626; color: #fff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; display: inline-block;">Read Full Article</a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #888; font-size: 12px;">
              You are receiving this because you subscribed to The Mix HQ newsletter.<br/>
              <a href="https://themixhq.com" style="color: #888;">themixhq.com</a>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ error: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
