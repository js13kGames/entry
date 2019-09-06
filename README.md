# Xycore
## Js13k 2019 Desktop Category entry

Xycore is a 'throwback' to some old favorites, taking inspiration from Hero Core and Metroid to bring you a simple adventure on an unknown planet - take on the four bosses and destroy the reactor core!

### Controls:
+ Arrow Keys - Movement
+ Space - Shoot
+ Gamepad Supported!

### Hints:
+ You can reload to your last checkpoint by refreshing the page at any point
+ There are several upgrades hidden throughout the world - find them to make the game a bit easier


Thank you for playing!

## Build System/Code Organization

For this year's JS13k I decided to _not_ use Gulp/Webpack as I have done in former years.
Instead, I opted for writing my game in a single file (Heavily utilizing bookmarks), and 
running it through Google's Closure Compiler.

The exact compilation commands are in `compress.bat`. For image and zip size reduction I used
`optipng` and `advzip`. To zip the file, I used 7zip.

Makes heavy use of ES6 and up, since I'm assuming most of the target audience will have decently
up-to-date browsers that aren't Internet Explorer or Safari.