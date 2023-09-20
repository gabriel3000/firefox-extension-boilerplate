# FireFox Extension Boilerplate

## Why?
I wanted to build a FireFox Extension using TypeScript and SCSS. After 3 minutes of searching, nothing surfaced resembling a boilerplate that provided what I needed out-of-the-box.

__NOTE 💫:__
The example extension, when turned on, will play a note when a user hovers over a link using the webAudioApi. The volume will be relatively low, but this still might suprise you if you're not expecting it.

## Key WebPack package
Key package used: https://github.com/hiikezoe/web-ext-webpack-plugin
This is a webpack plugin that webpack-ifys Mozzila's `web-ext` cli for building AddOns/Extenstions

## Web-Ext cli
You might want to eventually install `web-ext`. When the time comes, this CLI provides features you may want to use before publishing your Extension: https://extensionworkshop.com/documentation/develop/web-ext-command-reference/

## More stuff!
Please submit a PR to add more helpful features to the boilerplate.

## Current example
In the current example Extension, links will play a note when hovered over using the WebAudio api. The note will be a random pitch everytime a link is hovered. This ability can be toggled on and off in the extension popup.

## Getting started
`npm install` Regular install

`npm run start` This should automatically spin up a FireFox browser in developer mode with the WebPack build folder, `/extension` installed.


