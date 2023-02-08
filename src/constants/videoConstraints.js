const videoConstraints = {
    width: detectMob() ? 600: 1200,
    aspectRatio: 1,
    facingMode: "user",
    frameRate: { max: detectMob() ? 20 : 30 }
};

export default videoConstraints

function detectMob() {
    return ( ( window.innerWidth <= 800 ) && ( window.innerHeight <= 600 ) );
}