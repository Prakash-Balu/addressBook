var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(cleanCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', ['sass'], function() {
    gulp.watch(paths.sass, ['sass']);
});

/*
 * Address JSON generation
 */
gulp.task('address-json-generation', function() {
    var excelToJson = require('convert-excel-to-json');
    const result = excelToJson({
        sourceFile: './www/data/addressbook.xlsx',
        //sheets: ['Sheet1'],
        columnToKey: {
            A: 'name',
            B: 's/o',
            C: 'address',
            D: 'area',
            E: 'city',
            F: 'state',
            G: 'phone',
            H: 'mobile'
        }
    });

    var jsonfile = require('jsonfile');

    var file = './www/data/address.json';

    jsonfile.writeFile(file, result, function(err) {
        //console.error(err)
    })
});