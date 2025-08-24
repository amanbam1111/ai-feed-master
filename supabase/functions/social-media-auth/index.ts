import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OAuthTokenData {
  access_token: string
  refresh_token?: string
  token_expires_at?: string
  platform: string
  platform_user_id: string
  platform_username?: string
}

interface StoredTokenData {
  userId: string
  platform: string
  accessToken: string
  refreshToken?: string
  expiresAt?: string
  platformUserId: string
  platformUsername?: string
}

// In-memory secure token storage (in production, use encrypted database or secure key management)
const tokenStore = new Map<string, StoredTokenData>()

function generateTokenReference(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function storeTokensSecurely(tokenRef: string, tokenData: StoredTokenData): void {
  // In production, this should store in encrypted format or use a secure key management service
  tokenStore.set(tokenRef, tokenData)
  console.log(`Stored tokens for reference: ${tokenRef}`)
}

function getStoredTokens(tokenRef: string): StoredTokenData | null {
  return tokenStore.get(tokenRef) || null
}

async function createSocialAccountRecord(supabase: any, userId: string, tokenRef: string, oauthData: OAuthTokenData) {
  const { data, error } = await supabase
    .from('social_accounts')
    .upsert({
      user_id: userId,
      platform: oauthData.platform,
      platform_user_id: oauthData.platform_user_id,
      platform_username: oauthData.platform_username,
      token_reference_id: tokenRef,
      is_connected: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    })

  return { data, error }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      throw new Error('No authorization header')
    }

    // Get user from JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authorization.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { action, ...requestData } = await req.json()

    switch (action) {
      case 'store_tokens': {
        const { oauth_data }: { oauth_data: OAuthTokenData } = requestData
        
        // Generate secure reference
        const tokenRef = generateTokenReference()
        
        // Store tokens securely (not in client-accessible database)
        const secureTokenData: StoredTokenData = {
          userId: user.id,
          platform: oauth_data.platform,
          accessToken: oauth_data.access_token,
          refreshToken: oauth_data.refresh_token,
          expiresAt: oauth_data.token_expires_at,
          platformUserId: oauth_data.platform_user_id,
          platformUsername: oauth_data.platform_username
        }
        
        storeTokensSecurely(tokenRef, secureTokenData)
        
        // Store only metadata in client database
        const { error: dbError } = await createSocialAccountRecord(
          supabaseClient, 
          user.id, 
          tokenRef, 
          oauth_data
        )
        
        if (dbError) {
          console.error('Database error:', dbError)
          throw new Error('Failed to store account information')
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Social account connected securely' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get_account_status': {
        const { platform } = requestData
        
        const { data: account, error: fetchError } = await supabaseClient
          .from('social_accounts')
          .select('platform, platform_username, is_connected, created_at')
          .eq('user_id', user.id)
          .eq('platform', platform)
          .single()
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw new Error('Failed to fetch account status')
        }
        
        return new Response(
          JSON.stringify({ account: account || null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'disconnect_account': {
        const { platform } = requestData
        
        // Get account to find token reference
        const { data: account, error: fetchError } = await supabaseClient
          .from('social_accounts')
          .select('token_reference_id')
          .eq('user_id', user.id)
          .eq('platform', platform)
          .single()
        
        if (fetchError) {
          throw new Error('Account not found')
        }
        
        // Remove from secure storage
        if (account.token_reference_id) {
          tokenStore.delete(account.token_reference_id)
        }
        
        // Update database record
        const { error: updateError } = await supabaseClient
          .from('social_accounts')
          .update({ 
            is_connected: false, 
            token_reference_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('platform', platform)
        
        if (updateError) {
          throw new Error('Failed to disconnect account')
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Account disconnected successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Social media auth error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})