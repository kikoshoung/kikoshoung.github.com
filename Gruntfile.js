module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            css: 'css/',
            js: 'js/',
            widget: 'js/widget/'
        },
        banner: '/* v<%= pkg.version %>, last modified at <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */',
        uglify: {
            options: {
                banner: '<%= banner %>\n',
                beautify: {
                    ascii_only: true
                }
            },
            production: {
                files: [{
                    expand: true,     // Enable dynamic expansion.
                    cwd: '<%= dirs.js %>',      // Src matches are relative to this path.
                    src: ['**/*.js', '!**/*.min.js'], // Actual pattern(s) to match.
                    dest: '<%= dirs.js %>',   // Destination path prefix.
                    ext: '.js'   // Dest filepaths will have this extension.
                }]
            }
        },
        less: {
            production: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.css %>',
                    src: ['all.less'],
                    dest: '<%= dirs.css %>',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: 0
            },
            production: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.css %>',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= dirs.css %>',
                    ext: '.css'
                }]
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>\n'
            },
            base: {
                src: ['<%= dirs.css %>*.less', '!<%= dirs.css %>all.less'],
                dest: '<%= dirs.css %>all.less'
            }
        },
        htmlmin: {  
            options: {                                 
                    removeComments: true,
                    collapseWhitespace: true
            },                                
            production: {                                    
                files: [{
                    expand: true,
                    src: ['**/*.html', '!node_modules/**/*.html'],
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('prd', ['concat', 'less', 'cssmin', 'uglify', 'htmlmin']);
    grunt.registerTask('dev', ['less']);
}; 