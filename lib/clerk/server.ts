import { createClerkClient } from '@clerk/backend'

export function createClerkServerClient() {
    return createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    })
}