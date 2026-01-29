import { useState, useEffect } from 'react'

const DISCORD_BADGES = {
    1: 'staff',
    2: 'partner',
    4: 'hypesquad',
    8: 'bug_hunter_1',
    64: 'hypesquad bravery',
    128: 'hypesquad brilliance',
    256: 'hypesquad balance',
    512: 'early supporter',
    16384: 'bug hunter 2',
    131072: 'verified developer',
    4194304: 'active developer'
}
const API_URL = 'http://31.57.33.249:4444';
const DiscordPresence = ({ userId }) => {
    const [discordData, setDiscordData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return;

        const fetchDiscordData = async () => {
            try {
            const response = await fetch(`/api/status/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
                if (!response.ok) throw new Error('API Error')
                const data = await response.json()
                setDiscordData(data)
            } catch (error) {
                console.error('Discord verisi çekilemedi:', error)
                setDiscordData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchDiscordData()
        const interval = setInterval(fetchDiscordData, 10 * 1000)
        return () => clearInterval(interval)
    }, [userId])

    if (loading) return <div className="discord-card"><div className="discord-card-content" style={{ color: 'white', justifyContent: 'center' }}>Yükleniyor...</div></div>
    if (!discordData || !discordData.discord_user) return <div className="discord-card"><div className="discord-card-content" style={{ color: '#ed4245', justifyContent: 'center' }}>Discord Verisi Yok</div></div>

    const { discord_user, discord_status, activities = [] } = discordData

    const getAvatarUrl = () => {
        if (!discord_user.avatar) return 'https://cdn.discordapp.com/embed/avatars/0.png'
        const extension = discord_user.avatar.startsWith('a_') ? 'gif' : 'png'
        return `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${extension}?size=256`
    }

    const getBannerUrl = () => {
        if (discord_user.banner) {
            const extension = discord_user.banner.startsWith('a_') ? 'gif' : 'png'
            return `https://cdn.discordapp.com/banners/${discord_user.id}/${discord_user.banner}.${extension}?size=512`
        }
        return null
    }



    const getUserBadges = () => {
        const badges = []

        if (discord_user.nitro) badges.push('nitro')
        if (discord_user.booster) badges.push('booster')

        return badges
    }

    const currentActivity = activities.find(a => a.type === 2) || activities.find(a => a.type === 0)

    const bannerUrl = getBannerUrl();

    return (
        <div className={`discord-card ${!bannerUrl ? 'no-banner' : ''}`}>
            {bannerUrl && (
                <div
                    className="discord-banner-bg"
                    style={{
                        backgroundColor: discord_user.banner_color || '#18191c',
                        backgroundImage: `url(${bannerUrl})`
                    }}
                ></div>
            )}

            <div className="discord-card-content">
                <div className="discord-avatar-section">
                    <div className="discord-avatar">
                        <img src={getAvatarUrl()} alt={discord_user.username} />
                        <div className={`discord-status-dot ${discord_status}`}></div>
                    </div>
                </div>

                <div className="discord-info">
                    <div className="discord-name-row" style={{ justifyContent: 'space-between', width: '100%', flexWrap: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <span className="discord-displayname" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {discord_user.display_name || discord_user.username}
                            </span>
                            <div className="discord-badges">
                                {getUserBadges().map(badge => (
                                    <div
                                        key={badge}
                                        className={`discord-badge discord-badge-${badge}`}
                                        title={badge.replace('_', ' ')}
                                    >
                                        <div className="badge-tooltip">{badge}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <a href={`https://discord.com/users/${userId}`} target="_blank" rel="noreferrer" className="discord-profile-link" style={{ padding: '6px 12px', fontSize: '12px', flexShrink: 0, marginLeft: '10px' }}>
                            View Profile
                        </a>
                    </div>

                    <div className="discord-activity-info">
                        {currentActivity ? (
                            <>
                                {currentActivity.type !== 2 && (
                                    <span className="discord-playing">
                                        Playing a Game
                                    </span>
                                )}
                                <span className="discord-status-label">{currentActivity.name}</span>
                                {currentActivity.details && <span className="discord-time">{currentActivity.details}</span>}
                                {currentActivity.state && <span className="discord-time">{currentActivity.state}</span>}
                            </>
                        ) : (
                            <span className="discord-status-label">
                                {discord_status === 'dnd' ? 'Do Not Disturb' :
                                    discord_status === 'idle' ? 'Idle' :
                                        discord_status === 'online' ? 'Online' : 'Offline'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default DiscordPresence








