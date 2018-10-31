import {
    applyOffset,
    applyScale,
    Block,
    Count,
    DEFAULT_SCALAR_FOR_ALMOST_FULL_SUSTAIN,
    EVEN,
    from,
    FULL_GAIN,
    Index,
    OCTAVE,
    Part,
    raise,
    Scalar,
    to,
} from '../../../../src'
import { BASE_FOR_GAIN_FADE, HAFUHAFU_WITH_PITCH_CIRCULARITY_SCALAR } from '../constants'
import { Direction } from '../types'
import { buildHafuhafuNoteSpec } from './notes'

const buildHafuhafuPart: (block: Block, barCount: Count) => Part =
    (block: Block, barCount: Count): Part => {
        const cellCount: Count = to.Count(block.length)
        const part: Part = []

        for (
            let i: Index = to.Index(0);
            i < to.Index(from.Count(cellCount) * from.Count(barCount));
            i = applyOffset(i, to.Offset(1))
        ) {
            const progress: Scalar = to.Scalar(from.Index(i) / (from.Count(cellCount) * from.Count(barCount)))
            const exponentiatedInverseProgress: number = from.Base(
                raise(BASE_FOR_GAIN_FADE, to.Power(1 - from.Scalar(progress))),
            )
            const gain: Scalar = from.Index(i) % EVEN === 0 ? FULL_GAIN : to.Scalar(exponentiatedInverseProgress - 1)
            const duration: Scalar = to.Scalar(exponentiatedInverseProgress)
            const sustain: Scalar = to.Scalar(from.Scalar(DEFAULT_SCALAR_FOR_ALMOST_FULL_SUSTAIN))
            const pitch: Scalar = to.Scalar(1)

            const cell: Index = block[ from.Index(i) % from.Count(cellCount) ]
            part.push(buildHafuhafuNoteSpec({ cell, gain, duration, sustain, pitch }))
        }

        return part
    }

const buildHafuhafuWithPitchCircularityPart: (block: Block, barCount: Count, direction: Direction) => Part =
    (block: Block, barCount: Count, direction: Direction): Part => {
        const cellCount: Count = to.Count(block.length)
        const part: Part = []

        if (direction === Direction.IN) {
            const totalNotesCount: Count = to.Count(from.Count(cellCount) * from.Count(barCount))
            for (
                let i: Index = to.Index(0);
                i < to.Index(from.Count(totalNotesCount));
                i = applyOffset(i, to.Offset(1))
            ) {
                const progress: Scalar = to.Scalar(from.Index(i) / from.Count(totalNotesCount))

                const gain: Scalar = progress
                const duration: Scalar = raise(OCTAVE, to.Power(1 - from.Scalar(progress)))
                const sustain: Scalar = to.Scalar(from.Scalar(duration) / from.Scalar(OCTAVE))
                const pitch: Scalar = raise(OCTAVE, to.Power(from.Scalar(progress) - 1))

                const cell: Index = block[ from.Index(i) % from.Count(cellCount) ]
                part.push(buildHafuhafuNoteSpec({ cell, gain, duration, sustain, pitch }))

            }
        }
        else if (direction === Direction.OUT) {
            const totalNotesCount: Count = to.Count(applyScale(
                from.Count(cellCount) * from.Count(barCount),
                HAFUHAFU_WITH_PITCH_CIRCULARITY_SCALAR,
            ))
            for (
                let i: Index = to.Index(0);
                i < to.Index(from.Count(totalNotesCount));
                i = applyOffset(i, to.Offset(1))
            ) {
                const progress: Scalar = to.Scalar(from.Index(i) / from.Count(totalNotesCount))

                const gain: Scalar = to.Scalar(from.Scalar(raise(OCTAVE, to.Power(1 - from.Scalar(progress)))) - 1)
                const duration: Scalar = raise(OCTAVE, to.Power(-from.Scalar(progress)))
                const sustain: Scalar = to.Scalar(from.Scalar(duration) / from.Scalar(OCTAVE))
                const pitch: Scalar = raise(OCTAVE, to.Power(from.Scalar(progress)))

                const cell: Index = block[ from.Index(i) % from.Count(cellCount) ]
                part.push(buildHafuhafuNoteSpec({ cell, gain, duration, sustain, pitch }))
            }
        }

        return part
    }

export {
    buildHafuhafuPart,
    buildHafuhafuWithPitchCircularityPart,
}