// Уявіть, що ви створюєте додаток мультимедійного плеєра, який може відтворювати різні типи медіа, такі як аудіо та відео. 
// Ваше завдання - реалізувати фасад для мультимедійного плеєра, щоб спростити взаємодію з ним для кінцевого користувача.
import {
    EMediaType ,
    EPlaybackOrder ,
    IAudioFile ,
    IVideoFile ,
    MediaFileType ,
    isAudioFile ,
    IEngine ,
    IVolumeControl ,
    IPlaylistManager ,
    IMultimediaPlayer
} from './types'

class AudioFile implements IAudioFile {
    public readonly type = EMediaType.Audio

    constructor (
        public readonly title : string ,
        public readonly artist : string , 
        public readonly duration : number = 3000
    ) {}
}
class VideoFile implements IVideoFile {
    public readonly type = EMediaType.Video

    constructor (
        public readonly title : string ,
        public readonly releaseDates : Date ,
        public readonly duration : number = 5000
    ) {}
}

abstract class Engine<T extends IAudioFile | IVideoFile> implements IEngine<T> {
    public playing !: T

    abstract play (file : T) : void
    abstract pause () : void
    abstract stop () : void

    abstract rewind () : void
    abstract fastForward () : void
}
class AudioEngine<T extends IAudioFile> extends Engine<T> {    
    play (file : T) {
        this.playing = file
        console.log (`play song - '${this.playing.title} - ${this.playing.artist}'`)
    }
    pause () {
        console.log (`pause song - '${this.playing.title} - ${this.playing.artist}'`)
    }
    stop () {
        console.log (`stop song - '${this.playing.title} - ${this.playing.artist}'`)
    }
    rewind () {
        console.log (`rewind song - '${this.playing.title} - ${this.playing.artist}'`)
    }
    fastForward () {
        console.log (`fast forward song - '${this.playing.title} - ${this.playing.artist}'`)
    }
}
class VideoEngine<T extends IVideoFile> extends Engine<T> {
    play (file : T) {
        this.playing = file
        console.log (`play movie - '${this.playing.title}'`)
    }
    pause () {
        console.log (`pause movie - '${this.playing.title}'`)
    }
    stop () {
        console.log (`stop movie - '${this.playing.title}'`)
    }
    rewind () {
        console.log (`rewind movie - '${this.playing.title}'`)
    }
    fastForward () {
        console.log (`fast forward movie - '${this.playing.title}'`)
    }
}

class VolumeControl implements IVolumeControl {
    private _currentVolume : number = 66

    get currentVolume () : number {
        return this._currentVolume
    }

    quiet () {
        if (this._currentVolume === 100) {
            return
        }
        else {
            this._currentVolume += 10
        }
    }
    louder () {
        if (this._currentVolume === 0) {
            return
        }
        else {
            this._currentVolume -= 10
        }
    }
}

class PlaylistManager implements IPlaylistManager {
    private _originalList : Array<MediaFileType> = []
    private _list : Array<MediaFileType> = [...this._originalList]

    get list () : Array<MediaFileType> {
        return this._list
    }

    addMediaFile (file : MediaFileType) {
        this._list.push (file)
        this._originalList.push (file)
    }
    removeMediaFile (file : MediaFileType) {
        const indexList = this._list.indexOf (file)
        if (indexList >= 0) {
            this._list.splice (indexList , 1)
        }

        const indexOriginalList = this._originalList.indexOf (file)
        if (indexOriginalList >= 0) {
            this._originalList.splice (indexOriginalList , 1)
        }
    }
    clearList () {
        this._list.length = 0
        this._originalList.length = 0
    }

    sequentialPlay () {
        this._list.length = 0
        this._list.push (...this._originalList)
    }
    randomPlay () {
        this._list.length = 0
        this._originalList.forEach (item => {
            if (Math.round (Math.random ())) {
                this._list.push (item)
            } 
            else {
                this._list.unshift (item);
            }
        })
    }
}

class MultimediaPlayer implements IMultimediaPlayer {
    private _audioEngine = new AudioEngine ()
    private _videoEngine = new VideoEngine ()
    private _volumeControl : IVolumeControl = new VolumeControl ()
    private _playlistManager : IPlaylistManager = new PlaylistManager ()


