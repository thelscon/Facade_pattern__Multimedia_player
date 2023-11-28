"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Уявіть, що ви створюєте додаток мультимедійного плеєра, який може відтворювати різні типи медіа, такі як аудіо та відео. 
// Ваше завдання - реалізувати фасад для мультимедійного плеєра, щоб спростити взаємодію з ним для кінцевого користувача.
const types_1 = require("./types");
class AudioFile {
    constructor(title, artist, duration = 3000) {
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.type = "Audio" /* EMediaType.Audio */;
    }
}
class VideoFile {
    constructor(title, releaseDates, duration = 5000) {
        this.title = title;
        this.releaseDates = releaseDates;
        this.duration = duration;
        this.type = "Video" /* EMediaType.Video */;
    }
}
class Engine {
}
class AudioEngine extends Engine {
    play(file) {
        this.playing = file;
        console.log(`play song - '${this.playing.title} - ${this.playing.artist}'`);
    }
    pause() {
        console.log(`pause song - '${this.playing.title} - ${this.playing.artist}'`);
    }
    stop() {
        console.log(`stop song - '${this.playing.title} - ${this.playing.artist}'`);
    }
    rewind() {
        console.log(`rewind song - '${this.playing.title} - ${this.playing.artist}'`);
    }
    fastForward() {
        console.log(`fast forward song - '${this.playing.title} - ${this.playing.artist}'`);
    }
}
class VideoEngine extends Engine {
    play(file) {
        this.playing = file;
        console.log(`play movie - '${this.playing.title}'`);
    }
    pause() {
        console.log(`pause movie - '${this.playing.title}'`);
    }
    stop() {
        console.log(`stop movie - '${this.playing.title}'`);
    }
    rewind() {
        console.log(`rewind movie - '${this.playing.title}'`);
    }
    fastForward() {
        console.log(`fast forward movie - '${this.playing.title}'`);
    }
}
class VolumeControl {
    constructor() {
        this._currentVolume = 66;
    }
    get currentVolume() {
        return this._currentVolume;
    }
    quiet() {
        if (this._currentVolume === 100) {
            return;
        }
        else {
            this._currentVolume += 10;
        }
    }
    louder() {
        if (this._currentVolume === 0) {
            return;
        }
        else {
            this._currentVolume -= 10;
        }
    }
}
class PlaylistManager {
    constructor() {
        this._originalList = [];
        this._list = [...this._originalList];
    }
    get list() {
        return this._list;
    }
    addMediaFile(file) {
        this._list.push(file);
        this._originalList.push(file);
    }
    removeMediaFile(file) {
        const indexList = this._list.indexOf(file);
        if (indexList >= 0) {
            this._list.splice(indexList, 1);
        }
        const indexOriginalList = this._originalList.indexOf(file);
        if (indexOriginalList >= 0) {
            this._originalList.splice(indexOriginalList, 1);
        }
    }
    clearList() {
        this._list.length = 0;
        this._originalList.length = 0;
    }
    sequentialPlay() {
        this._list.length = 0;
        this._list.push(...this._originalList);
    }
    randomPlay() {
        this._list.length = 0;
        this._originalList.forEach(item => {
            if (Math.round(Math.random())) {
                this._list.push(item);
            }
            else {
                this._list.unshift(item);
            }
        });
    }
}
class MultimediaPlayer {
    constructor() {
        this._audioEngine = new AudioEngine();
        this._videoEngine = new VideoEngine();
        this._volumeControl = new VolumeControl();
        this._playlistManager = new PlaylistManager();
        this._repeat = false;
        this._playbackOrder = "Sequentially play" /* EPlaybackOrder.Sequentially */;
    }
    get repeat() {
        return this._repeat;
    }
    get playing() {
        return this._playing;
    }
    get currentVolume() {
        return this._volumeControl.currentVolume;
    }
    get playbackOrder() {
        return this._playbackOrder;
    }
    get playlist() {
        return this._playlistManager.list;
    }
    addToPlaylist(file) {
        this._playlistManager.addMediaFile(file);
    }
    removeFromPlaylist(file) {
        this._playlistManager.removeMediaFile(file);
    }
    clearPlaylist() {
        this._playlistManager.clearList();
    }
    play(file) {
        if (this.playlist.length > 0) {
            if (file) {
                const index = this.playlist.indexOf(file);
                this.playlist.slice(index).forEach(item => {
                    if ((0, types_1.isAudioFile)(item)) {
                        do {
                            this._audioEngine.play(item);
                        } while (this._repeat);
                    }
                    else {
                        do {
                            this._videoEngine.play(item);
                        } while (this._repeat);
                    }
                });
            }
            else {
                this.playlist.forEach(item => {
                    if ((0, types_1.isAudioFile)(item)) {
                        do {
                            this._audioEngine.play(item);
                        } while (this._repeat);
                    }
                    else {
                        do {
                            this._videoEngine.play(item);
                        } while (this._repeat);
                    }
                });
            }
        }
    }
    pause() {
        if ((0, types_1.isAudioFile)(this._playing)) {
            this._audioEngine.pause();
        }
        else {
            this._videoEngine.pause();
        }
    }
    stop() {
        if ((0, types_1.isAudioFile)(this._playing)) {
            this._audioEngine.stop();
        }
        else {
            this._videoEngine.stop();
        }
    }
    switchRepeat() {
        this._repeat = !this._repeat;
    }
    rewind() {
        if ((0, types_1.isAudioFile)(this._playing)) {
            this._audioEngine.rewind();
        }
        else {
            this._videoEngine.rewind();
        }
    }
    fastForward() {
        if ((0, types_1.isAudioFile)(this._playing)) {
            this._audioEngine.fastForward();
        }
        else {
            this._videoEngine.fastForward();
        }
    }
    previous() {
        const index = this.playlist.indexOf(this._playing) - 1;
        this.stop();
        if (index === 0 || index === -1) {
            this.play();
        }
        else {
            if (index > 0) {
                this.play(this.playlist[index]);
            }
        }
    }
    next() {
        const index = this.playlist.indexOf(this._playing) + 1;
        this.stop();
        this.play(this.playlist[index]);
    }
    sequentialPlay() {
        if (this._playing) {
            this.stop();
            this._playbackOrder = "Sequentially play" /* EPlaybackOrder.Sequentially */;
            this._playlistManager.sequentialPlay();
            this.play();
        }
        else {
            this._playbackOrder = "Sequentially play" /* EPlaybackOrder.Sequentially */;
            this._playlistManager.sequentialPlay();
        }
    }
    randomPlay() {
        if (this._playing) {
            this.stop();
            this._playbackOrder = "Random play" /* EPlaybackOrder.Random */;
            this._playlistManager.randomPlay();
            this.play();
        }
        else {
            this._playbackOrder = "Random play" /* EPlaybackOrder.Random */;
            this._playlistManager.randomPlay();
        }
    }
    quiet() {
        this._volumeControl.quiet();
    }
    louder() {
        this._volumeControl.louder();
    }
}
// examples
const player = new MultimediaPlayer();
player.addToPlaylist(new AudioFile('title song 1', 'artist 1'));
player.addToPlaylist(new AudioFile('title song 2', 'artist 2'));
player.addToPlaylist(new AudioFile('title song 3', 'artist 3'));
player.addToPlaylist(new VideoFile('title movie 1', new Date('01.01.2000')));
player.addToPlaylist(new VideoFile('title movie 2', new Date('02.01.2000')));
player.playlist.forEach(item => console.log(item.title));
player.randomPlay();
player.playlist.forEach(item => console.log(item.title));
player.sequentialPlay();
player.playlist.forEach(item => console.log(item.title));
player.switchRepeat();
console.log(player.repeat);
