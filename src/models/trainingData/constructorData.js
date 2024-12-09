 const trainingDataConstructors = [
    //redbull
    { input: { year: 2018, mercedes: 0, redbull: 1, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 419 }, output: { nextYearPoints: 417 } },
    { input: { year: 2019, mercedes: 0, redbull: 1, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 417 }, output: { nextYearPoints: 319 } },
    { input: { year: 2020, mercedes: 0, redbull: 1, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 319 }, output: { nextYearPoints: 585.5 } },
    { input: { year: 2021, mercedes: 0, redbull: 1, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 585.5 }, output: { nextYearPoints: 759 } },
    { input: { year: 2022, mercedes: 0, redbull: 1, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 759 }, output: { nextYearPoints: 860 } },
    { input: { year: 2023, mercedes: 0, redbull: 1, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 860 }, output: { nextYearPoints: 589 } },

    //mercedes
    { input: { year: 2018, mercedes: 1, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 655 }, output: { nextYearPoints: 739 } },
    { input: { year: 2019, mercedes: 1, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 739 }, output: { nextYearPoints: 573 } },
    { input: { year: 2020, mercedes: 1, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 573 }, output: { nextYearPoints: 613.5 } },
    { input: { year: 2021, mercedes: 1, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 613.5 }, output: { nextYearPoints: 515 } },
    { input: { year: 2022, mercedes: 1, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 515 }, output: { nextYearPoints: 409 } },
    { input: { year: 2023, mercedes: 1, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 409 }, output: { nextYearPoints: 468 } },




    //haas
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 1, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 93 }, output: { nextYearPoints: 28 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 1, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 28 }, output: { nextYearPoints: 3 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 1, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 3 }, output: { nextYearPoints: 0 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 1, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 0 }, output: { nextYearPoints: 37 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 1, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 37 }, output: { nextYearPoints: 12 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 1, mclaren: 0, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 12 }, output: { nextYearPoints: 58 } },


    //mclaren
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 1, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 62 }, output: { nextYearPoints: 145 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 1, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 145 }, output: { nextYearPoints: 202 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 1, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 202 }, output: { nextYearPoints: 275 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 1, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 275 }, output: { nextYearPoints: 159 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 1, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 159 }, output: { nextYearPoints: 302 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 1, kicksauber: 0, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 302 }, output: { nextYearPoints: 666 } },

    //kick-sauber
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 1, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 48 }, output: { nextYearPoints: 57 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 1, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 57 }, output: { nextYearPoints: 8 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 1, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 8 }, output: { nextYearPoints: 13 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 1, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 13 }, output: { nextYearPoints: 55 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 1, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 55 }, output: { nextYearPoints: 16 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 1, RB: 0, ferrari: 0, williams: 0, astonmartin: 0, points: 16 }, output: { nextYearPoints: 4 } },


    //RB
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 1, ferrari: 0, williams: 0, astonmartin: 0, points: 33 }, output: { nextYearPoints: 85 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 1, ferrari: 0, williams: 0, astonmartin: 0, points: 85 }, output: { nextYearPoints: 107 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 1, ferrari: 0, williams: 0, astonmartin: 0, points: 107 }, output: { nextYearPoints: 142 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 1, ferrari: 0, williams: 0, astonmartin: 0, points: 142 }, output: { nextYearPoints: 35 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 1, ferrari: 0, williams: 0, astonmartin: 0, points: 35 }, output: { nextYearPoints: 25 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren: 0, kicksauber: 0, RB: 1, ferrari: 0, williams: 0, astonmartin: 0, points: 25 }, output: { nextYearPoints: 46 } },



    //ferrari
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 1, williams: 0, astonmartin: 0, kicksauber: 0, RB: 0, points: 571 }, output: { nextYearPoints: 504 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 1, williams: 0, astonmartin: 0, kicksauber: 0, RB: 0, points: 504 }, output: { nextYearPoints: 131 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 1, williams: 0, astonmartin: 0, kicksauber: 0, RB: 0, points: 131 }, output: { nextYearPoints: 325.5 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 1, williams: 0, astonmartin: 0, kicksauber: 0, RB: 0, points: 325.5 }, output: { nextYearPoints: 554 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 1, williams: 0, astonmartin: 0, kicksauber: 0, RB: 0, points: 554 }, output: { nextYearPoints: 406 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 1, williams: 0, astonmartin: 0, kicksauber: 0, RB: 0, points: 406 }, output: { nextYearPoints: 652 } },


    //Williams
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 1, astonmartin: 0, kicksauber: 0, RB: 0, points: 7 }, output: { nextYearPoints: 1 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 1, astonmartin: 0, kicksauber: 0, RB: 0, points: 1 }, output: { nextYearPoints: 0 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 1, astonmartin: 0, kicksauber: 0, RB: 0, points: 0 }, output: { nextYearPoints: 23 } }, 
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 1, astonmartin: 0, kicksauber: 0, RB: 0, points: 23 }, output: { nextYearPoints: 8 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 1, astonmartin: 0, kicksauber: 0, RB: 0, points: 8 }, output: { nextYearPoints: 28 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 1, astonmartin: 0, kicksauber: 0, RB: 0, points: 28 }, output: { nextYearPoints: 17 } },

    //Aston martin
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 0, astonmartin: 1, kicksauber: 0, RB: 0, points: 55 }, output: { nextYearPoints: 73 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 0, astonmartin: 1, kicksauber: 0, RB: 0, points: 73 }, output: { nextYearPoints: 195 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 0, astonmartin: 1, kicksauber: 0, RB: 0, points: 195 }, output: { nextYearPoints: 77 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 0, astonmartin: 1, kicksauber: 0, RB: 0, points: 77 }, output: { nextYearPoints: 55 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 0, astonmartin: 1, kicksauber: 0, RB: 0, points: 55 }, output: { nextYearPoints: 280 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 0, haas: 0, mclaren:0, ferrari: 0, williams: 0, astonmartin: 1, kicksauber: 0, RB: 0, points: 280 }, output: { nextYearPoints: 94 } },


    //alpine
    { input: { year: 2018, mercedes: 0, redbull: 0, alpine:1, points: 122 }, output: { nextYearPoints: 91 } },
    { input: { year: 2019, mercedes: 0, redbull: 0, alpine: 1, points: 91 }, output: { nextYearPoints: 181 } },
    { input: { year: 2020, mercedes: 0, redbull: 0, alpine: 1, points: 181 }, output: { nextYearPoints: 155 } },
    { input: { year: 2021, mercedes: 0, redbull: 0, alpine: 1,  points: 155 }, output: { nextYearPoints: 173 } },
    { input: { year: 2022, mercedes: 0, redbull: 0, alpine: 1, points: 173 }, output: { nextYearPoints: 120 } },
    { input: { year: 2023, mercedes: 0, redbull: 0, alpine: 1, points: 120 }, output: { nextYearPoints: 65 } },   ];


    module.exports = {trainingDataConstructors};

