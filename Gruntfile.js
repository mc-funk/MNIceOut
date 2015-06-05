//TODO: clean grunt file to ensure all appropriate files are being provided by grunt

module.exports = function(grunt) {
    grunt.initConfig ({
        pkg: grunt.file.readJSON('package.JSON'),
        //uglify: {
        //    options: {
        //        banner: '/*! <%pkg.name%><%=grunt.template.today("yyyy-mm-dd")%>*/\n'
        //    },
        //    map: {
        //        src: 'client/scripts/app.js',
        //        "dest": 'server/public/assets/scripts/app.js'
        //    },
        //},
        copy: {
            main: {
                expand: true,
                cwd: 'node_modules',
                src: [
                    "angular/angular.min.js",
                    "angular/angular.min.js.map",
                    "angular/angular-csp.css",
                    "jquery/dist/jquery.min.js",
                    "jquery/dist/jquery.min.map",
                    "angular-smart-table/dist/smart-table.min.js"
                ],
                "dest": "server/public/vendor"
            },
            css: {
                expand: true,
                cwd: "client/stylesheets",
                src: "style.css",
                "dest": "server/public/assets/css"
            },
            html: {
                expand: true,
                cwd: "client/views",
                src: [
                    "index.html"
                ],
                "dest": "server/public/views"
            },
            iceout: {
                expand: true,
                cwd: "client/scripts/",
                src: "iceout.js",
                "dest": 'server/routes/'
            },
            app: {
                expand: true,
                cwd: "client/scripts/",
                src: "app.js",
                "dest": 'server/public/assets/scripts'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['copy'/*, 'uglify'*/]);
};