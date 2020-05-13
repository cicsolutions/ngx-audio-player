import { ViewChild, ElementRef, Output } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Subject } from 'rxjs/internal/Subject';

export class BaseAudioPlayerFunctions {

    @Output() ended: Subject<String> = new Subject<String>();

    @ViewChild('audioPlayer', {static: true}) player: ElementRef;
    timeLineDuration: MatSlider;

    iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    loaderDisplay = false;
    isPlaying = false;
    currentTime = 0;
    volume = 0.1;
    duration = 0.01;

    currTimePosChanged(event) {
        this.player.nativeElement.currentTime = event.value;
    }

    bindPlayerEvent(): void {
        
        this.player.nativeElement.addEventListener('playing', () => {
            this.isPlaying = true;
            this.duration = Math.floor(this.player.nativeElement.duration);
        });
        this.player.nativeElement.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        this.player.nativeElement.addEventListener('timeupdate', () => {
            this.currentTime = Math.floor(this.player.nativeElement.currentTime);
        });
        this.player.nativeElement.addEventListener('volume', () => {
            this.volume = Math.floor(this.player.nativeElement.volume);
        });
        if(!this.iOS) {
            this.player.nativeElement.addEventListener('loadstart', () => {
                this.loaderDisplay = true;
            });
        }
        this.player.nativeElement.addEventListener('loadeddata', () => {
            this.loaderDisplay = false;
            this.duration = Math.floor(this.player.nativeElement.duration);
        });
        this.player.nativeElement.addEventListener('ended', () => {
            this.ended.next('ended');
        });
    
    }

    playBtnHandler(): void {
        if (this.loaderDisplay) {
            return;
        }
        if (this.player.nativeElement.paused) {
            this.player.nativeElement.play(this.currentTime);
        } else {
            this.currentTime = this.player.nativeElement.currentTime;
            this.player.nativeElement.pause();
        }
    }

    play(): void {
        setTimeout(() => {
            this.player.nativeElement.play();
        }, 0);
    }

    toggleVolume() {
        if (this.volume === 0) {
            this.setVolume(1.0);
        } else {
            this.setVolume(0);
        }
    }

    private setVolume(vol) {
        this.volume = vol;
        this.player.nativeElement.volume = this.volume;
    }

}
