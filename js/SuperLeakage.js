// SuperLeakage.js

// Author: Gaukas Wang <i@gaukas.wang>

// Prerequisites: 
// - jQuery v2.2.4+

// fetchRealIP passes a JSON object into the callback function
//     {
//         ipAddr: string or null,
//         local: boolean or null,
//         public: boolean or null,
//         version4: boolean or null
//     }
// Any null value indicates a failed leakage.
function fetchRealIp(callback) {
    if(DetectRTC.browser.name === 'Edge') {
        navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
            return fetchIpAddress(callback, stream);
        });
    }
    return fetchIpAddress(callback);
};

// fetchSystemLocale passes a JSON object into the callback function
//      {   
//          datetime: new Date(),
//          languages: [
//              "en", "en-US"
//          ],
//          timeZone: 'America/Los_Angeles',
//          timezoneOffset: 420,
//      }
//
function fetchSystemLocale(callback) {
    callback({
        datetime: new Date(),
        languages: navigator.languages,
        // locale: Intl.DateTimeFormat().resolvedOptions().locale,
        // main_lang: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: (new Date().getTimezoneOffset())/-60
    });
}

function fetchRealIpLocale(callback) {
    fetchRealIp(function(j) {
        var realIP = j.ipAddr
        if (realIP == null || j.local || !j.public) {
            callback(
                {
                    datetime: null, 
                    languages: null,
                    timeZone: "Unknown/Unknown",
                    timezoneOffset: null
                }
            );
            return;
        }

        _ipgeolocation.setIPAddress(realIP);
        _ipgeolocation.getGeolocation(function(ipgeo) {
            var ipgeoJson = {
                datetime: new Date(ipgeo.time_zone.current_time_unix * 1000),
                languages: ipgeo.languages,
                timeZone: ipgeo.time_zone.name,
                timezoneOffset: ipgeo.time_zone.offset
            }

            if (ipgeo.time_zone.is_dst) {
                ipgeoJson.timezoneOffset += ipgeo.time_zone.dst_savings;
            }

            console.log(ipgeo);

            callback(ipgeoJson);
        }, "714fdc89eeed40a397b13c7cf01ffdcb");
        return;
    });
}