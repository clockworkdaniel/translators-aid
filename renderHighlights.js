/**
 * If you want access to full parameters of the function (i.e. isInclusive, highlightColor, textColor, reset),
 * copy and paste the contents of this file into your console, press enter, and call the function with as listed in 'example usage' below
 */

const TRANSLATOR_WARNING_CLASS = "translator-warn";

const removeHighlights = () => {
  const highlights = document.querySelectorAll(`.${TRANSLATOR_WARNING_CLASS}`);
  highlights.forEach((highlight) => {
    const { innerText } = highlight;
    const textNode = document.createTextNode(innerText);
    highlight.parentNode.replaceChild(textNode, highlight);
  });
};

/**
 * The following function highlights words in the webpage which are above, and potentially below, set lengths.
 *
 * Note: You can call renderWarnings multiple times if you need to.
 * By default any words which are already highlighted will continue to be as the were when the function was previously called.
 *
 * Example usage:
 *
 * renderWarnings(8);                 <= highlight all words 8 letters long and above
 * renderWarnings(5, 15);             <= highlight words with more than 4 and less than 16 letters
 * renderWarnings(5, 15, false)       <= highlight words with more than 5 and less than 15 letters
 *
 * Comprehensive usage:
 *
 * renderWarnings(
 *   8,                         <= minLength is always required
 *   undefined,                 <= pass undefined to retain default values
 *   true,
 *   "#000000",                 <= colors can be passed as hex, rgb etc
 *   "rgb(250, 250, 250)",
 *   true                       <= as opposed to default, resets the page prior to applying latest highlights
 * );
 *
 */

let renderHighlights = (
  minLength,
  maxLength = 80, // default is longest german world
  isInclusive = true, // include min/max length words in results by default
  highlightColor = "hotpink",
  textColor = "white",
  reset = false
) => {
  if (
    typeof minLength !== "number" ||
    typeof maxLength !== "number" ||
    typeof isInclusive !== "boolean" ||
    typeof highlightColor !== "string" ||
    typeof textColor !== "string"
  ) {
    console.error("faulty params passed to renderWarnings()");
    return;
  }

  const charaterSet =
    "a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-";

  const wordRegex = new RegExp( // remove leading and trailing punctuation
    `(?:^[^${charaterSet}]*)(?<word>[${charaterSet}]+)(?:.|\n|\r)*`
  );

  const escapeStringForRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  const isOffendingWord = (word) =>
    isInclusive
      ? word.length >= minLength && word.length <= maxLength
      : word.length > minLength && word.length < maxLength;

  if (reset) {
    removeHighlights();
  }

  const elements = document.querySelectorAll(
    `:not(script):not(style):not(${TRANSLATOR_WARNING_CLASS}`
  );

  elements.forEach((currentElement) => {
    Array.from(currentElement.childNodes)
      .reverse()
      .forEach((node) => {
        if (node.nodeType !== 3) {
          return;
        }

        const offendingWords = node.nodeValue
          .split(" ")
          .map((characterGroup) => characterGroup.replace(wordRegex, "$<word>"))

          .filter(isOffendingWord);

        if (offendingWords.length) {
          const regexInternal = offendingWords
            .map(escapeStringForRegex)
            .reduce(
              (acc, word, index) => `${acc}${index === 0 ? "" : "|"}${word}`,
              ""
            );
          const offendingWordsRegex = new RegExp(`(${regexInternal})`);
          // group in regex means that separators are included in output
          const splitText = node.nodeValue.split(offendingWordsRegex);

          let replacingChildNodes = document.createDocumentFragment();

          splitText.forEach((text) => {
            if (text.match(offendingWordsRegex)) {
              const span = document.createElement("span");
              span.append(text);
              span.className = TRANSLATOR_WARNING_CLASS;
              span.setAttribute(
                "style",
                `background-color: ${highlightColor}; color: ${textColor};`
              );
              replacingChildNodes.append(span);
            } else {
              replacingChildNodes.append(text);
            }
          });
          currentElement.replaceChild(replacingChildNodes, node);
        }
      });
  });
};
