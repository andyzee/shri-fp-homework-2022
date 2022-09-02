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

const changeBaseWrapped = (from, to, number) => api.numbersBaseController({ from, to, number })


const changeBase = R.curry(
    R.pipe(
        changeBaseWrapped,
        R.prop('result')
    )
)

const processValue = R.pipe(
    R.modify('value', Math.round),
    tapLogValue,
    R.modify('value', changeBase(10, 2)),
    tapLogValue,
    R.modify('value', R.length),
    tapLogValue,
    R.modify('value', R.mathMod(R.__, 3)),
    tapLogValue,
)

const processSequence = R.pipe(
    R.clone,
    tapLogValue,
    R.ifElse(hasValidValue, processValue, handleValidationError)
)

// Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
// C помощью API / numbers / base перевести из 10 - й системы счисления в двоичную, результат записать в writeLog
// Взять кол - во символов в полученном от API числе записать в writeLog
// Возвести в квадрат с помощью Javascript записать в writeLog
// Взять остаток от деления на 3, записать в writeLog
// C помощью API / animals.tech / id / name получить случайное животное используя полученный остаток в качестве id
// Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге

// api.get('https://api.tech/numbers/base', { from: 2, to: 10, number: '01011010101' }).then(({ result }) => {
//     writeLog(result);
// });

// wait(2500).then(() => {
//     writeLog('SecondLog')

//     return wait(1500);
// }).then(() => {
//     writeLog('ThirdLog');

//     return wait(400);
// }).then(() => {
//     handleSuccess('Done');
// });


export default processSequence;
