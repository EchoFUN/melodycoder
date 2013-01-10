/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		qunit: {
			index: ''
		}
	});

	// Default task.
	grunt.registerTask('default', 'qunit');

};
