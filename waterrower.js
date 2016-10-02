// --------- Waterrower interfaceing ------------------------
// --------- initialize S4 USB port -------------------------
// --------- todo: create a class with this -----------------

// list serial ports:
// eSerial.list(function (err, ports) {
//   ports.forEach(function(port) {
//     console.log(port.comName);
//   });
// });

// My S4 appears as
// /dev/cu.usbmodem1411

// record stores value
var eSerial = require('serialport');
var socket = require('socket.io');

var record = {
    "watts": 0,
    "distance": 0,
    "totalStroke": 0,
    "iSpeed": 0,
    "aSpeed": 0,
    "hRate": 0,
    "strokeRate": 0
}

var io; // openend communication socket in main
var socketId; // socket ID from main


// open serial over USB port (I'm on a Mac)
var port = new eSerial("/dev/cu.usbmodem1411", {
    baudRate: 115200,
    parser: eSerial.parsers.readline('\r\n'),
    disconnectedCallback: function() {
        console.log("disconnected")
    }
});

// open, intitate, listener + "requester" in 1 block
port.on('open', function() {
    // intiating comm with the waterrower
    port.write('USB' + '\r\n');

    // handling waterrower responses + collecting memory blocks
    port.on('data', function(data) {
        d = data.substring(0, 1);

        switch (d) {
            case '_': // WR intiating response
                if (data == '_WR_') {
                    port.write('IV?' + '\r\n'); // asking for version
                }
                break;
            case 'I': // WR Information response
                a = data.substring(1, 2);
                switch (a) {
                    case 'V': // WR version response
                        console.log("Waterrower version" + data);
                        break;
                    case 'D': // WR memory read responses
                        //------- reading received packet + chaining requests
                        // --- todo: risk of interference with other requests ?
                        // --- todo: modularize the big bloc ?
                        memcode = data.substring(3, 6); // message header
                        switch (memcode) {
                            case '088': // watts, triggered at Start Stroke
                                record.watts = ACHtoDecimal(data.substring(6));
                                break;
                            case '057': // distance, 1st requested data
                                record.distance = ACHtoDecimal(data.substring(6));
                                sendWR('140', 'D'); // requesting next
                                break;
                            case '140': // total strokes
                                record.totalStroke = ACHtoDecimal(data.substring(6));
                                sendWR('148', 'D'); // requesting next
                                break;
                            case '148': // instant speed (?)
                                record.iSpeed = ACHtoDecimal(data.substring(6));
                                sendWR('14A', 'D'); // requesting next
                                break;
                            case '14A': // average speed
                                record.aSpeed = ACHtoDecimal(data.substring(6));
                                sendWR('1A0', 'S'); // requesting next
                                break;
                            case '1A0': // heart rate
                                record.hRate = ACHtoDecimal(data.substring(6));
                                sendWR('1A9', 'S'); // requesting next
                                break;
                            case '1A9': // stroke rates
                                record.strokeRate = ACHtoDecimal(data.substring(6));
                                //console.log('collection loop complete');
                                break;
                            default: // see USB protocol ref doc
                                console.log('unreferenced mem code :' + memcode);
                        }
                        break;
                    default:
                        //ignore
                        console.log('unexpected I message')
                }
                break;
            case 'O': // WR OK response
                // ignore
                break;
            case 'E': // WR Error response
                console.log(data);
                break;
            case 'P': // WR PING or PULSE response
                p = data.substring(1, 2);
                if (p == 'I') {
                    // PING
                    console.log("PING");
                } else {
                    // PULSE
                    // seem to occur on every segment of the reading disk...
                }
                break;
            case 'S': // Stroke messages, 1st and 2nd priorities
                var s = data.substring(1, 2);
                switch (s) {
                    case 'S': // Stroke Start
                        // Requesting watt data as calculated during recovery
                        port.write('IRD088' + '\r\n');

                        if(io) {
                          // emit Stroke Start over passed socket
                          io.sockets.connected[socketId].emit('ST', 'ST');
                          console.log("WR io : event emitted");
                        }
                        break;
                    case 'E': // Stroke END
                        // emit Stroke End over passed socket
                        io.sockets.connected[socketId].emit('ST', 'SE');
                        break;
                    default:
                        //ignore
                }

                break;
            default:
                console.log('Unrecognized packet: ' + data);
        }

    });

    // ------------ reading requests loop
    setInterval(initRequests, 500);
});

// WR dedicated sub-functions
function initRequests() {
    //console.log('Read request trigger');
    sendWR('057', 'D'); // '057' is distance: it initiates data collection loop here.
}

function sendWR(data, type) {
    port.write('IR' + type + data + '\r\n');
}


function ACHtoDecimal(input) {
    var value;
    var total = 0;
    for (var i = 0; i < input.length; i++) {
        total = total * 16;
        value = input.charCodeAt(i) - 48;
        if (value > 9) {
            value = value - 7;
        }
        total = total + value;
    }
    return (total);
}

function ACHtoDecimalReverse(input) {
    var value;
    var total = 0;
    for (var i = input.length - 1; i >= 0; i--) {
        total = total * 16;
        value = input.charCodeAt(i) - 48;
        if (value > 9) {
            value = value - 7;
        }
        total = total + value;
    }
    return (total);
}


// function returning collected datas.
exports.getRecord = function(){
  return record;
}

// function returning collected datas.
exports.putSocketid = function(passedIo, passedId){ // TODO: catcn errors...
  io = passedIo;
  socketId = passedId;
}
