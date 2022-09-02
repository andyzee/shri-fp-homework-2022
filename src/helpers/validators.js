/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { allPass, always, apply, complement, compose, count, equals, filter, find, flip, groupBy, groupWith, gte, isNil, juxt, length, lt, lte, map, partialRight, prop, values } from "ramda"


// хелпер для логирования внутри композиций
const log = (arg) => {
    console.log(arg)
    return arg
}

// геттеры
const getTriangle = prop('triangle')
const getStar = prop('star')
const getSquare = prop('square')
const getCircle = prop('circle')

// предикаты для цветов
const isWhite = equals('white')
const isRed = equals('red')
const isGreen = equals('green')
const isBlue = equals('blue')
const isOrange = equals('orange')

const isNotWhite = complement(isWhite)
const isNotRed = complement(isRed)
const isNotRedOrWhite = allPass([isNotRed, isNotWhite])

// предикаты с учетом формы и цвета
const hasRedStar = compose(isRed, getStar)
const hasGreenSquare = compose(isGreen, getSquare)
const hasWhiteTriangle = compose(isWhite, getTriangle)
const hasWhiteCircle = compose(isWhite, getCircle)
const hasBlueCircle = compose(isBlue, getCircle)
const hasOrangeSquare = compose(isOrange, getSquare)
const hasGreenTriangle = compose(isGreen, getTriangle)
const hasNotWhiteTriangle = compose(isNotWhite, getTriangle)
const hasNotWhiteSquare = compose(isNotWhite, getSquare)

const hasTriangleAndSquareOfSameColor = compose(
    apply(equals),
    juxt([getTriangle, getSquare])
)

// фильтры
const filterAndCount = filterFn => compose(
    count(filterFn),
    values
)
const countGreen = filterAndCount(isGreen)
const countRed = filterAndCount(isRed)
const countBlue = filterAndCount(isBlue)
const countOrange = filterAndCount(isOrange)

// предикаты на количество
const countGreenEq2 = compose(equals(2), countGreen)
const countRedEq1 = compose(equals(1), countRed)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    hasRedStar,
    hasGreenSquare,
    hasWhiteTriangle,
    hasWhiteCircle
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
    lte(2),
    countGreen
)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
    apply(equals),
    juxt([countRed, countBlue])
)

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    hasBlueCircle,
    hasRedStar,
    hasOrangeSquare
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    complement(isNil),
    find(lte(3)),
    map(length),
    groupWith(equals),
    filter(isNotWhite),
    values
)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия

export const validateFieldN6 = allPass([
    hasGreenTriangle,
    countGreenEq2,
    countRedEq1
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(
    equals(4),
    countOrange
)

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
    isNotRedOrWhite,
    getStar
)

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(
    equals(4),
    countGreen
)

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    hasNotWhiteTriangle,
    hasNotWhiteSquare,
    hasTriangleAndSquareOfSameColor
])
