import {
    apply,
    from,
    invertNormalScalar,
    NEXT,
    NormalScalar,
    Ordinal,
    quotient,
    reciprocal,
    Scalar,
    Time,
    to,
} from '@musical-patterns/utilities'
import { from as hafuhafuFrom } from '../../../nominals'
import { HafuhafuMode } from '../../../spec'
import { ComputeDurationParameters, ComputeElementProgressParameters } from './types'

const computeElementProgress: (parameters: ComputeElementProgressParameters) => NormalScalar =
    ({ iterationIndex, reverse, totalIndices }: ComputeElementProgressParameters): NormalScalar => {
        if (!reverse) {
            return to.NormalScalar(quotient(iterationIndex, totalIndices))
        }

        const indexReassignedToChangeOwnershipOfIntervalWithNeighboringNote: Ordinal = apply.Modulus(
            apply.Translation(iterationIndex, NEXT),
            to.Modulus(from.Cardinal(totalIndices)),
        )

        return invertNormalScalar(to.NormalScalar(quotient(
            indexReassignedToChangeOwnershipOfIntervalWithNeighboringNote,
            totalIndices,
        )))
    }

const computeDuration: (parameters: ComputeDurationParameters) => Scalar<Time> =
    ({ iterationIndex, layerCount, mode, reverse, sieve, totalIndices }: ComputeDurationParameters): Scalar<Time> => {
        const elementProgress: NormalScalar = computeElementProgress({ iterationIndex, reverse, totalIndices })

        return mode === HafuhafuMode.ZENO && layerCount === to.Cardinal(1) ?
            to.Scalar(to.Time(1)) :
            to.Scalar(to.Time(hafuhafuFrom.Sieve(apply.Scalar(
                apply.Power(
                    sieve,
                    to.Power(from.NormalScalar<number, NormalScalar>(
                        invertNormalScalar(elementProgress),
                    )),
                ),
                to.Scalar(hafuhafuFrom.Sieve(reciprocal(sieve))),
            ))))
    }

export {
    computeDuration,
    computeElementProgress,
}