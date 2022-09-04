/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import * as R from 'ramda';
import Api from '../tools/api';

const api = new Api();

const getValue = R.prop('value')
const getWriteLogFn = R.prop('writeLog')
const getHandleErrorFn = R.prop('handleError')
const getHandleSuccessFn = R.prop('handleSuccess')

const logValue = R.compose(
    R.apply(R.call),
    R.juxt([getWriteLogFn, getValue])
)
const tapLogValue = R.tap(logValue)

const isValidValue = R.allPass([
    R.o(R.lt(R.__, 10), R.length),
    R.o(R.gt(R.__, 2), R.length),
    R.test(/^[0-9]+\.?[0-9]+$/)
])
const hasValidValue = R.compose(isValidValue, getValue)

const handleValidationError = R.compose(
    R.call(R.__, 'ValidationError'),
    getHandleErrorFn
)

const changeBaseWrapped = (from, to, number) => api.get('https://api.tech/numbers/base', { from, to, number })

const thenResult = R.andThen(R.prop('result'))

const changeBase = R.curry(
    R.pipe(
        changeBaseWrapped,
        thenResult,
    )
)

const getAnimalWrapped = (id) => api.get(`https://animals.tech/${id}`, {})
const getAnimal = R.pipe(
    getAnimalWrapped,
    thenResult
)

const curriedPow = R.curry(Math.pow)

const processSequence = ({ value, writeLog, handleError, handleSuccess }) => {
    const handleValidationError = () => handleError('ValidationError')
    const tapLog = R.tap(writeLog)

    const processValueStep2 = R.pipe(
        Math.round,
        tapLog,
        changeBase(10, 2),
        R.andThen(tapLog),
        R.andThen(R.length),
        R.andThen(tapLog),
        R.andThen(curriedPow(R.__, 2)),
        R.andThen(tapLog),
        R.andThen(R.mathMod(R.__, 3)),
        R.andThen(tapLog),
        R.andThen(getAnimal),
        R.andThen(handleSuccess),
        R.otherwise(handleError)
    )

    const processValueStep1 = R.pipe(
        tapLog,
        R.ifElse(isValidValue, processValueStep2, handleValidationError)
    )

    processValueStep1(value)
}

// const processValue = R.pipe(
//     R.modify('value', Math.round),
//     tapLogValue,
//     R.modify('value', changeBase(10, 2)),
//     tapAndThenValue(console.log),
// tapLogValue,
// R.modify('value', R.length),
// tapLogValue,
// R.modify('value', R.mathMod(R.__, 3)),
// tapLogValue,
// )

// const processValue = (data) => {
//     R.modify('value', Math.round)(data)
//     tapLogValue(data)
//     R.modify('value', changeBase(10, 2)(data).then(
//         tapLogValue
//     ))
// }


// const processSequence = R.pipe(
//     tapLogValue,
//     R.ifElse(hasValidValue, processValue, handleValidationError)
// )


export default processSequence;
