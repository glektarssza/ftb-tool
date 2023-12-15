import {SinonStub} from 'sinon';

/**
 * A callable function.
 *
 * @typeparam TArguments - A tuple representing the types of the input arguments
 * to the function.
 * @typeparam TReturn - The return type of the function.
 */
export type CallableFunction<TArguments extends unknown[], TReturn> = (
    ...args: TArguments
) => TReturn;

/**
 * A callable constructor.
 *
 * @typeparam TClass - The class which the constructor will create a new
 * instance of.
 * @typeparam TArguments - A tuple representing the types of the input arguments
 * to the constructor.
 */
export type CallableConstructor<TClass, TArguments extends unknown[]> = new (
    ...args: TArguments
) => TClass;

/**
 * A callable.
 *
 * @typeparam TArguments - A tuple representing the types of the input arguments
 * to the callable.
 * @typeparam TReturn - The return type of the callable.
 */
export type Callable<TArguments extends unknown[], TReturn> =
    | CallableFunction<TArguments, TReturn>
    | CallableConstructor<TReturn, TArguments>;

/**
 * A generic type for anything that has been stubbed with
 * [`sinon`](https://sinonjs.org/).
 *
 * @typeparam TType - The type being stubbed.
 */
export type StubbedType<TType> = TType extends Callable<
    infer TArguments,
    infer TReturn
>
    ? SinonStub<TArguments, TReturn>
    : TType;

/**
 * A property on an object that has been stubbed with
 * [`sinon`](https://sinonjs.org/).
 */
export type StubbedProperty<
    TObject,
    TProperty extends keyof TObject
> = StubbedType<TObject[TProperty]>;

/**
 * An object which has had all properties stubbed with
 * [`sinon`](https://sinonjs.org/).
 */
export type StubbedObject<TObject> = {
    [TProperty in keyof TObject]: StubbedProperty<TObject, TProperty>;
};
