// tslint:disable no-duplicate-string

import { PitchDurationGainSustainScale } from '@musical-patterns/material'
import {
    apply,
    Block,
    Cardinal,
    ContourElement,
    ContourPiece,
    dividesEvenly,
    evenElements,
    everyNthElement,
    forEach,
    indexOfFinalElement,
    INITIAL,
    oddElements,
    Ordinal,
    slice,
    testAllValuesAreTheSame,
    testGoesMonotonicallyFromValueToValue,
    testGoesQuadraticallyFromValueToValue,
    to,
    totalElements,
    Translation,
    VERY_LOW_PRECISION,
} from '@musical-patterns/utilities'
import {
    computePieces,
    ExistenceStyle,
    HafuhafuMode,
    HafuhafuSpecs,
    initialSpecs,
    Sieve,
    to as hafuhafuTo,
} from '../../../src/indexForTest'
import {
    INDEX_OF_DURATION_IN_CONTOUR,
    INDEX_OF_GAIN_IN_CONTOUR,
    INDEX_OF_PITCH_SCALAR_IN_CONTOUR,
    INDEX_OF_SUSTAIN_IN_CONTOUR,
} from '../../support'

describe('pieces', () => {
    const A_VERY_LARGE_NUMBER_OF_REPETITIONS_WHICH_IMPROVES_MY_ABILITY_TEST_GOING_FROM_ONE_VALUE_TO_ANOTHER_AS_THE_VALUES_I_CHECK_ARE_NOT_QUITE_AT_THE_BEGINNINGS_AND_ENDS_OF_THE_ARRAYS_SO_THE_HIGHER_THE_RESOLUTION_THE_MORE_ACCURATE: Cardinal = to.Cardinal(100)

    describe('droste mode', () => {
        let pieces: ContourPiece<PitchDurationGainSustainScale>
        const iterationKernel: Block = to.Block([ 10, 30, 50, 70, 90 ])
        const sieveFractalRepetitions: Cardinal = A_VERY_LARGE_NUMBER_OF_REPETITIONS_WHICH_IMPROVES_MY_ABILITY_TEST_GOING_FROM_ONE_VALUE_TO_ANOTHER_AS_THE_VALUES_I_CHECK_ARE_NOT_QUITE_AT_THE_BEGINNINGS_AND_ENDS_OF_THE_ARRAYS_SO_THE_HIGHER_THE_RESOLUTION_THE_MORE_ACCURATE
        const existenceStyle: ExistenceStyle = ExistenceStyle.FADE

        describe('with 3 layers', () => {
            beforeEach(() => {
                const specs: HafuhafuSpecs = {
                    ...initialSpecs,
                    existenceStyle,
                    layerCount: to.Cardinal(3),
                    mode: HafuhafuMode.DROSTE,
                    reverse: false,
                    sieve: hafuhafuTo.Sieve(2),
                    sieveFractalRepetitions,
                    stretchPitch: true,
                }
                pieces = computePieces(iterationKernel, specs)
            })

            it('has length equal to the sieve fractal repetitions times the sieve to the power of the layer count minus 1, plus one extra for realignment', () => {
                expect(totalElements(pieces))
                    .toEqual(to.Cardinal(401))
            })

            describe('duration', () => {
                it('the duration decreases quadratically from 1 to 1/sieve', () => {
                    const durations: number[] = pieces.map(
                        (element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_DURATION_IN_CONTOUR),
                    )

                    testGoesQuadraticallyFromValueToValue(durations, 1, 1 / 2, VERY_LOW_PRECISION)
                })
            })

            describe('gain', () => {
                it('the gain on the even elements (layer 1 of 3) decreases from 1 to almost 0', () => {
                    const evenGains: number[] = evenElements(pieces)
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testGoesMonotonicallyFromValueToValue(evenGains, 1, 0, VERY_LOW_PRECISION)
                })

                it('the gain on the even elements of the odd elements (layer 2 of 3) increases from almost 0 to almost 1 - crossing the evens in the middle at 0.5', () => {
                    const evenOddGains: number[] = evenElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testGoesMonotonicallyFromValueToValue(evenOddGains, 0, 1, VERY_LOW_PRECISION)
                })

                it('the gain on all the other elements (layer 3 of 3, AKA the non-layer) is set at 0', () => {
                    const oddOddGains: number[] = oddElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testAllValuesAreTheSame(oddOddGains, 0)
                })
            })

            describe('pitch index', () => {
                it('wraps around the kernel over and over', () => {
                    forEach(
                        pieces,
                        ([ pitchIndex, duration, gain, sustain, pitchScalar ]: ContourElement<PitchDurationGainSustainScale>, index: Ordinal) => {
                            expect(pitchIndex)
                                .toBe(iterationKernel[ index % iterationKernel.length ])
                        },
                    )
                })
            })

            describe('pitch scalar, with stretch pitch true', () => {
                it('the pitch on the even elements (layer 1 of 3) is scaled, by a factor increasing quadratically from 1 to sieve, because the first layer is the highest pitch, fastest one, about to fade out', () => {
                    const evenPitchScalars: number[] = evenElements(pieces)
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(evenPitchScalars, 1, 2, VERY_LOW_PRECISION)
                })

                it('the pitch on the even elements of the odd elements (layer 2 of 3) is scaled, by a factor increasing quadratically from 1/sieve to (almost, because it is not quite at the end) 1', () => {
                    const evenOddPitchScalars: number[] = evenElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(evenOddPitchScalars, 1 / 2, 1, VERY_LOW_PRECISION)
                })

                it('the pitch on all other elements (odds of the odds, layer 3 of 3 AKA the non-layer) are at 2, the max, though it does not really matter because their gains are at zero, but we think of this as like their resting place after having climbed this high I guess', () => {
                    const oddOddPitchScalars: number[] = oddElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testAllValuesAreTheSame(oddOddPitchScalars, 2)
                })
            })

            describe('sustain', () => {
                it('is the reciprocal of the sieve', () => {
                    const sustains: number[] = pieces.map(
                        (element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_SUSTAIN_IN_CONTOUR),
                    )

                    testAllValuesAreTheSame(sustains, 1 / 2)
                })
            })
        })

        describe('with 4 layers', () => {
            beforeEach(() => {
                const specs: HafuhafuSpecs = {
                    ...initialSpecs,
                    existenceStyle,
                    layerCount: to.Cardinal(4),
                    mode: HafuhafuMode.DROSTE,
                    reverse: false,
                    sieve: hafuhafuTo.Sieve(2),
                    sieveFractalRepetitions,
                    stretchPitch: true,
                }
                pieces = computePieces(iterationKernel, specs)
            })

            it('has length equal to the sieve fractal repetitions times the sieve to the power of the layer count minus 1, plus one extra for realignment', () => {
                expect(totalElements(pieces))
                    .toEqual(to.Cardinal(801))
            })

            describe('duration', () => {
                it('the duration decreases quadratically from 1 to 1/sieve, just as it does in layer count 2', () => {
                    const durations: number[] = pieces.map(
                        (element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_DURATION_IN_CONTOUR),
                    )

                    testGoesQuadraticallyFromValueToValue(durations, 1, 1 / 2, VERY_LOW_PRECISION)
                })
            })

            describe('gain', () => {
                it('the gain on the even elements (layer 1 of 4) decreases from 2/3 to almost 0', () => {
                    const evenGains: number[] = evenElements(pieces)
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testGoesMonotonicallyFromValueToValue(evenGains, 2 / 3, 0, VERY_LOW_PRECISION)
                })

                it('the gain on the even elements of the odd elements (layer 2 of 4) increases from 2/3 to 1 then back down to 2/3', () => {
                    const evenOddGains: number[] = evenElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    const ACTUALLY_WE_NEED_TO_DEFINE_HALFWAY_IN_TERMS_OF_THE_DURATION_PROGRESS_AND_SINCE_IT_IS_SPEEDING_UP_THERE_ARE_MORE_INDICES_ON_ONE_SIDE_THAN_OTHER: number = 32
                    const firstHalfOfThose: number[] = slice(
                        evenOddGains,
                        INITIAL,
                        to.Ordinal(
                            (
                                evenOddGains.length -
                                ACTUALLY_WE_NEED_TO_DEFINE_HALFWAY_IN_TERMS_OF_THE_DURATION_PROGRESS_AND_SINCE_IT_IS_SPEEDING_UP_THERE_ARE_MORE_INDICES_ON_ONE_SIDE_THAN_OTHER
                            ) / 2,
                        ),
                    )
                    const secondHalfOfThose: number[] = slice(
                        evenOddGains,
                        to.Ordinal(
                            (
                                evenOddGains.length -
                                ACTUALLY_WE_NEED_TO_DEFINE_HALFWAY_IN_TERMS_OF_THE_DURATION_PROGRESS_AND_SINCE_IT_IS_SPEEDING_UP_THERE_ARE_MORE_INDICES_ON_ONE_SIDE_THAN_OTHER
                            ) / 2,
                        ),
                        indexOfFinalElement(evenOddGains),
                    )

                    testGoesMonotonicallyFromValueToValue(firstHalfOfThose, 2 / 3, 1, VERY_LOW_PRECISION)
                    testGoesMonotonicallyFromValueToValue(secondHalfOfThose, 1, 2 / 3, VERY_LOW_PRECISION)
                })

                it('the gain on the even elements of the odd elements of the odd elements (layer 3 of 4) increases from 0 to almost 2/3', () => {
                    const evenOddOddGains: number[] = evenElements(oddElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testGoesMonotonicallyFromValueToValue(evenOddOddGains, 0, 2 / 3, VERY_LOW_PRECISION)
                })

                it('the gain on all other elements (odds of the odds of the odds, layer 4 of 4 AKA the non-layer) are at zero', () => {
                    const oddOddOddGains: number[] = oddElements(oddElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testAllValuesAreTheSame(oddOddOddGains, 0)
                })
            })

            describe('pitch index', () => {
                it('wraps around the kernel over and over, just the same as it is in layer count 2', () => {
                    forEach(
                        pieces,
                        ([ pitchIndex, duration, gain, sustain, pitchScalar ]: ContourElement<PitchDurationGainSustainScale>, index: Ordinal) => {
                            expect(pitchIndex)
                                .toBe(iterationKernel[ index % iterationKernel.length ])
                        },
                    )
                })
            })

            describe('pitch scalar', () => {
                it('the pitch on the even elements (layer 1 of 4) is scaled, by a factor increasing quadratically from 2^(1/2) to 2^(3/2) (which = 2 in the middle), because the first layer is the highest pitch, fastest one, about to fade out', () => {
                    const evenPitchScalars: number[] = evenElements(pieces)
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(evenPitchScalars, Math.pow(2, 1 / 2), Math.pow(2, 3 / 2), VERY_LOW_PRECISION)
                })

                it('the pitch on the even elements of the odd elements (layer 2 of 4) is scaled, by a factor increasing quadratically from 2^(-1/2) to 2^(1/2) (which = 1 in the middle)', () => {
                    const evenOddPitchScalars: number[] = evenElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(evenOddPitchScalars, Math.pow(2, -1 / 2), Math.pow(2, 1 / 2), VERY_LOW_PRECISION)
                })

                it('the pitch on the even elements of the odd elements of the odd elements (layer 3 of 4) is scaled, by a factor increasing quadratically from 2^(-3/2) to 2^(-1/2) (which = 1/2 in the middle)', () => {
                    const evenOddOddPitchScalars: number[] = evenElements(oddElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(
                        evenOddOddPitchScalars,
                        Math.pow(2, -3 / 2),
                        Math.pow(2, -1 / 2),
                        VERY_LOW_PRECISION,
                    )
                })

                it('the pitch on all the remaining elements (the odds of the odds of the odds, layer 4 of 4 AKA the non-layer) is at 2^(3/2), the max, though it does not really matter because gain is at zero, but I guess we think of this is as its final resting pitch having climbed this high haha', () => {
                    const oddOddOddPitchScalars: number[] = oddElements(oddElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testAllValuesAreTheSame(oddOddOddPitchScalars, Math.pow(2, 3 / 2))
                })
            })
        })

        describe('when stretch pitch is false', () => {
            beforeEach(() => {
                const specs: HafuhafuSpecs = {
                    ...initialSpecs,
                    existenceStyle,
                    layerCount: to.Cardinal(3),
                    mode: HafuhafuMode.DROSTE,
                    reverse: false,
                    sieveFractalRepetitions,
                    stretchPitch: false,
                }
                pieces = computePieces(iterationKernel, specs)
            })

            it('keeps a flat pitch scalar of 1', () => {
                const pitchScalars: number[] = pieces
                    .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                testAllValuesAreTheSame(pitchScalars, 1)
            })
        })

        describe('when reverse is true', () => {
            beforeEach(() => {
                const specs: HafuhafuSpecs = {
                    ...initialSpecs,
                    existenceStyle,
                    layerCount: to.Cardinal(4),
                    mode: HafuhafuMode.DROSTE,
                    reverse: true,
                    sieveFractalRepetitions,
                    stretchPitch: true,
                }
                pieces = computePieces(iterationKernel, specs)
            })

            describe('duration', () => {
                it(
                    `the duration increases from 1/sieve to 1, the opposite of what it does when not reverse - except there's a catch - \
the results are also cyclically translated by -1 so that the last element gets the duration the first element would have; \
this is because when one reverses a set of notes, their original durations are no longer in front of them, but behind them, \
so you have to give your duration to the element behind you`,
                    () => {
                        const TRANSLATION_TO_FLIP_DURATION_ASSOCIATIONS_WHEN_REVERSE: Translation = to.Translation(1)
                        const durations: number[] = apply.Translation(
                            to.Cycle(pieces.map(
                                (element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_DURATION_IN_CONTOUR),
                            )),
                            TRANSLATION_TO_FLIP_DURATION_ASSOCIATIONS_WHEN_REVERSE,
                        )

                        testGoesMonotonicallyFromValueToValue(durations, 1 / 2, 1, VERY_LOW_PRECISION)
                    },
                )
            })

            describe('pitch scalar - with stretch pitch true', () => {
                it('the pitch on the even elements (layer 1 of 4) is scaled, by a factor decreasing quadratically from 2^(3/2) to 2^(1/2) (which = 2 in the middle), because the first layer is the highest pitch, fastest one, when reversed, coming out of silence', () => {
                    const evenPitchScalars: number[] = evenElements(pieces)
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))
                    const evenPitchScalarsDroppingTheLastElementBecauseReverseDrosteMustCycleDurationsByOne: number[] = evenPitchScalars.slice(INITIAL, indexOfFinalElement(evenPitchScalars))
                    testGoesQuadraticallyFromValueToValue(evenPitchScalarsDroppingTheLastElementBecauseReverseDrosteMustCycleDurationsByOne, Math.pow(2, 3 / 2), Math.pow(2, 1 / 2), VERY_LOW_PRECISION)
                })

                it('the pitch on the odd elements of the odd elements (yes, layer 2 of 4, is odd of odd when reverse is true, turns out - try it yourself!) is scaled, by a factor decreasing quadratically from sqrt(2) to 1/sqrt(2) (which = 1 in the middle)', () => {
                    const evenOddPitchScalars: number[] = oddElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(evenOddPitchScalars, Math.pow(2, 1 / 2), Math.pow(2, -1 / 2), VERY_LOW_PRECISION)
                })

                it('the pitch on the odd elements of the even elements of the odd elements (layer 3 of 4, yes, odd of even of odd is layer 3 when reverse is true - try it yourself!) is scaled, by a factor decreasing quadratically from 2^(-1/2) to 2^(-3/2) (which = 1/2 in the middle)', () => {
                    const evenOddOddPitchScalars: number[] = oddElements(evenElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(evenOddOddPitchScalars, Math.pow(2, -1 / 2), Math.pow(2, -3 / 2), VERY_LOW_PRECISION)
                })

                it('the pitch is scaled on all the other elements to 2^(3/2), the max, because thats as high as they reached before going to gain 0 silence (layer 4 of 4, AKA the non-layer, the evens of the evens of the odds)', () => {
                    const evenEvenOddPitchScalars: number[] = evenElements(evenElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testAllValuesAreTheSame(evenEvenOddPitchScalars, Math.pow(2, 3 / 2))
                })
            })

            describe('gain', () => {
                it('the gain on the even elements (layer 1 of 4) increases from 0 to almost 2/3', () => {
                    const evenGains: number[] = evenElements(pieces)
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testGoesMonotonicallyFromValueToValue(evenGains, 0, 2 / 3, VERY_LOW_PRECISION)
                })

                it('the gain on the odd elements of the odd elements (layer 2 of 4) increases from 2/3 to 1 then back down to 2/3 (same as when not reverse, as it is mirrored when layer count is odd, as this example i happened to pick is, so maybe i should actually get an even layer count example too... nah it is covered well enough by the gain curve suite', () => {
                    const oddOddGains: number[] = oddElements(oddElements(pieces))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    const ACTUALLY_WE_NEED_TO_DEFINE_HALFWAY_IN_TERMS_OF_THE_DURATION_PROGRESS_AND_SINCE_IT_IS_SPEEDING_UP_THERE_ARE_MORE_INDICES_ON_ONE_SIDE_THAN_OTHER: number = 34
                    const firstHalfOfThose: number[] = slice(
                        oddOddGains,
                        INITIAL,
                        to.Ordinal(
                            (
                                oddOddGains.length +
                                ACTUALLY_WE_NEED_TO_DEFINE_HALFWAY_IN_TERMS_OF_THE_DURATION_PROGRESS_AND_SINCE_IT_IS_SPEEDING_UP_THERE_ARE_MORE_INDICES_ON_ONE_SIDE_THAN_OTHER
                            ) / 2,
                        ),
                    )
                    const secondHalfOfThose: number[] = slice(
                        oddOddGains,
                        to.Ordinal(
                            (
                                oddOddGains.length +
                                ACTUALLY_WE_NEED_TO_DEFINE_HALFWAY_IN_TERMS_OF_THE_DURATION_PROGRESS_AND_SINCE_IT_IS_SPEEDING_UP_THERE_ARE_MORE_INDICES_ON_ONE_SIDE_THAN_OTHER
                            ) / 2,
                        ),
                        indexOfFinalElement(oddOddGains),
                    )

                    testGoesMonotonicallyFromValueToValue(firstHalfOfThose, 2 / 3, 1, VERY_LOW_PRECISION)
                    testGoesMonotonicallyFromValueToValue(secondHalfOfThose, 1, 2 / 3, VERY_LOW_PRECISION)
                })

                it('the gain on the odd elements of the even elements of the odd elements (layer 3 of 4) decreases from 2/3 to almost 0', () => {
                    const oddEvenOddGains: number[] = oddElements(evenElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testGoesMonotonicallyFromValueToValue(oddEvenOddGains, 2 / 3, 0, VERY_LOW_PRECISION)
                })

                it('the gain on all other elements (evens of the evens of the odds, layer 4 of 4 AKA the non-layer) are at zero', () => {
                    const oddOddOddGains: number[] = evenElements(evenElements(oddElements(pieces)))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                    testAllValuesAreTheSame(oddOddOddGains, 0)
                })
            })
        })

        describe('when sieve is greater than 2', () => {
            beforeEach(() => {
                const specs: HafuhafuSpecs = {
                    ...initialSpecs,
                    existenceStyle,
                    layerCount: to.Cardinal(3),
                    mode: HafuhafuMode.DROSTE,
                    reverse: false,
                    sieve: hafuhafuTo.Sieve(3),
                    sieveFractalRepetitions,
                    stretchPitch: true,
                }
                pieces = computePieces(iterationKernel, specs)
            })

            describe('pitch scalar', () => {
                it('the pitch on every 3rd element (layer 1 of 3) is scaled, by a factor increasing quadratically from 1 to 3, because the first layer is the highest pitch, fastest one, about to fade out', () => {
                    const layerOnePitchScalars: number[] = everyNthElement(pieces, to.Scalar(3))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(layerOnePitchScalars, 1, 3, VERY_LOW_PRECISION)
                })

                it('the pitch on layer 2 of 3 elements is scaled, by a factor increasing quadratically from 1/sieve to (almost, because it is not quite at the end) 1', () => {
                    const layerTwoPitchScalars: number[] = everyNthElement(pieces, to.Scalar(9), to.Ordinal(1))
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testGoesQuadraticallyFromValueToValue(layerTwoPitchScalars, 1 / 3, 1, VERY_LOW_PRECISION)
                })
            })

            describe('duration', () => {
                it('the duration decreases quadratically from 1 to 1/sieve, which is here 1/3', () => {
                    const durations: number[] = pieces.map(
                        (element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_DURATION_IN_CONTOUR),
                    )

                    testGoesQuadraticallyFromValueToValue(durations, 1, 1 / 3, VERY_LOW_PRECISION)
                })
            })

            describe('sustain', () => {
                it('is the reciprocal of the sieve', () => {
                    const sustains: number[] = pieces.map(
                        (element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_SUSTAIN_IN_CONTOUR),
                    )

                    testAllValuesAreTheSame(sustains, 1 / 3)
                })
            })
        })
    })

    describe('zeno mode', () => {
        const KERNEL_AND_OR_CYCLE_KERNEL_DOESNT_MATTER_HERE_AS_LONG_AS_SAME_LENGTH: Block = to.Block([ 1, 2, 1, 1, 2 ])

        describe('gain', () => {
            let pieces: ContourPiece<PitchDurationGainSustainScale>
            let layerOneElements: ContourPiece<PitchDurationGainSustainScale>
            let layerTwoElements: ContourPiece<PitchDurationGainSustainScale>
            let layerThreeElements: ContourPiece<PitchDurationGainSustainScale>
            beforeEach(() => {
                const sieve: Sieve = hafuhafuTo.Sieve(5)
                pieces = computePieces(
                    to.Block([ 0, 1, 0, 0, 1 ]),
                    {
                        ...initialSpecs,
                        existenceStyle: ExistenceStyle.FADE,
                        layerCount: to.Cardinal(3),
                        mode: HafuhafuMode.ZENO,
                        reverse: false,
                        sieve,
                        sieveFractalRepetitions: to.Cardinal(20),
                        sourceKernel: to.Block([ 0, 1, 0, 0, 1 ]),
                    },
                )

                layerOneElements = to.ContourPiece<PitchDurationGainSustainScale>([])
                layerTwoElements = to.ContourPiece<PitchDurationGainSustainScale>([])
                layerThreeElements = to.ContourPiece<PitchDurationGainSustainScale>([])

                forEach(pieces, (element: ContourElement<PitchDurationGainSustainScale>, index: Ordinal) => {
                    if (dividesEvenly(index, sieve)) {
                        if (dividesEvenly(index, apply.Power(sieve, to.Power(2)))) {
                            layerOneElements.push(element)
                        }
                        else {
                            layerTwoElements.push(element)
                        }
                    }
                    else {
                        layerThreeElements.push(element)
                    }
                })
            })

            it('for layer one, they should all stay at full gain', () => {
                const layerOneGains: number [] = layerOneElements
                    .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                testAllValuesAreTheSame(layerOneGains, 1)
            })

            it('for layer two, they should decrease from 1 to 1/2', () => {
                const layerTwoGains: number [] = layerTwoElements
                    .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                testGoesMonotonicallyFromValueToValue(layerTwoGains, 1, 1 / 2, VERY_LOW_PRECISION)
            })

            it('for layer three, they should decrease from 1/2 to 0', () => {
                const layerThreeGains: number [] = layerThreeElements
                    .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_GAIN_IN_CONTOUR))

                testGoesMonotonicallyFromValueToValue(layerThreeGains, 1 / 2, 0, VERY_LOW_PRECISION)
            })
        })

        describe('duration', () => {
            it(
                `the element progress is a "dumb" value, incrementing flatly; \
duration though, needs to be changing by sieve times as much at the beginning of an iteration, \
because there are 1/sieve as many notes happening then - when sieve is 2`,
                () => {
                    const pieces: ContourPiece<PitchDurationGainSustainScale> = computePieces(
                        KERNEL_AND_OR_CYCLE_KERNEL_DOESNT_MATTER_HERE_AS_LONG_AS_SAME_LENGTH,
                        {
                            ...initialSpecs,
                            existenceStyle: ExistenceStyle.FADE,
                            mode: HafuhafuMode.ZENO,
                            reverse: false,
                            sieve: hafuhafuTo.Sieve(2),
                            sieveFractalRepetitions: to.Cardinal(4),
                            sourceKernel: KERNEL_AND_OR_CYCLE_KERNEL_DOESNT_MATTER_HERE_AS_LONG_AS_SAME_LENGTH,
                        },
                    )
                    const durations: number[] = pieces.map(
                        (kernelElement: ContourElement<PitchDurationGainSustainScale>) =>
                            apply.Ordinal(kernelElement, INDEX_OF_DURATION_IN_CONTOUR),
                    )

                    testGoesQuadraticallyFromValueToValue(durations, 1, 1 / 2, VERY_LOW_PRECISION)
                },
            )

            it(
                `the element progress is a "dumb" value, incrementing flatly; \
duration though, needs to be changing by sieve times as much at the beginning of an iteration, \
because there are 1/sieve as many notes happening then - when sieve is 3`,
                () => {
                    const pieces: ContourPiece<PitchDurationGainSustainScale> = computePieces(
                        KERNEL_AND_OR_CYCLE_KERNEL_DOESNT_MATTER_HERE_AS_LONG_AS_SAME_LENGTH,
                        {
                            ...initialSpecs,
                            existenceStyle: ExistenceStyle.FADE,
                            mode: HafuhafuMode.ZENO,
                            reverse: false,
                            sieve: hafuhafuTo.Sieve(3),
                            sieveFractalRepetitions: to.Cardinal(4),
                            sourceKernel: KERNEL_AND_OR_CYCLE_KERNEL_DOESNT_MATTER_HERE_AS_LONG_AS_SAME_LENGTH,
                        },
                    )
                    const durations: number[] = pieces.map(
                        (kernelElement: ContourElement<PitchDurationGainSustainScale>) =>
                            apply.Ordinal(kernelElement, INDEX_OF_DURATION_IN_CONTOUR),
                    )

                    testGoesQuadraticallyFromValueToValue(durations, 1, 1 / 3, VERY_LOW_PRECISION)
                },
            )
        })

        describe('pitch scalar', () => {
            describe('when stretch pitch is false', () => {
                it('all pitch scalars are 1', () => {
                    const sieve: Sieve = hafuhafuTo.Sieve(5)
                    const pieces: ContourPiece<PitchDurationGainSustainScale> = computePieces(
                        to.Block([ 0, 1, 0, 0, 1 ]),
                        {
                            ...initialSpecs,
                            existenceStyle: ExistenceStyle.FADE,
                            layerCount: to.Cardinal(3),
                            mode: HafuhafuMode.ZENO,
                            reverse: false,
                            sieve,
                            sieveFractalRepetitions: to.Cardinal(4),
                            sourceKernel: to.Block([ 0, 1, 0, 0, 1 ]),
                            stretchPitch: false,
                        },
                    )

                    const iterationPitchScalars: number [] = pieces
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testAllValuesAreTheSame(iterationPitchScalars, 1)
                })
            })

            describe('when stretch pitch is true', () => {
                let pieces: ContourPiece<PitchDurationGainSustainScale>
                let layerOneElements: ContourPiece<PitchDurationGainSustainScale>
                let layerTwoElements: ContourPiece<PitchDurationGainSustainScale>
                let layerThreeElements: ContourPiece<PitchDurationGainSustainScale>
                beforeEach(() => {
                    const sieve: Sieve = hafuhafuTo.Sieve(5)
                    pieces = computePieces(
                        to.Block([ 0, 1, 0, 0, 1 ]),
                        {
                            ...initialSpecs,
                            existenceStyle: ExistenceStyle.FADE,
                            layerCount: to.Cardinal(3),
                            mode: HafuhafuMode.ZENO,
                            reverse: false,
                            sieve,
                            sieveFractalRepetitions: A_VERY_LARGE_NUMBER_OF_REPETITIONS_WHICH_IMPROVES_MY_ABILITY_TEST_GOING_FROM_ONE_VALUE_TO_ANOTHER_AS_THE_VALUES_I_CHECK_ARE_NOT_QUITE_AT_THE_BEGINNINGS_AND_ENDS_OF_THE_ARRAYS_SO_THE_HIGHER_THE_RESOLUTION_THE_MORE_ACCURATE,
                            sourceKernel: to.Block([ 0, 1, 0, 0, 1 ]),
                            stretchPitch: true,
                        },
                    )

                    layerOneElements = to.ContourPiece<PitchDurationGainSustainScale>([])
                    layerTwoElements = to.ContourPiece<PitchDurationGainSustainScale>([])
                    layerThreeElements = to.ContourPiece<PitchDurationGainSustainScale>([])

                    forEach(pieces, (element: ContourElement<PitchDurationGainSustainScale>, index: Ordinal) => {
                        if (dividesEvenly(index, sieve)) {
                            if (dividesEvenly(index, apply.Power(sieve, to.Power(2)))) {
                                layerOneElements.push(element)
                            }
                            else {
                                layerTwoElements.push(element)
                            }
                        }
                        else {
                            layerThreeElements.push(element)
                        }
                    })
                })

                it('for layer one, they should all stay flat at 1', () => {
                    const layerOnePitchScalars: number [] = layerOneElements
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    testAllValuesAreTheSame(layerOnePitchScalars, 1)
                })

                it('for layer two, they should increase from 1 to sieve', () => {
                    const layerTwoPitchScalars: number [] = layerTwoElements
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    // I would test that it goes quadratically, but because it's clusters of sampled elements instead of every single element, the utility will fail it.
                    // That's okay, though, because its quadratic change is covered by tests of the layers progress it is based on.
                    testGoesMonotonicallyFromValueToValue(
                        layerTwoPitchScalars,
                        1,
                        5,
                        VERY_LOW_PRECISION,
                    )
                })

                it('for layer three, they should increase from sieve to sieve^2', () => {
                    const layerThreePitchScalars: number [] = layerThreeElements
                        .map((element: ContourElement<PitchDurationGainSustainScale>) => apply.Ordinal(element, INDEX_OF_PITCH_SCALAR_IN_CONTOUR))

                    // I would test that it goes quadratically, but because it's clusters of sampled elements instead of every single element, the utility will fail it.
                    // That's okay, though, because its quadratic change is covered by tests of the layers progress it is based on.
                    testGoesMonotonicallyFromValueToValue(
                        layerThreePitchScalars,
                        5,
                        25,
                        VERY_LOW_PRECISION,
                    )
                })
            })
        })
    })
})
