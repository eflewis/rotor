module.exports = function(grunt){
	grunt.initConfig(
	{
		compass : {
			dev:{
				options:{
					sassDir: 'scss',
					cssDir: 'css'				}
			}
		},
		watch: {
			css: {
				files: ["**/*.scss"],
				tasks: ['compass'],
				options:{
					livereload: true
				}
			}
		},
		livereload: {
			regarde: {
				css: {
					files: ['**/*.scss', '**/*.html'],
          			tasks: ['livereload']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-regarde');
  	grunt.loadNpmTasks('grunt-contrib-livereload');

  	grunt.registerTask('default', ['watch','compass','livereload-start','regarde']);
}