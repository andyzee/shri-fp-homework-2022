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

const isShorterThan10 = R.o(R.lt(R.__, 10), R.length)
const isLongerThan2 = R.o(R.gt(R.__, 2), R.length)
const isValidNumberString = R.test(/^[0-9]+\.?[0-9]*$/)

const isValidValue = R.allPass([
    isShorterThan10,
    isLongerThan2,
    isValidNumberString
])

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

const takePow2 = x => Math.pow(x, 2)
const takeMod3 = R.mathMod(R.__, 3)

const processSequence = ({ value, writeLog, handleError, handleSuccess }) => {
    const handleValidationError = () => handleError('ValidationError')
    const tapLog = R.tap(writeLog)

    const processValueStep3 = R.pipeWith(R.andThen, [
        changeBase(10, 2),
        tapLog,
        R.length,
        tapLog,
        takePow2,
        tapLog,
        takeMod3,
        tapLog,
        getAnimal,
        handleSuccess,
    ])

    const processValueStep2 = R.pipe(
        Math.round,
        tapLog,
        processValueStep3,
        R.otherwise(handleError)
    )

    const processValueStep1 = R.pipe(
        tapLog,
        R.ifElse(isValidValue, processValueStep2, handleValidationError)
    )

    processValueStep1(value)
}

export default processSequence;
