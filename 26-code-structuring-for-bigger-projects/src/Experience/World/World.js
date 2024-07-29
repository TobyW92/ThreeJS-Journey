import Experience from '../Experience'
import Environment from './Enviornment'
import Floor from './Floor'
import Fox from './Fox'

export default class World {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.floor = new Floor()
            this.fox = new Fox()
            this.enviornment = new Environment()
        })

    }

    update() {
        if(this.fox) {
            this.fox.update()
        }
    }
}