module.exports = function(grunt) {
    grunt.initConfig ({
        pkg: grunt.file.readJSON('package.JSON'),
        uglify: {
            options: {
                banner: '/*! <%pkg.name%><%=grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            map: {
                src: 'client/scripts/map.js',
                "dest": 'server/public/assets/scripts/map.min.js'
            },
        },
        copy: {
            main: {
                expand: true,
                cwd: 'node_modules',
                src: [
                    "angular/angular.min.js",
                    "angular/angular.min.js.map",
                    "angular/angular-csp.css",
                    "jquery/dist/jquery.min.js",
                    "jquery/dist/jquery.min.map"
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
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['copy', 'uglify']);
};