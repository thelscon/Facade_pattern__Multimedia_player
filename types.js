"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAudioFile = void 0;
function isAudioFile(file) {
    return file.type === 'Audio';
}
exports.isAudioFile = isAudioFile;
function isVideoFile(file) {
    return file.type === 'Video';
}
