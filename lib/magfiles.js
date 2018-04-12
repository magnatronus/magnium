/**
 * magfiles.js
 * This module exports the magnium files that should either be transpiled or just copied into the final output dir
 */

 // Magnium Project Files
exports.magFiles = {
    transpile: [
        'app.js',
        'theme.js',
        'system/magnium.js'
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
    {src: "i18n", dest: ""},
    {src: "platform",dest: ""},
    {src: "plugins",dest: ""},
    {src: "modules", dest: ""}
];