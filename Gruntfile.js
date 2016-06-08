module.exports = function(grunt){
  // 强制使用Unix换行符
  grunt.util.linefeed = '\n';
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      tmp: '.tmp',
      src: 'src',
      dist: 'dist',
      test: 'test',

      index: 'index.html',
      html: 'html',
      images: 'images',
      fonts: 'fonts',
      css: 'css',
      js: 'js',
    },
    types: {
      image: '{png,jpg,jpeg,gif,webp,svg}',
      font: '{ttf,otf,eot,svg}'
    },

    // 清理
    clean: {
      all: ['<%= paths.tmp %>', '<%= paths.dist %>'],
      html: ['<%= paths.dist %>/<%= paths.index %>', '<%= paths.dist %>/<%= paths.html %>'],
      image: '<%= paths.dist %>/<%= paths.images %>',
      css: '<%= paths.dist %>/<%= paths.css %>',
      js: '<%= paths.dist %>/<%= paths.js %>',
    },

    // 复制文件
    copy: {
      css: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: ['**/*.css'], dest: '<%= paths.dist %>'},
        ]
      },
      fonts: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: ['**/*.<%= types.font %>'], dest: '<%= paths.dist %>'},
        ]
      },
      html: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: ['**/*.html'], dest: '<%= paths.dist %>'},
        ]
      },
      images: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: ['**/*.<%= types.image %>'], dest: '<%= paths.dist %>'},
        ]
      },
      js: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: ['**/*.js'], dest: '<%= paths.dist %>'},
        ]
      }
    },

/******************************** css ********************************/

    // 优化css结构
    csscomb: {
      options: {
        config: 'config/.csscomb.json'
      },
      css: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: '**/*.css', dest: '<%= paths.src %>', ext: '.css' }
        ]
      }
    },

    // // 格式化css
    // cssformat: {
    //   options: {indent: '\t'},
    //   css: {
    //     files: [
    //       {expand: true, cwd: '<%= paths.src %>', src: '**/*.css', dest: '<%= paths.src %>', ext: '.css' }
    //     ]
    //   }
    // },

    // 检查css语法
    csslint: {
      options: {
        csslintrc: 'config/.csslintrc'
      },
      css: {
        files: [
          {expand: true, cwd: '<%= paths.src %>', src: '**/*.css', dest: '<%= paths.src %>', ext: '.css' }
        ]
      }
    },

    // 添加浏览器前缀
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 7', 'ie 8', 'ie 9'],
        map: true
      },
      // less: {
      //   src: '<%= pkg.path.dest.less %>*.css'
      // },
      css: {
        src: '<%= paths.dist %>/<%= paths.css %>/**/*.css'
      }
    },

    // 压缩css文件
    cssmin: {
      options: {
        compatibility: ['ie7', 'ie8'],
        keepSpecialComments: '*',
        keepBreaks: true
      },
      css: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.dist %>/',
            src: ['**/*.css', '!**/*.min.css'],
            dest: '<%= paths.dist %>',
            ext: '.min.css'
          }
        ]
      }
    },

/******************************** js ********************************/

    // js语法检查
    jshint: {
      options: {
        jshintrc: 'config/.jshintrc'
      },
      files: ['Gruntfile.js', '<%= paths.src %>/**/*.js', '<%= paths.test %>/**/*.js', '!<%= paths.src %>/js/lib/**/*.js'],
    },

    // 压缩js文件
    uglify: {
      options: {
        // banner: '/*! <%= pkg.name %>-<%= pkg.version %>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      js: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.dist %>/',
            src: ['**/*.js', '!**/*.min.js', '!js/lib/**/*.js'],
            dest: '<%= paths.dist %>',
            ext: '.min.js'}
        ]
      }
    },

/******************************** image ********************************/

    // 图片压缩
    imagemin: {
      compress: {
        options: {
          optimizationLevel: 7,
          pngquant: true
        },
        files: [
          {expand: true, cwd: '<%= paths.dist %>', src: ['**/*.<%= types.image %>'], dest: '<%= paths.dist %>'},
        ]
      }
    },

/******************************** html ********************************/

    // // 验证html语法
    // validation: {
    //   options: {
    //     charset: 'utf-8',
    //     doctype: 'HTML5',
    //     failHard: true,
    //     reset: true,
    //     relaxerror: [
    //       'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
    //       'Element img is missing required attribute src.'
    //     ]
    //   },
    //   files: {
    //     src: '<%= paths.src %>/**/*.html'
    //   }
    // },

    // 压缩HTML
    htmlmin: {
      options: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true
      },
      html: {
        files: [
          {expand: true, cwd: '<%= paths.dist %>', src: ['**/*.html'], dest: '<%= paths.dist %>'}
        ]
      }
    },

    // 处理html中css、js 引入合并问题
    usemin: {
      html: ['<%= paths.dist %>/**/*.html']
    },

/******************************** test ********************************/

    // 单元测试
    qunit: {
      files: ['<%= paths.test %>/**/*.html']
    },

/******************************** util ********************************/

    // 合并js、css文件
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      jsall: {
        src: ['<%= paths.dist %>/**/*.js', '!<%= paths.dist %>/**/*.min.js', '!<%= paths.dist %>/js/lib/**/*.js'],
        dest: '<%= paths.dist %>/<%= paths.js %>/<%= pkg.name %>.js'
      },
      cssall: {
        src: ['<%= paths.dist %>/**/*.css', '!<%= paths.dist %>/**/*.min.css'],
        dest: '<%= paths.dist %>/<%= paths.css %>/<%= pkg.name %>.css'
      }
    },

    // 监控文件变化
    watch: {
      css: {
        files: '<%= paths.src %>/**/*.css',
        tasks: ['buildcss', 'concat:cssall']
      },
      font: {
        files: '<%= paths.src %>/**/*.<%= types.font %>',
        tasks: ['buildfont']
      },
      html: {
        files: '<%= paths.src %>/**/*.html',
        tasks: 'buildhtml'
      },
      image: {
        files: '<%= paths.src %>/**/*.<%= types.image %>',
        tasks: 'buildimage'
      },
      js: {
        files: '<%= paths.src %>/**/*.js',
        tasks: ['buildjs', 'concat:jsall']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-csscomb');
  // grunt.loadNpmTasks('grunt-cssformat');
  // grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('buildcss', ['csscomb', 'csslint', 'copy:css', 'autoprefixer', 'cssmin']);
  grunt.registerTask('buildfont', ['copy:fonts']);
  grunt.registerTask('buildhtml', ['copy:html', 'htmlmin', 'usemin']);
  grunt.registerTask('buildimage', ['copy:images', 'imagemin']);
  grunt.registerTask('buildjs', ['jshint', 'copy:js', 'uglify']);

  grunt.registerTask('build', ['buildcss', 'buildfont', 'buildhtml', 'buildimage', 'buildjs', 'concat']);
  grunt.registerTask('test', []);
  grunt.registerTask('default', ['clean', 'test', 'build', 'watch']);
};
