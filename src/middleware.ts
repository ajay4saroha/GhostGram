import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


// This function can be marked `async` if using `await` inside
const toDashborad = [
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:username*'
    ]
export async function middleware(req: NextRequest) {
    const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET})
    const url = req.nextUrl.pathname
    // console.log("URL------------------------>",url)
    if(token && toDashborad.includes(url)){
        return NextResponse.redirect(new URL('/dashboard',req.url))
    } else if(!token && url.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/',req.url))
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:username*',
        '/dashboard'
    ]
}

