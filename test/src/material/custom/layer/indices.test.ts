import { as, Cardinal, Ordinal } from '@musical-patterns/utilities'
import {
    computeLayerIndices,
    computeTotalIndices,
    HafuhafuMode,
    Layer,
    LayerIndex,
    Sieve,
    SieveFractalRepetitions,
} from '../../../../../src/indexForTest'

describe('layer indices', (): void => {
    describe('droste mode', (): void => {
        const REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES: SieveFractalRepetitions = as.Multiple<Cardinal<LayerIndex[]>>(2)
        const sieve: Sieve = as.Multiple<LayerIndex>(2)

        it('tells you which layer a droste element is in, for layer count 2', (): void => {
            const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(2)
            const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                sieve,
                sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
            })
            const layerIndices: LayerIndex[] = computeLayerIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                reverse: false,
                sieve,
                totalIndices,
            })

            expect(layerIndices)
                .toEqual([
                    0, 1,
                    0, 1,
                    0,
                ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
        })

        it('tells you which layer a droste element is in, for layer count 3', (): void => {
            const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(3)
            const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                sieve,
                sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
            })
            const layerIndices: LayerIndex[] = computeLayerIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                reverse: false,
                sieve,
                totalIndices,
            })

            expect(layerIndices)
                .toEqual([
                    1, 0, 1, 2,
                    1, 0, 1, 2,
                    1,
                ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
        })

        it('tells you which layer a droste element is in, for layer count 4', (): void => {
            const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(4)
            const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                sieve,
                sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
            })
            const layerIndices: LayerIndex[] = computeLayerIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                reverse: false,
                sieve,
                totalIndices,
            })

            expect(layerIndices)
                .toEqual([
                    2, 1, 2, 0, 2, 1, 2, 3,
                    2, 1, 2, 0, 2, 1, 2, 3,
                    2,
                ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
        })

        it('tells you which layer a droste element is in, for layer count 5', (): void => {
            const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(5)
            const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                sieve,
                sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
            })
            const layerIndices: LayerIndex[] = computeLayerIndices({
                layerCount,
                mode: HafuhafuMode.DROSTE,
                reverse: false,
                sieve,
                totalIndices,
            })

            expect(layerIndices)
                .toEqual([
                    3, 2, 3, 1, 3, 2, 3, 0, 3, 2, 3, 1, 3, 2, 3, 4,
                    3, 2, 3, 1, 3, 2, 3, 0, 3, 2, 3, 1, 3, 2, 3, 4,
                    3,
                ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
        })

        describe('when reverse is true', (): void => {
            it('tells you which layer a droste element is in, for layer count 2', (): void => {
                const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(2)
                const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    sieve,
                    sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
                })
                const layerIndices: LayerIndex[] = computeLayerIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    reverse: true,
                    sieve,
                    totalIndices,
                })

                expect(layerIndices)
                    .toEqual([
                        0,
                        1, 0,
                        1, 0,
                    ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
            })

            it('tells you which layer a droste element is in, for layer count 3', (): void => {
                const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(3)
                const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    sieve,
                    sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
                })
                const layerIndices: LayerIndex[] = computeLayerIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    reverse: true,
                    sieve,
                    totalIndices,
                })

                expect(layerIndices)
                    .toEqual([
                        1,
                        2, 1, 0, 1,
                        2, 1, 0, 1,
                    ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
            })

            it('tells you which layer a droste element is in, for layer count 4', (): void => {
                const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(4)
                const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    sieve,
                    sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
                })
                const layerIndices: LayerIndex[] = computeLayerIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    reverse: true,
                    sieve,
                    totalIndices,
                })

                expect(layerIndices)
                    .toEqual([
                        2,
                        3, 2, 1, 2, 0, 2, 1, 2,
                        3, 2, 1, 2, 0, 2, 1, 2,
                    ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
            })

            it('tells you which layer a droste element is in, for layer count 5', (): void => {
                const layerCount: Cardinal<Layer[]> = as.Cardinal<Layer[]>(5)
                const totalIndices: Cardinal<LayerIndex[]> = computeTotalIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    sieve,
                    sieveFractalRepetitions: REPEAT_THE_SIEVE_FRACTAL_AT_LEAST_ONCE_TO_DEMONSTRATE_THE_CONSEQUENT_REPTITION_IN_THE_LAYER_INDICES,
                })
                const layerIndices: LayerIndex[] = computeLayerIndices({
                    layerCount,
                    mode: HafuhafuMode.DROSTE,
                    reverse: true,
                    sieve,
                    totalIndices,
                })

                expect(layerIndices)
                    .toEqual([
                        3,
                        4, 3, 2, 3, 1, 3, 2, 3, 0, 3, 2, 3, 1, 3, 2, 3,
                        4, 3, 2, 3, 1, 3, 2, 3, 0, 3, 2, 3, 1, 3, 2, 3,
                    ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
            })
        })
    })

    describe('zeno mode', (): void => {
        it(
            `repeats the shape of the sieve fractal for as many indices as are asked for \
(calculating that count, which involves the sieve fractal repetitions and cycling against the kernel, \
is a separate problem solved by the method for calculating that total # of indices)`,
            (): void => {
                const layerIndices: LayerIndex[] = computeLayerIndices({
                    layerCount: as.Cardinal<Layer[]>(4),
                    mode: HafuhafuMode.ZENO,
                    reverse: false,
                    sieve: as.Multiple<LayerIndex>(3),
                    totalIndices: as.Cardinal<LayerIndex[]>(135),
                })

                expect(layerIndices)
                    .toEqual([
                        0, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,

                        0, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,

                        0, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,

                        0, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,

                        0, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,
                        1, 3, 3, 2, 3, 3, 2, 3, 3,
                    ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
            },
        )

        it('when reversed, flips it backward', (): void => {
            const layerIndices: LayerIndex[] = computeLayerIndices({
                layerCount: as.Cardinal<Layer[]>(4),
                mode: HafuhafuMode.ZENO,
                reverse: true,
                sieve: as.Multiple<LayerIndex>(3),
                totalIndices: as.Cardinal<LayerIndex[]>(135),
            })

            expect(layerIndices)
                .toEqual([
                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 0,

                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 0,

                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 0,

                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 0,

                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 1,
                    3, 3, 2, 3, 3, 2, 3, 3, 0,
                ].map((expectedLayerIndex: number): Ordinal<Layer[]> => as.Ordinal<Layer[]>(expectedLayerIndex)))
        })
    })
})
