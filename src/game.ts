import { emit, GameLoop, init, initKeys, on } from "kontra";

import { Projectile } from "../src/sprites/projectile";
import { Tank } from "../src/sprites/tank";
import { Terrain } from "../src/sprites/terrain";
import { Turret } from "../src/sprites/turret";
import { GameDimensions } from "./dimensions";
import { resizeIfNeeded } from "./main";
import { Score } from "./score";
import { backgroundMusicData } from "./sounds/background";
import { explosionSoundData } from "./sounds/explosion";
import { itemSoundData } from "./sounds/itempickup";
import { shotSoundData } from "./sounds/shot";
import { Sound } from "./sounds/sound";
import { SoundSettings } from "./sounds/soundsettings";
import { Background } from "./sprites/background";
import { BlowupParticle } from "./sprites/blowupparticle";
import { DamageItem } from "./sprites/damageitem";
import { Effect } from "./sprites/effect";
import { Enemy } from "./sprites/enemy";
import { HealthItem } from "./sprites/healthitem";
import { HUD } from "./sprites/hud";
import { Item } from "./sprites/item";
import { MuzzleFlash } from "./sprites/muzzleflash";
import { ProjectileItem } from "./sprites/projectileitem";
import { SpeedItem } from "./sprites/speeditem";
import { TextLayer } from "./sprites/textlayer";
import { ReloadTimeItem } from "./sprites/reloadtimeitem";

export class TankyGame {

    private background: Background;
    private textLayer: TextLayer;
    private terrain: Terrain;
    private tank: Tank;
    private hud: HUD;
    private enemies: Enemy[];
    private projectiles: Projectile[];
    private score: Score;
    private items: Item[];
    private pickedUpItems: Item[];
    private effects: Effect[];
    private gameDimensions: GameDimensions;
    private shotSound: Sound;
    private explosionSound: Sound;
    private itemSound: Sound;
    private loop: any;
    private backgroundSong: Sound;

    private hasStarted = false;

    public constructor(gameDimensions: GameDimensions, initialItems: Item[], soundSettings: SoundSettings) {
        init();
        initKeys();
        this.backgroundSong = new Sound(backgroundMusicData, soundSettings, true, true);

        this.shotSound = new Sound(shotSoundData, soundSettings);
        this.explosionSound = new Sound(explosionSoundData, soundSettings);
        this.itemSound = new Sound(itemSoundData, soundSettings);

        this.gameDimensions = gameDimensions;

        on("spawnProjectile", (x: number, y: number, direction: number,
                               v0: number, damage: number) =>
            this.spawnProjectile(x, y, direction, v0, damage));
        on("newTerrain", (leftIdx: number, rightIdx: number, currentOffset: number) =>
            this.newTerrain(leftIdx, rightIdx, currentOffset));
        on("enemyKilled", (enemy: Enemy) => this.enemyKilled(enemy));

        this.effects = [];
        this.background = new Background(this.gameDimensions);
        this.textLayer = new TextLayer(this.gameDimensions);
        this.terrain = new Terrain(this.gameDimensions);
        this.tank = new Tank(this.gameDimensions.width / 2, -30, this.gameDimensions, this.terrain, this.effects);
        initialItems.forEach((item) => {
            item.apply(this.tank);
        });

        this.score = new Score(Number(localStorage.getItem("tankymctankface_highscore")));
        this.hud = new HUD(this.tank, this.score, this.gameDimensions);

        this.projectiles = [];
        this.enemies = [];
        this.items = [];
        this.pickedUpItems = [];

        this.loop = GameLoop({
            render: () => this.render(),
            update: (dt: number) => this.update(dt),
        });
    }

    public start() {
        this.backgroundSong.play();
        this.loop.start();
        this.hasStarted = true;
    }

    public started() {
        return this.hasStarted;
    }

    public stop() {
        this.backgroundSong.pause();
        this.loop.stop();
    }

    private render() { // render the game state
        resizeIfNeeded();
        this.background.render();
        this.textLayer.render();
        this.enemies.forEach((enemy) => {
            enemy.render();
        });
        this.projectiles.forEach((projectile) => {
            projectile.render();
        });
        this.tank.render();
        this.items.forEach((item) => {
            item.render();
        });
        this.effects.forEach((effect) => {
            effect.render();
        });
        this.terrain.render();
        this.hud.render();
    }

