/**
 * magfiles.js
 * This module exports various magnium files that should either be transpiled or just copied into the final output dir
 */

 // Magnium Project Files
exports.magFiles = {
    transpile: [
        'app.js',
        'theme.js',
        'system/magnium.js',
        'system/promises.core.min.js'
    ],
    copy: [
        'system/static/backbone.js',
        'system/static/moment.js',
        'system/static/underscore.js'
    ]
};

// Titanium Project dirs
exports.auxFiles =  [
    {src: "assets", dest: "Resources"},
    {src: "i18n", dest: "i18n"},
    {src: "platform",dest: "platform"},
    {src: "plugins",dest: "plugins"},
    {src: "modules", dest: "modules"}
];

// Misc Project files
exports.miscFiles = [
    {src: "DefaultIcon.png", dest: ""},
    {src: "DefaultIcon-ios.png", dest: ""},
    {src: "tiapp.xml", dest: ""}
];