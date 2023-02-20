import {useState} from "react";
import "./VideoPlayer.css"

const videos = {
    deer:
        "https://s3.amazonaws.com/codecademy-content/courses/React/react_video-fast.mp4",
    snail:
        "https://s3.amazonaws.com/codecademy-content/courses/React/react_video-slow.mp4",
    cat:
        "https://s3.amazonaws.com/codecademy-content/courses/React/react_video-cute.mp4",
    spider:
        "https://s3.amazonaws.com/codecademy-content/courses/React/react_video-eek.mp4",
    cockatiel:
        "https://www.shutterstock.com/shutterstock/videos/1088928327/preview/stock-footage-a-young-cinnamon-pearl-cockatiel-looking-straight-to-the-camera-and-moving-its-head-the-video-has.webm",
    cockatoo:
        "https://www.shutterstock.com/shutterstock/videos/1067953064/preview/stock-footage-slow-motion-sulphur-crested-cockatoo-perched-looks-curious.webm"
};

const videoNames = Object.keys(videos);


export default function VideoPlayer() {

    const [videoSrc, setVideoSrc] = useState(videos.spider);

    function onSelectVideo(video) {
        const videoSrc = videos[video];
        setVideoSrc(videoSrc);
    }

    return (
        <>
            <h1>Project 6: Video Player</h1>
            <Menu onSelectVideo={onSelectVideo} videoValues={videoNames}/>
            <Video videoSrc={videoSrc}/>
        </>
    );
}

function Menu({onSelectVideo, videoValues}) {
    return (
        <form onClick={(event) => onSelectVideo(event.target.value)}>
            {videoValues.map((value, i) => (
                <div className="video-inputs">
                    <input key={i} type="radio" name="src" value={value}/>
                    {value}
                </div>
            ))}
        </form>

    );
}

function Video({videoSrc}) {
    return (
        <div>
            <video loop controls autostart="true" autoPlay muted src={videoSrc}/>
        </div>
    );
}