    private update(dt: number) { // update the game state
        this.terrain.update();
        this.enemies.forEach((enemy) => {
            enemy.update(dt);
        });

        const effectIdsToRemove = [];
        for (let index = 0; index < this.effects.length; index++) {
            const effect = this.effects[index];
            if (effect.effectDone()) {
                effectIdsToRemove.push(index);
            }
        }
        for (let i = effectIdsToRemove.length - 1; i >= 0; i--) {
            this.effects.splice(effectIdsToRemove[i], 1);
        }

        const itemIdsToRemove = [];
        for (let index = 0; index < this.items.length; index++) {
            const item = this.items[index];
            if (Math.abs(this.tank.x - item.x) < this.tank.width / 2) {
                itemIdsToRemove.push(index);
                this.tank.pickUp(item);
                this.pickedUpItems.push(item);
                this.itemSound.play();
                const itemsAsNames = this.pickedUpItems.map((pickedUpItem) => pickedUpItem.name);
                localStorage.setItem("tankymctankface_items", JSON.stringify(itemsAsNames));
            }
        }
        for (let i = itemIdsToRemove.length - 1; i >= 0; i--) {
            this.items.splice(itemIdsToRemove[i], 1);
        }
        const projectileIdsToRemove = [];
        const enemyIdsToRemoveSet: Set<number> = new Set();
        for (let index = 0; index < this.projectiles.length; index++) {
            let removeProjectile = false;
            const projectile = this.projectiles[index];
            projectile.update();
            for (let enemyIdx = 0; enemyIdx < this.enemies.length; enemyIdx++) {
                const enemy = this.enemies[enemyIdx];
                if (Math.abs(projectile.x - enemy.x) < 50) {
                    if (enemy.collidesWith(projectile)) {
                        removeProjectile = true;
                        this.blowUpParticles(projectile);
                        this.explosionSound.play();
                        enemy.takeDamage(projectile);
                        if (enemy.isDead()) {
                            if (!enemyIdsToRemoveSet.has(enemyIdx)) {
                                enemyIdsToRemoveSet.add(enemyIdx);
                                emit("enemyKilled", enemy);
                            }
                        }
                    }
                }
            }
            const terrainHeight = this.terrain.getGlobalHeight(projectile.x);
            if (projectile.y >= terrainHeight) {
                this.terrain.explosion(projectile.x);
                removeProjectile = true;
                this.blowUpParticles(projectile);
                this.explosionSound.play();
            }
            if (Math.abs(projectile.x - this.tank.x) < 50) {
                if (this.tank.collidesWith(projectile)) {
                    this.tank.takeDamage(projectile);
                    removeProjectile = true;
                    this.blowUpParticles(projectile);
                    this.explosionSound.play();
                    if (this.tank.isDead()) {
                        this.restartRun(this.score.getHighscore(), this.tank.getPickedUpItems());
                    }
                }
            }
            if (removeProjectile) {
                projectileIdsToRemove.push(index);
            }
        }
        for (let i = projectileIdsToRemove.length - 1; i >= 0; i--) {
            this.projectiles.splice(projectileIdsToRemove[i], 1);
        }
        const enemyIdsToRemove: number[] = Array.from(enemyIdsToRemoveSet).sort((a, b) => a - b);
        for (let i = enemyIdsToRemove.length - 1; i >= 0; i--) {
            this.enemies.splice(enemyIdsToRemove[i], 1);
        }
        this.tank.update(dt);
    }

    private restartRun(highScore: number, itemsToApply: Item[]) {
        this.effects = [];
        this.background = new Background(this.gameDimensions);
        this.textLayer = new TextLayer(this.gameDimensions);
        this.terrain = new Terrain(this.gameDimensions);
        this.tank = new Tank(this.gameDimensions.width / 2, -30, this.gameDimensions, this.terrain, this.effects);

        itemsToApply.forEach((item) => {
            item.apply(this.tank);
        });

        this.score = new Score(highScore);
        this.hud = new HUD(this.tank, this.score, this.gameDimensions);

        this.projectiles = [];
        this.enemies = [];
        this.items = [];
        this.pickedUpItems = [];
    }

    private spawnProjectile(x: number, y: number, direction: number, v0: number, damage: number) {
        this.projectiles.push(new Projectile(x, y, direction, v0, damage));
        this.effects.push(new MuzzleFlash(x, y, direction));
        this.shotSound.play();
    }

    private newTerrain(leftIdx: number, rightIdx: number, currentOffset: number) {
        const difficultyFactor = Math.abs(leftIdx / 1000);
        const numberOfTurrets = Math.round(difficultyFactor * Math.random() *
            (1 + 10 / (difficultyFactor * difficultyFactor / 2 + 1)) * (rightIdx - leftIdx) / 2000);
        const scaleFactor = Math.pow(difficultyFactor, 2) * 3;
        for (let turretIdx = 0; turretIdx < numberOfTurrets; turretIdx++) {
            const index = leftIdx + Math.random() * (rightIdx - leftIdx - 40);
            const shootDirectly = difficultyFactor * Math.random() > 2 && Math.random() > 0.3;
            const inaccuracy = Math.max(1, 80 - scaleFactor * Math.random());
            const msBetweenShots = Math.max(100, 4000 - scaleFactor * Math.random());
            const shootingSpeed = 100 + (Math.random() - 0.5) * 40;
            const maxHealth = Math.round(1 + Math.random() * 0.2 * scaleFactor);
            const damage = maxHealth / 3;
            const points = Math.round(((80 / inaccuracy) * (4000 / msBetweenShots) * shootingSpeed *
                maxHealth * damage * (shootDirectly ? 5 : 1)) / Math.log2(difficultyFactor + 1));
            this.enemies.push(new Turret(index - currentOffset, this.tank, shootingSpeed,
                msBetweenShots, shootDirectly, inaccuracy, maxHealth,
                damage, points, this.gameDimensions, this.terrain));
        }
    }

    private enemyKilled(enemy: Enemy) {
        this.score.addPoints(enemy.points);
        const rand = Math.random() * 100;
        if (rand < 5) {
            this.items.push(new ProjectileItem(enemy.x, enemy.y));
        } else if (rand < 25) {
            this.items.push(new DamageItem(enemy.x, enemy.y));
        } else if (rand < 45) {
            this.items.push(new SpeedItem(enemy.x, enemy.y));
        } else if (rand < 70) {
            this.items.push(new HealthItem(enemy.x, enemy.y));
        } else if (rand < 95) {
            this.items.push(new ReloadTimeItem(enemy.x, enemy.y));
        }
    }

    private blowUpParticles(projectile: Projectile) {
        for (let bpIdx = 0; bpIdx < 10; bpIdx++) {
            const angle = Math.random() * -Math.PI;
            const v0 = 10 + Math.random() * 20;
            const particle: Effect = new BlowupParticle(projectile.x, projectile.y, angle, v0, "#696969");
            this.effects.push(particle);
        }
    }
}
