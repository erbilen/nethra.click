import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import Particles from './components/Particles'
import ProfileCard from './components/ProfileCard'
import DiscordPresence from './components/DiscordPresence'
import CardsTiltWrapper from './components/CardsTiltWrapper'
import SplashScreen from './components/SplashScreen'
import TeamPage from './components/TeamPage'

import video1 from './assets/esdeekid2.mp4'
import video2 from './assets/esdeekid.mp4'
import video3 from './assets/lewishamido.mp4'
import video4 from './assets/vibe.mp4'
import video5 from './assets/video.mp4'
import video6 from './assets/video2.mp4'
import video7 from './assets/video3.mp4'

import CustomCursor from './components/CustomCursor'

const VIDEO_LIST = [video1, video2, video3, video4, video5, video6, video7]
const FADE_DURATION = 1500 // ms

const MY_DISCORD_ID = "669612175186329661";

function App() {
    const [hasEntered, setHasEntered] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showTeam, setShowTeam] = useState(false)
    const [volume, setVolume] = useState(0.3)
    const [menuOpen, setMenuOpen] = useState(false)

    // Dual video crossfade system
    const videoARef = useRef(null)
    const videoBRef = useRef(null)
    const currentIndexRef = useRef(0)
    const activeVideoRef = useRef('A') // 'A' or 'B'
    const [activeVideo, setActiveVideo] = useState('A') // for CSS class toggling

    const getActiveVideoEl = useCallback(() => {
        return activeVideoRef.current === 'A' ? videoARef.current : videoBRef.current
    }, [])

    const getInactiveVideoEl = useCallback(() => {
        return activeVideoRef.current === 'A' ? videoBRef.current : videoARef.current
    }, [])

    const playNextVideo = useCallback(() => {
        // Move to next video index
        currentIndexRef.current = (currentIndexRef.current + 1) % VIDEO_LIST.length

        const nextVideoEl = getInactiveVideoEl()
        if (!nextVideoEl) return

        // Load next video into the inactive element
        nextVideoEl.src = VIDEO_LIST[currentIndexRef.current]
        nextVideoEl.load()

        nextVideoEl.oncanplay = () => {
            nextVideoEl.volume = volume
            nextVideoEl.play().catch(() => {})

            // Swap active
            const newActive = activeVideoRef.current === 'A' ? 'B' : 'A'
            activeVideoRef.current = newActive
            setActiveVideo(newActive)

            nextVideoEl.oncanplay = null
        }
    }, [volume, getInactiveVideoEl])

    // Handle video end => crossfade to next
    useEffect(() => {
        const videoA = videoARef.current
        const videoB = videoBRef.current
        if (!videoA || !videoB) return

        const handleEndedA = () => {
            if (activeVideoRef.current === 'A') {
                playNextVideo()
            }
        }
        const handleEndedB = () => {
            if (activeVideoRef.current === 'B') {
                playNextVideo()
            }
        }

        videoA.addEventListener('ended', handleEndedA)
        videoB.addEventListener('ended', handleEndedB)

        return () => {
            videoA.removeEventListener('ended', handleEndedA)
            videoB.removeEventListener('ended', handleEndedB)
        }
    }, [playNextVideo])

    const handleEnter = () => {
        setHasEntered(true)
        setIsPlaying(true)

        const videoA = videoARef.current
        if (videoA) {
            videoA.src = VIDEO_LIST[0]
            videoA.load()
            videoA.volume = volume
            videoA.play().catch(error => {
                console.log("Video auto-play failed:", error)
                setIsPlaying(false)
            })
            activeVideoRef.current = 'A'
            setActiveVideo('A')
        }
    }

    const toggleVideo = () => {
        const activeEl = getActiveVideoEl()
        if (activeEl) {
            if (isPlaying) {
                activeEl.pause()
            } else {
                activeEl.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        if (videoARef.current) videoARef.current.volume = newVolume
        if (videoBRef.current) videoBRef.current.volume = newVolume
    }

    useEffect(() => {
        if (videoARef.current) videoARef.current.volume = volume
        if (videoBRef.current) videoBRef.current.volume = volume
    }, [hasEntered, volume])

    return (
        <>
            <CustomCursor />

            <div className="video-background">
                <video
                    ref={videoARef}
                    className={`bg-video ${activeVideo === 'A' ? 'active' : ''}`}
                    playsInline
                    muted={false}
                />
                <video
                    ref={videoBRef}
                    className={`bg-video ${activeVideo === 'B' ? 'active' : ''}`}
                    playsInline
                    muted={false}
                />
            </div>


            {hasEntered && (
                <div className={`media-bar ${menuOpen ? 'open' : ''}`}>
                    <div className={`media-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className={`media-controls ${menuOpen ? 'visible' : ''}`}>
                        <button className="media-play-btn" onClick={toggleVideo}>
                            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="media-slider"
                        />
                    </div>
                </div>
            )}

            <Particles />

            {!hasEntered && <SplashScreen onEnter={handleEnter} />}


            {hasEntered && (
                <nav className="top-nav">
                    <button
                        className={`nav-tab ${!showTeam ? 'active' : ''}`}
                        onClick={() => {
                            setShowTeam(false)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                    >
                        home
                    </button>
                    <button
                        className={`nav-tab ${showTeam ? 'active' : ''}`}
                        onClick={() => {
                            setShowTeam(true)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                    >
                        team
                    </button>
                </nav>
            )}


            <div className="page-wrapper">
                <div className={`page-content home-page ${hasEntered && !showTeam ? 'active' : ''}`}>
                    <CardsTiltWrapper>

                        <ProfileCard userId={MY_DISCORD_ID} />
                        <DiscordPresence userId={MY_DISCORD_ID} />
                    </CardsTiltWrapper>

                    <footer className="footer">
                        <p>
                            <a 
                                href="https://reawen.xyz" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                            >
                                © nethra
                            </a>
                        </p>
                    </footer>
                </div>
                <div className={`page-content team-section ${showTeam ? 'active' : ''}`}>
                    <TeamPage />
                </div>
            </div>
        </>
    )
}


export default App




