const gulp = require("gulp");

const uglify = require("gulp-uglify");

function copy() {
  return gulp
    .src([
      "*.html",
      "**/*.jpg",
      "**/*.css",
      "**/*.js",
      "**/*.html",
      "**/**/*.css"
    ])
    .pipe(uglify())
    .pipe(gulp.dest("build"));
}
gulp.task("copy", copy);

const babel = require("gulp-babel");

gulp.task("processJs", () =>
  gulp
    .src("js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
);
