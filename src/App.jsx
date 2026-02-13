import { useState, useRef, useEffect } from 'react'
import './App.css'
import Particles from './components/Particles'
import ProfileCard from './components/ProfileCard'
import DiscordPresence from './components/DiscordPresence'
import CardsTiltWrapper from './components/CardsTiltWrapper'
import SplashScreen from './components/SplashScreen'
import TeamPage from './components/TeamPage'
import videoFile from './assets/video4.mp4'

import CustomCursor from './components/CustomCursor'


const MY_DISCORD_ID = "669612175186329661";

function App() {
    const [hasEntered, setHasEntered] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showTeam, setShowTeam] = useState(false)
    const [volume, setVolume] = useState(0.3)
    const [menuOpen, setMenuOpen] = useState(false)
    const videoRef = useRef(null)

    const handleEnter = () => {
        setHasEntered(true)
        setIsPlaying(true)
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video auto-play failed, waiting for user interaction:", error)
                setIsPlaying(false)
            })
        }
    }

    const toggleVideo = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
        }
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume
        }
    }, [hasEntered])

    return (
        <>
            <CustomCursor />

            <div className="video-background">
                <video ref={videoRef} loop playsInline>
                    <source src={videoFile} type="video/mp4" />
                </video>
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



