module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      haml: {
        files: ['templates/*.haml'],
        tasks: ['newer:haml'],
        options: {
          spawn: false,
        },
      },

      // js: {
      //   files: ['javascripts/**/*.js'],
      //   tasks: ['concat'],
      //   options: {
      //     spawn: false,
      //   },
      // },

      markdown: {
        files: ['doc/**/*.md'],
        tasks: ['markdown'],
        options: {
          spawn: false,
        },
      },

      css: {
        files: ['stylesheets/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      }
    },

    sass: {
      dist: {
        options: {
         style: 'expanded'
       },
        files: {
          'vendor/stylesheets/main.css': 'stylesheets/main.css.scss'
        }
      }
    },

    haml: {
      dist: {
        expand: true,
        ext: '.html',
        extDot: 'last',
        src: ['templates/**/*.haml'],
        dest: '',
        rename: function (dest, src) {
          return dest + src.replace("templates/", "").replace(".html", "");
        }
      },
    },

    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'doc/*.md',
            dest: 'doc/html/',
            ext: '.html'
          }
        ],

        options: {
         templateContext: {},
         contextBinder: true,
         contextBinderMark: '@@@',
         autoTemplate: false,
         autoTemplateFormat: 'jst',
         markdownOptions: {
           gfm: true,
           highlight: 'manual',
           codeLines: {
             before: '<span>',
             after: '</span>'
           }
         }
       }
      }
  }
  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-haml2html');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-markdown');

  grunt.registerTask('default', ['haml', 'markdown', 'sass']);
};
