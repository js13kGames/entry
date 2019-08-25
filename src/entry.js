import { Game } from './Game'
import { loadAssets } from './Assets'

loadAssets().then(Game.start)
