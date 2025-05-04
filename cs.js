function mod(n, m) {
    return ((n % m) + m) % m;
}

function cs(text, shift) {
    return text.split('').map(char => {
        if (char >= 'a' && char <= 'z') {
            return String.fromCharCode(mod((char.charCodeAt(0) - 97 + shift), 26) + 97);
        } else if (char >= 'A' && char <= 'Z') {
            return String.fromCharCode(mod((char.charCodeAt(0) - 65 + shift), 26) + 65);
        } else {
            return char;
        }
    }).join('');
}

function dataToDict(raw) {
    const lines = raw.split('\n');
    const result = {};

    lines.forEach(line => {
        const match = line.match(/^(\w+):\s*"(.+)"$/);
        if (match) {
            const key = match[1];
            const value = match[2];
            result[key] = value;
        }
    });
    return result;
}

// model
const text = `
crkMga: "CKbcUaDoTIIZ10Tp2MWjhLel3bOiOchGhlZ-wVW"
cwvjFqockp: "tcwuu-ogpw.hktgdcugcrr.eqo"
rtqlgevKf: "tcwuu-ogpw"
uvqtcigDwemgv: "tcwuu-ogpw.hktgdcuguvqtcig.crr"
oguucikpiUgpfgtKf: "509772969953"
crrKf: "1:509772969953:ygd:00f8ghfd2g0hggc60d04c0"
ogcuwtgogpvKf: "I-841YXP341G"
`;

const cd = cs(text, -2);
const data = dataToDict(cd);

