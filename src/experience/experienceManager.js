import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FirstPersonControls } from './FirstPersonControls';

export default class ExperienceManager {

    static CAMERA_KEYS = {
        TRACKBALL: 'TRACKBALL',
        FIRST_PERSON: 'FIRST_PERSON'
    };

    static CAMERA_TYPES = { 
        [this.CAMERA_KEYS.TRACKBALL]: TrackballControls,
        [this.CAMERA_KEYS.FIRST_PERSON]: FirstPersonControls
    };

    static change(cameraKey) {    
        alert('CHANGE CAMERA!!')
    }
}