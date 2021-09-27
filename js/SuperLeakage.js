// Internal Function
function fetchIpAddress(callback, stream) {
    DetectRTC.DetectLocalIPAddress(function(ipAddress, isPublic, isIpv4) {
        if(!ipAddress) return {
            ipAddr: "bad"
        };
        var returnJson = {};

        if(ipAddress.indexOf('Local: ') !== -1) {
            var truncatelen = 7; // 'Local: '
            extractIp = ipAddress.substring(truncatelen, ipAddress.length);
            returnJson.ipAddr = extractIp;
            returnJson.local = true;
            returnJson.public = isPublic;
            returnJson.version4 = isIpv4;
        } else {
            var truncatelen = 8; // 'Public: '
            extractIp = ipAddress.substring(truncatelen, ipAddress.length);
            returnJson.ipAddr = extractIp;
            returnJson.local = false;
            returnJson.public = isPublic;
            returnJson.version4 = isIpv4;
        }

        // console.log(returnJson);

        if(!stream) {
            callback(returnJson);
            return;
        }
        stream.getTracks().forEach(function(track) {
            track.stop();
        });

        stream = null;

        callback(returnJson);
        return;
    }, stream);
}

// Prerequisite: DetectRTC
function fetchRealIp(callback) {
    if(DetectRTC.browser.name === 'Edge') {
        navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
            return fetchIpAddress(callback, stream);
        });
    }
    return fetchIpAddress(callback);
};

