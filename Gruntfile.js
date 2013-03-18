module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        // concat : {
        //     domop : {
        //         src: ['js/component/ad-killer-install.js', 'js/component/ad-killer.js'],
        //         dest: 'dest/concated.js'
        //     }
        // },
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            dist: {
                files: {
                    'dist/component/ad-killer-install.js': 'js/component/ad-killer-install.js',
                    'dist/component/ad-killer.js': 'js/component/ad-killer.js'
                }
            }
        }
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 注册任务
    // grunt.registerTask('default', ['concat', 'uglify']);
    grunt.registerTask('default', ['uglify']);

}; 