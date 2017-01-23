const glob = require('glob');
const K = require('./constants');
let commonModules;

/**
 * Go through all the files within the common app (/apps/common/js) and generate
 * a list of the modules that will be provided by the built bundle.
 *
 * This list will include both .js and .jsx sources.
 *
 * @return {String[]}
 *         The list of module IDs *including* any loader plugin prefixes, like
 *         `jsx!`.
 */
module.exports = function () {
  if (commonModules) { // cache
    return commonModules;
  }

  const PKG_NAME = K.pkgName;
  const COMMON_ROOT = `${K.commonRoot}/js`;

  commonModules = ['js', 'jsx']
    // Find all the source files in the common bundle and extract their names
    // without the extensions (i.e, module ids):
    .reduce((modules, ext) => {
      const pattern = `**/*.${ext}`;
      const extStripper = new RegExp(`\\.${ext}$`);
      const prefix = ext === 'jsx' ? 'jsx!' : '';

      return glob.sync(pattern, { cwd: COMMON_ROOT }).map((file) => {
        if (!file.length) {
          return '';
        }

        return prefix + file.replace(extStripper, '');
      }).concat(modules);
    }, [])

    // Prefix all common modules with the package's name, e.g:
    // given "canvas_quizzes" for a package name, and "core/promise" as a module
    // id, we get: "canvas_quizzes/core/promise"
    //
    // This is because app modules reference the common modules by specifying
    // the package name as a prefix.
    .map((moduleId) => {
      if (moduleId.substr(0, 4) === 'jsx!') {
        return moduleId.replace('jsx!', `jsx!${PKG_NAME}/`);
      }

      return [PKG_NAME, moduleId].join('/');
    })

    // Finally, we need to also mark the 3rd-party packages that we're bundling
    // in the common bundle (e.g, RSVP, qTip, whatever).
    //
    // Those libraries are defined in package.json under the custom
    // "requirejs.bundledDependencies" key.
    //
    // See package.json for those dependencies.
    .concat(K.bundledDependencies);

  return commonModules;
};

