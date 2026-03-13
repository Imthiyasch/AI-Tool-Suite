import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    // Sign out from Supabase
    await supabase.auth.signOut()

    return NextResponse.redirect(new URL('/', request.url), {
        status: 302,
    })
}

// Optional: allow GET signout for easier access from simple links
export async function GET(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/', request.url), {
        status: 302,
    })
}
