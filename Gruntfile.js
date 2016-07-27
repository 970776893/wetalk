/*jslint node: true */
module.exports = function (grunt) {
    //config project
    grunt.initConfig({
        //加载数据
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.distlate.today("yyyy-mm-dd") %>n' +
        '* Copyright (c) <%= grunt.distlate.today("yyyy") %> <%= pkg.author.name %>;' +
        ' */n',

        // Grunt任务开始前的清理工作
        clean: {
            files: ['dist']
        },

        //less插件配置
        less: {
            main: {
                expand: true,
                cwd: 'app/modules/',
                src: ['*.less'],
                dest: 'dist/css/',
                ext: '.css'
            },
            dev: {
                options: {
                    compress: true,
                    yuicompress:false
                }
            }
        },

        //合并文件
        concat: {
            js: {
                src: ['app/modules/app.js', 'app/modules/*.js','app/modules/*/*.js'],
                dest: 'dist/js/app.js'
            }
        },
        //js文件压缩
        uglify: {
             options: {
                mangle: false, //不混淆变量名
            },
            js: {
                src: 'dist/js/app.js',
                dest: 'dist/js/app.min.js'
            }
        },
        //css文件压缩
        cssmin: {
            js: {
                src: ['dist/css/app.css'],
                dest: 'dist/css/app.min.css'
            }
        },

        //文件校验
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                src: [ '<%= uglify.js.src %>']
            }
        },
        //watch任务，实时监听文件的变化，并进行编译
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= concat.js.src %>',
                tasks: ['concat:js', 'jshint:js', 'uglify:js']
            },
            less: {
                files: 'app/modules/*.less',
                tasks: ['less', 'cssmin']
            }
        },

    });


    //加载各种grunt插件完成任务
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');


    //注册服务
    grunt.registerTask('default', ['clean', 'less', 'concat:js', 'jshint', 'uglify', 'cssmin', 'watch']);
    grunt.registerTask('online', ['clean',  'less:main','concat', 'jshint', 'uglify', 'cssmin']);
};

