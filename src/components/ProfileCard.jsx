import { useState } from 'react'

const ProfileCard = () => {
    const [views] = useState(653)

    const profile = {
        name: 'nethra',
        bio: 'herbokolog',
        avatar: 'https://cdn.discordapp.com/avatars/669612175186329661/89882f4b930c835154259df87b227211.png?size=256',
        status: 'online'
    }

    const socialLinks = [
        { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/erbiilen', className: 'instagram' },
        { name: 'TikTok', icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@erbiilen', className: 'tiktok' },
        { name: 'Spotify', icon: 'fab fa-spotify', url: 'https://open.spotify.com/user/bj2va3tgoy7niuguts0c4mu1g?si=b810ad7445724180', className: 'spotify' },
    ]

    return (
        <div className="profile-card-wrapper">
            <div className="profile-card">
                <div className="card-glow"></div>

                <div className="avatar-container">

                    
                    <div className="avatar">
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                        />
                        <div className="avatar-overlay"></div>
                    </div>

                    <div className={`status-indicator ${profile.status}`}></div>
                </div>

                {/* User Info */}
                <div className="user-info">
                    <h1 className="username">
                        <span className="name-text">
                            {profile.name}
                        </span>
                        <span className="verified-badge">
                            <i className="fas fa-check-circle"></i>
                        </span>
                    </h1>

                    <p className="bio-text">{profile.bio}</p>
                </div>

                <a
                    href="https://discord.gg/your-server"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="discord-banner"
                >
                    <i className="fab fa-discord"></i>
                    <span>Discord Sunucumuza Katıl</span>
                </a>

                <div className="social-links">
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target={link.url !== '#' ? '_blank' : undefined}
                            rel={link.url !== '#' ? 'noopener noreferrer' : undefined}
                            className={`social-link ${link.className}`}
                            data-tooltip={link.name}
                        >
                            <i className={link.icon}></i>
                            <span className="link-text">{link.name}</span>
                            <span className="link-arrow"><i className="fas fa-arrow-right"></i></span>
                        </a>
                    ))}
                </div>

                <div className="views-counter">
                    <i className="fas fa-eye"></i>
                    <span className="views-count">{views.toLocaleString()}</span> views
                </div>
            </div>
        </div>
    )
}

export default ProfileCard
