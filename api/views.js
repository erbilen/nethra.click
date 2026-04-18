// Vercel Serverless Function - View Counter
// Uses Upstash Redis (free tier) for persistent storage

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const COUNTER_KEY = 'nethra:views'

async function redisCommand(command) {
    const res = await fetch(`${UPSTASH_URL}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
    })
    return res.json()
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    try {
        if (req.method === 'POST') {
            // Increment and return new count
            const data = await redisCommand(['INCR', COUNTER_KEY])
            return res.status(200).json({ views: data.result })
        }

        // GET - just return current count
        const data = await redisCommand(['GET', COUNTER_KEY])
        const views = parseInt(data.result) || 0
        return res.status(200).json({ views })

    } catch (error) {
        console.error('Redis error:', error)
        return res.status(500).json({ error: 'Internal server error', views: 0 })
    }
}