    private _repeat : boolean = false
    private _playing !: MediaFileType
    private _playbackOrder : EPlaybackOrder = EPlaybackOrder.Sequentially

    get repeat () : boolean {
        return this._repeat
    }
    get playing () : MediaFileType {
        return  this._playing
    }
    get currentVolume () : number {
        return this._volumeControl.currentVolume
    }
    get playbackOrder () : EPlaybackOrder {
        return this._playbackOrder
    }
    get playlist () : Array<MediaFileType> {
        return this._playlistManager.list
    }

    addToPlaylist (file : MediaFileType) {
        this._playlistManager.addMediaFile (file)
    }
    removeFromPlaylist (file : MediaFileType) {
        this._playlistManager.removeMediaFile (file)
    }
    clearPlaylist () {
        this._playlistManager.clearList ()
    }

    play (file ?: MediaFileType) {
        if (this.playlist.length > 0) {
            if (file) {
                const index = this.playlist.indexOf (file)
                this.playlist.slice (index).forEach (item => {
                    if (isAudioFile (item)) {
                        do {
                            this._audioEngine.play (item)
                        } while (this._repeat)
                    }
                    else {
                        do {
                            this._videoEngine.play (item)
                        } while (this._repeat)
                    }
                })
            }
            else {
                this.playlist.forEach (item => {
                    if (isAudioFile (item)) {
                        do {
                            this._audioEngine.play (item)
                        } while (this._repeat)
                    }
                    else {
                        do {
                            this._videoEngine.play (item)
                        } while (this._repeat)
                    }
                })
            }
        }
    }
    pause () {
        if (isAudioFile (this._playing)) {
            this._audioEngine.pause ()
        }
        else {
            this._videoEngine.pause ()
        }
    }
    stop () {
        if (isAudioFile (this._playing)) {
            this._audioEngine.stop ()
        }
        else {
            this._videoEngine.stop ()
        }
    }

    switchRepeat () {
        this._repeat = !this._repeat
    }

    rewind () {
        if (isAudioFile (this._playing)) {
            this._audioEngine.rewind ()
        }
        else {
            this._videoEngine.rewind ()
        }
    }
    fastForward () {
        if (isAudioFile (this._playing)) {
            this._audioEngine.fastForward ()
        }
        else {
            this._videoEngine.fastForward ()
        }
    }

    previous () {
        const index = this.playlist.indexOf (this._playing) - 1
        this.stop ()
        if (index === 0 || index === -1) {
            this.play ()
        }
        else {
            if (index > 0) {
                this.play (this.playlist[index])
            }
        }
    }
    next () {
        const index = this.playlist.indexOf (this._playing) + 1
        this.stop ()
        this.play (this.playlist[index])
    }

    sequentialPlay () {
        if (this._playing) {
            this.stop ()
            this._playbackOrder = EPlaybackOrder.Sequentially
            this._playlistManager.sequentialPlay ()
            this.play ()
        }
        else {
            this._playbackOrder = EPlaybackOrder.Sequentially
            this._playlistManager.sequentialPlay ()
        }
    }
    randomPlay () {
        if (this._playing) {
            this.stop ()
            this._playbackOrder = EPlaybackOrder.Random
            this._playlistManager.randomPlay ()
            this.play ()
        }
        else {
            this._playbackOrder = EPlaybackOrder.Random
            this._playlistManager.randomPlay ()
        }
    }

    quiet () {
        this._volumeControl.quiet ()
    }
    louder () {
        this._volumeControl.louder ()
    }
}

// examples
const player = new MultimediaPlayer ()
player.addToPlaylist (new AudioFile ('title song 1' , 'artist 1'))
player.addToPlaylist (new AudioFile ('title song 2' , 'artist 2'))
player.addToPlaylist (new AudioFile ('title song 3' , 'artist 3'))
player.addToPlaylist (new VideoFile ('title movie 1' , new Date ('01.01.2000')))
player.addToPlaylist (new VideoFile ('title movie 2' , new Date ('02.01.2000')))


player.playlist.forEach (item => console.log (item.title))
player.randomPlay ()
player.playlist.forEach (item => console.log (item.title))
player.sequentialPlay ()
player.playlist.forEach (item => console.log (item.title));
player.switchRepeat ()
console.log (player.repeat)