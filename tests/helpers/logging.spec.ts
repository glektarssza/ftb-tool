//-- NodeJS
import {Writable} from 'node:stream';

//-- NPM Packages
import chai, {expect} from 'chai';
import {match, stub, SinonStub, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';
import chalk from 'chalk';

//-- Project Code
import loggingHelper from '@src/helpers/logging';

//-- Test Utils
import {parseOptionalEnvInteger} from '../utils';

chai.use(sinonChai);

/**
 * The data faker instance for these tests.
 */
const fake = new Faker({
    locale: [en, en_US, base]
});

describe('module:helpers.fs', () => {
    before(() => {
        console.debug(
            `Using "${fake.seed(
                parseOptionalEnvInteger('TESTS_FAKER_SEED') ?? undefined
            )}"`
        );
    });
    beforeEach(() => {
        loggingHelper.resetVerbose();
        loggingHelper.clearAllLoggers();
    });
    describe('.getVerbose', () => {
        it('should return `false` by default', () => {
            //-- Given

            //-- When
            const r = loggingHelper.getVerbose();

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if verbose logs have been enabled', () => {
            //-- Given
            loggingHelper.setVerbose(true);

            //-- When
            const r = loggingHelper.getVerbose();

            //-- Then
            expect(r).to.be.true;
        });
    });
    describe('.setVerbose', () => {
        it('should set the value returned by `getVerbose`', () => {
            //-- Given
            loggingHelper.setVerbose(true);

            //-- When
            loggingHelper.setVerbose(false);

            //-- Then
            expect(loggingHelper.getVerbose()).to.be.false;
        });
        it('should update the logging level on any existing loggers', () => {
            //-- Given
            const name = fake.lorem.word();
            const logger = new loggingHelper.Logger(name);

            //-- When
            loggingHelper.setVerbose(true);

            //-- Then
            expect(logger.level).to.equal(loggingHelper.LogLevel.Verbose);

            //-- When
            loggingHelper.setVerbose(false);

            //-- Then
            expect(logger.level).to.equal(loggingHelper.LogLevel.Info);
        });
    });
    describe('.resetVerbose', () => {
        it('should reset the value returned by `getVerbose` to the default', () => {
            //-- Given
            loggingHelper.setVerbose(true);

            //-- When
            loggingHelper.resetVerbose();

            //-- Then
            expect(loggingHelper.getVerbose()).to.be.false;
        });
    });
    describe('.getAllLoggers', () => {
        it('should return an array', () => {
            //-- Given

            //-- When
            const r = loggingHelper.getAllLoggers();

            //-- Then
            expect(Array.isArray(r)).to.be.true;
        });
        it('should return an array containing any created loggers', () => {
            //-- Given
            const name = fake.lorem.word();
            const logger = new loggingHelper.Logger(name);

            //-- When
            const r = loggingHelper.getAllLoggers();

            expect(r).to.contain(logger);
        });
        it('should return an array that cannot modify the internal array', () => {
            //-- Given
            const arr = loggingHelper.getAllLoggers();

            //-- When
            arr.push({} as InstanceType<typeof loggingHelper.Logger>);

            //-- Then
            expect(loggingHelper.getAllLoggers()).to.be.empty;
        });
    });
    describe('.clearAllLoggers', () => {
        it('should reset the internal list of loggers', () => {
            //-- Given
            const name = fake.lorem.word();
            new loggingHelper.Logger(name);

            //-- When
            loggingHelper.clearAllLoggers();

            //-- Then
            expect(loggingHelper.getAllLoggers()).to.be.empty;
        });
    });
    describe('class:Logger', () => {
        describe('.constructor', () => {
            it('should set the `name` property', () => {
                //-- Given
                const name = fake.lorem.word();

                //-- When
                const r = new loggingHelper.Logger(name);

                //-- Then
                expect(r.name).to.equal(name);
            });
            it('should set the `level` property to `Info` by default', () => {
                //-- Given
                const name = fake.lorem.word();

                //-- When
                const r = new loggingHelper.Logger(name);

                //-- Then
                expect(r.level).to.equal(loggingHelper.LogLevel.Info);
            });
            it('should set the `level` property to `Verbose` if verbose logging is enabled', () => {
                //-- Given
                const name = fake.lorem.word();
                loggingHelper.setVerbose(true);

                //-- When
                const r = new loggingHelper.Logger(name);

                //-- Then
                expect(r.level).to.equal(loggingHelper.LogLevel.Verbose);
            });
            it('should set the `outputStream` property to `process.stdout` by default', () => {
                //-- Given
                const name = fake.lorem.word();

                //-- When
                const r = new loggingHelper.Logger(name);

                //-- Then
                expect(r.outputStream).to.equal(process.stdout);
            });
            it('should set the `outputStream` property to the provided stream', () => {
                //-- Given
                const name = fake.lorem.word();
                const stream = {} as Writable;

                //-- When
                const r = new loggingHelper.Logger(name, stream);

                //-- Then
                expect(r.outputStream).to.equal(stream);
            });
            it('should add the new logger to the internal list of loggers', () => {
                //-- Given
                const name = fake.lorem.word();

                //-- When
                const r = new loggingHelper.Logger(name);

                //-- Then
                expect(loggingHelper.getAllLoggers()).to.contain(r);
            });
        });
        describe('.log', () => {
            const originalInfoColorFunc = loggingHelper.LogLevelColor['Info'];
            let writeStub: SinonStub<
                Parameters<Writable['write']>,
                ReturnType<Writable['write']>
            >;
            let colorStub: SinonStub<
                Parameters<chalk.ChalkFunction>,
                ReturnType<chalk.ChalkFunction>
            >;
            let outputStreamStub: SinonStubbedInstance<Writable>;
            before(() => {
                writeStub = stub();
                colorStub = stub();
                outputStreamStub = {
                    write: writeStub
                } as SinonStubbedInstance<Writable>;
            });
            beforeEach(() => {
                writeStub.reset();
                colorStub.reset();

                loggingHelper.LogLevelColor['Info'] = colorStub;

                writeStub.throws(new Error('Stubbed method'));
                colorStub.throws(new Error('Stubbed function'));
            });
            after(() => {
                loggingHelper.LogLevelColor['Info'] = originalInfoColorFunc!;
            });
            it('should do nothing if the requested logging level is greater than the configured logging level on the logger', () => {
                //-- Given
                const name = fake.lorem.word();
                const message = fake.lorem.sentence();
                const logger = new loggingHelper.Logger(name, outputStreamStub);
                logger.level = loggingHelper.LogLevel.None;

                //-- When
                logger.log(loggingHelper.LogLevel.Info, message);

                //-- Then
                expect(writeStub).to.not.have.been.called;
            });
            it('should call the color function set in the `LogLevelColor` table', () => {
                //-- Given
                const name = fake.lorem.word();
                const message = fake.lorem.sentence();
                const logger = new loggingHelper.Logger(name, outputStreamStub);
                colorStub.returns(
                    `${
                        loggingHelper.LogLevelDescriptor[
                            loggingHelper.LogLevel[loggingHelper.LogLevel.Info]
                        ]
                    }`
                );
                writeStub.returns(true);

                //-- When
                logger.log(loggingHelper.LogLevel.Info, message);

                //-- Then
                expect(colorStub).to.have.been.calledOnceWith(
                    loggingHelper.LogLevelDescriptor[
                        loggingHelper.LogLevel[loggingHelper.LogLevel.Info]
                    ]
                );
            });
            it('should not call the color function set in the `LogLevelColor` table if that value is `null`', () => {
                //-- Given
                const name = fake.lorem.word();
                const message = fake.lorem.sentence();
                const logger = new loggingHelper.Logger(name, outputStreamStub);
                colorStub.returns(
                    `${
                        loggingHelper.LogLevelDescriptor[
                            loggingHelper.LogLevel[loggingHelper.LogLevel.Info]
                        ]
                    }`
                );
                writeStub.returns(true);
                loggingHelper.LogLevelColor['Info'] = null;

                //-- When
                logger.log(loggingHelper.LogLevel.Info, message);

                //-- Then
                expect(colorStub).to.not.have.been.called;
            });
            it('should call `write` on the `outputStream` property with the provided message', () => {
                //-- Given
                const name = fake.lorem.word();
                const message = fake.lorem.sentence();
                const logger = new loggingHelper.Logger(name, outputStreamStub);
                colorStub.returns(
                    `${
                        loggingHelper.LogLevelDescriptor[
                            loggingHelper.LogLevel[loggingHelper.LogLevel.Info]
                        ]
                    }`
                );
                writeStub.returns(true);

                //-- When
                logger.log(loggingHelper.LogLevel.Info, message);

                //-- Then
                expect(writeStub).to.have.been.calledWithMatch(message);
            });
            it('should use the provided logging level prefix if one is defined in the `LogLevelDescriptor` table', () => {});
            it(
                'not use any logging level prefix if one is not defined in the `LogLevelDescriptor` table'
            );
        });
        describe('.fatal', () => {});
        describe('.error', () => {});
        describe('.warn', () => {});
        describe('.info', () => {});
        describe('.verbose', () => {});
        describe('.debug', () => {});
        describe('.trace', () => {});
    });
});
