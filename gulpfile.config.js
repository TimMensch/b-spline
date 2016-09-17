'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.source = './src/';
        this.sourceApp = this.source ;

        this.tsOutputPath =  './dist';
        this.allJavaScript = [ this.source + 'js/**/*.js' ];
        this.allTypeScript = this.sourceApp + '**/*.ts';
        this.appTypeScript = this.sourceApp + '*.ts';
        this.appTypeScriptReferences = "./typings/bspline.d.ts";
        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = './typings/**/*.d.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;