// these are the variables you can use as inputs to your algorithms
// console.log("fxhash: " + fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//

// FEATURES

// window.$fxhashFeatures = {
//     "Palette": PALETTE_LABEL,
//     "Color smudge": ROUGHYPUFFYLABEL,
//     "Brush direction": BRUSHDIRECTIONLABEL,
// }

// console.info(`fxhash: %c${fxhash}`, 'font-weight: bold');
// console.log('');
// console.group(`Palette: %c${PALETTE_LABEL} `, 'font-weight: bold');
// console.log(`background: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['background']}; `);
// console.log(`primaries: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['primaries'][0]}; `);
// console.log(`primaries: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['primaries'][1]}; `);
// console.log(`hatches: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['hatches'][0]}; `);
// console.log(`hatches: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['hatches'][1]}; `);
// console.log(`rothkoStroke: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['rothkoStroke']}; `);
// console.log(`dirtline: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['dirtline']}; `);
// console.log(`dirtCircles: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['dirtCircles']}; `);
// console.groupEnd();
// console.log(`Palette: %c${PALETTE_LABEL} `, 'font-weight: bold');
// console.log(`Color smudge: %c${ROUGHYPUFFYLABEL}`, 'font-weight: bold');
// console.log(`Brush direction: %c${BRUSHDIRECTIONLABEL}`, 'font-weight: bold');
// console.log('');

// this code writes the values to the DOM as an example
// const containero = document.createElement("div")
// containero.innerText = `
//   random hash: ${fxhash} \n
//   some pseudo random values: [${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ... ]\n
// `
// document.body.prepend(containero)

