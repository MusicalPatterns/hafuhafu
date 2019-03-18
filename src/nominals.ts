// tslint:disable ban-types

import { computeNominalInterface, DUMMY_VALUE_FOR_COMPUTING_NOMINAL_INTERFACE } from '@musical-patterns/utilities'

type Kernel = number[] & { _NominalBrand: 'Kernel' }
type Sieve = Number & { _NominalBrand: 'Sieve' }

const { to, from } = computeNominalInterface({
    number: {
        Sieve: DUMMY_VALUE_FOR_COMPUTING_NOMINAL_INTERFACE as Sieve,
    },
    numericArray: {
        Kernel: DUMMY_VALUE_FOR_COMPUTING_NOMINAL_INTERFACE as Kernel,
    },
})

export {
    to,
    from,
    Kernel,
    Sieve,
}
