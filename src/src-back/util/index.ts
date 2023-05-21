const fs = require('fs');

const path = require('path');

module.exports.removeNonWordCharacters = (str = '') => str.replace(/\W/g, '');

const versionPatt = /(\d+)\.(\d+)\.(\d+)/;

export const compareByVersion = (aVersion: string, bVersion: string) => {
    if (versionPatt.test(aVersion) && versionPatt.test(bVersion)) {
        const matchesA: any = aVersion.match(versionPatt);
        const matchesB: any = bVersion.match(versionPatt);
        matchesA[1] = Number(matchesA[1]);
        matchesA[2] = Number(matchesA[2]);
        matchesA[3] = Number(matchesA[3]);
        matchesB[1] = Number(matchesB[1]);
        matchesB[2] = Number(matchesB[2]);
        matchesB[3] = Number(matchesB[3]);

        if (matchesA[1] === matchesB[1]) {
            if (matchesA[2] === matchesB[2]) {
                return matchesA[3] === matchesB[3] ? 0 : matchesA[3] > matchesB[3] ? -1 : 1;
            } else {
                return matchesA[2] > matchesB[2] ? -1 : 1;
            }
        } else {
            return matchesA[1] > matchesB[1] ? -1 : 1;
        }
    } else {
        return bVersion.localeCompare(aVersion);
    }
};

