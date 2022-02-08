const plugin = require('tailwindcss/plugin');
const colorNames = require('./color-names');
const themes = require('./themes');
const hexToRgb = require('./hex-to-rgb');
const withOpacity = require('./with-opacity');

const prefix = 'th-';
function prefixedColorName(name) {
  return `${prefix}${name}`;
}

function convertThemeColorsToRgb(theme) {
  const resultObject = {};
  Object.entries(theme).forEach(([rule, value]) => {
    // neither themes nor colorNames have th- prefix
    resultObject[colorNames[rule]] = colorNames.hasOwnProperty(rule)
      ? hexToRgb(value)
      : value;
  });
  return resultObject;
}

const mainFunction = ({ addBase }) => {
  const resultThemes = {};
  Object.entries(themes).forEach(([selector, theme], index) => {
    const _selector = index === 0 ? ':root' : selector;
    resultThemes[_selector] = convertThemeColorsToRgb(theme);
  });

  console.log('resultThemes', resultThemes);
  addBase(resultThemes);
};

// mainFunction({ addBase: 1 });

const colorFns = {};
// colorNames without prefix, add th- prefix here
Object.entries(colorNames).forEach(([name, value]) => {
  colorFns[prefixedColorName(name)] = withOpacity(value);
});

module.exports = plugin(mainFunction, {
  theme: { extend: { colors: colorFns } },
});
