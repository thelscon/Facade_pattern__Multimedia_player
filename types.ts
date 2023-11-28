export const enum EMediaType {
    Audio = 'Audio' ,
    Video = 'Video'
}
export const enum EPlaybackOrder {
    Sequentially = 'Sequentially play' ,
    Random = 'Random play'
}

interface IFile {
    readonly title : string ,
    readonly duration : number
}
export interface IAudioFile extends IFile {
    readonly type : EMediaType.Audio ,
    readonly artist : string    
}
export interface IVideoFile extends IFile {
    readonly type : EMediaType.Video ,
    readonly releaseDates : Date
}
export type MediaFileType = IAudioFile | IVideoFile
export function isAudioFile (file : MediaFileType) : file is IAudioFile {
    return file.type === 'Audio'
}
function isVideoFile (file : MediaFileType) : file is IVideoFile {
    return file.type === 'Video'
}

export interface IEngine<T extends IAudioFile | IVideoFile> {
    playing : T
    
    play : (file : T) => void
    pause : () => void
    stop : () => void

    rewind : () => void
    fastForward : () => void
}

export interface IVolumeControl {
    currentVolume : number

    quiet () : void
    louder () : void
}

export interface IPlaylistManager {
    list : Array<MediaFileType> ,

    addMediaFile : (file : MediaFileType) => void
    removeMediaFile : (file : MediaFileType) => void
    clearList : () => void

    sequentialPlay : () => void
    randomPlay : () => void
}

export interface IMultimediaPlayer {
    readonly playing : MediaFileType
    readonly playbackOrder : EPlaybackOrder
    readonly currentVolume : number
    readonly repeat : boolean
    
    readonly playlist : Array<MediaFileType>

    addToPlaylist : (file : MediaFileType) => void
    removeFromPlaylist : (file : MediaFileType) => void
    clearPlaylist : () => void

    play : (file ?: MediaFileType) => void
    pause : () => void
    stop : () => void

    switchRepeat : () => void

    rewind : () => void
    fastForward : () => void

    previous : () => void
    next : () => void

    sequentialPlay : () => void
    randomPlay : () => void

    quiet () : void
    louder () : void
}