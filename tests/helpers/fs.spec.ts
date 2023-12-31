//-- NodeJS
import crypto, {Hash} from 'node:crypto';
import {ReadStream, Stats, WriteStream} from 'node:fs';
import fs, {CreateReadStreamOptions, FileHandle} from 'node:fs/promises';
import os from 'node:os';
import nodePath from 'node:path';

//-- NPM Packages
import chai, {expect} from 'chai';
import {SinonStub, SinonStubbedInstance, createStubInstance, stub} from 'sinon';
import sinonChai from 'sinon-chai';
import {en, en_US, base, Faker} from '@faker-js/faker';

//-- Project Code
import fsHelper from '@src/helpers/fs';

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
            )}" as random data seed for "module:helpers.fs" tests...`
        );
    });
    describe('.exists', () => {
        let accessStub: SinonStub<
            Parameters<typeof fs.access>,
            ReturnType<typeof fs.access>
        >;
        before(() => {
            accessStub = stub(fs, 'access');
        });
        beforeEach(() => {
            accessStub.reset();
            accessStub.callThrough();
        });
        after(() => {
            accessStub.restore();
        });
        it('should call fs.access with the correct arguments', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.F_OK).resolves(undefined);

            //-- When
            await fsHelper.exists(path);

            //-- Then
            expect(accessStub).to.have.been.calledOnceWithExactly(
                path,
                fs.constants.F_OK
            );
        });
        it('should return `true` if the file exists on the disk', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.F_OK).resolves(undefined);

            //-- When
            const r = await fsHelper.exists(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the file does not exist on the disk', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub
                .withArgs(path, fs.constants.F_OK)
                .rejects(new Error('File does not exist'));

            //-- When
            const r = await fsHelper.exists(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isFile', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isFile(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isFile() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isFile(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isFile() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isFile(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isFile() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isFile(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isFile(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isDirectory', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isDirectory(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isDirectory() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isDirectory(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a directory', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isDirectory() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isDirectory(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a directory', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isDirectory() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isDirectory(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isDirectory(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isBlockDevice', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isBlockDevice(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isBlockDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isBlockDevice(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a block device', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isBlockDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isBlockDevice(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a block device', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isBlockDevice() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isBlockDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isBlockDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isCharacterDevice', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isCharacterDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a character device', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isCharacterDevice() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a character device', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isCharacterDevice() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isCharacterDevice(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isSocket', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isSocket(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSocket() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isSocket(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a socket', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSocket() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSocket(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a socket', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSocket() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSocket(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isSocket(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isSymbolicLink', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let statStub: SinonStub<
            Parameters<typeof fs.stat>,
            ReturnType<typeof fs.stat>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            statStub = stub(fs, 'stat');
        });
        beforeEach(() => {
            existsStub.reset();
            statStub.reset();
            existsStub.callThrough();
            statStub.callThrough();
        });
        after(() => {
            existsStub.restore();
            statStub.restore();
        });
        it('should call `exists` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();

            //-- When
            await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should call `fs.stat` on the path', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSymbolicLink() {
                    return true;
                }
            } as Stats);

            //-- When
            await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(statStub).to.have.been.calledOnceWith(path);
        });
        it('should return `true` if the path is a symbolic link', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSymbolicLink() {
                    return true;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists but is not a symbolic link', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(true);
            statStub.withArgs(path).resolves({
                isSymbolicLink() {
                    return false;
                }
            } as Stats);

            //-- When
            const r = await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path does not exist', async () => {
            //-- Given
            const path = fake.system.filePath();
            existsStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.isSymbolicLink(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isReadable', () => {
        let accessStub: SinonStub<
            Parameters<typeof fs.access>,
            ReturnType<typeof fs.access>
        >;
        before(() => {
            accessStub = stub(fs, 'access');
        });
        beforeEach(() => {
            accessStub.reset();

            accessStub.callThrough();
        });
        after(() => {
            accessStub.restore();
        });
        it('should call `fs.access` with the correct arguments', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.F_OK).resolves(undefined);

            //-- When
            await fsHelper.isReadable(path);

            //-- Then
            expect(accessStub).to.have.been.calledOnceWith(
                path,
                fs.constants.R_OK
            );
        });
        it('should return `true` if the path is readable', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.R_OK).resolves(undefined);

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path is not readable', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub
                .withArgs(path, fs.constants.R_OK)
                .rejects(new Error('File does not exist'));

            //-- When
            const r = await fsHelper.isReadable(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.isWritable', () => {
        let accessStub: SinonStub<
            Parameters<typeof fs.access>,
            ReturnType<typeof fs.access>
        >;
        before(() => {
            accessStub = stub(fs, 'access');
        });
        beforeEach(() => {
            accessStub.reset();

            accessStub.callThrough();
        });
        after(() => {
            accessStub.restore();
        });
        it('should call `fs.access` with the correct arguments', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.W_OK).resolves(undefined);

            //-- When
            await fsHelper.isWritable(path);

            //-- Then
            expect(accessStub).to.have.been.calledOnceWith(
                path,
                fs.constants.W_OK
            );
        });
        it('should return `true` if the path is readable', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub.withArgs(path, fs.constants.W_OK).resolves(undefined);

            //-- When
            const r = await fsHelper.isWritable(path);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path is not writable', async () => {
            //-- Given
            const path = fake.system.filePath();
            accessStub
                .withArgs(path, fs.constants.W_OK)
                .rejects(new Error('File does not exist'));

            //-- When
            const r = await fsHelper.isWritable(path);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('createDirectory', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let isDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.isDirectory>,
            ReturnType<typeof fsHelper.isDirectory>
        >;
        let mkdirStub: SinonStub<
            Parameters<typeof fs.mkdir>,
            ReturnType<typeof fs.mkdir>
        >;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            isDirectoryStub = stub(fsHelper, 'isDirectory');
            mkdirStub = stub(fs, 'mkdir');
        });
        beforeEach(() => {
            existsStub.reset();
            isDirectoryStub.reset();
            mkdirStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            isDirectoryStub.rejects(new Error('Stubbed function'));
            mkdirStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            existsStub.restore();
            isDirectoryStub.restore();
            mkdirStub.restore();
        });
        it('should called `exists` with the path provided', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            existsStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(path).resolves(false);
            mkdirStub
                .withArgs(path, {
                    recursive: true
                })
                .resolves();

            //-- When
            await fsHelper.createDirectory(path);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(path);
        });
        it('should called `isDirectory` with the path provided if the path exists', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            existsStub.withArgs(path).resolves(true);
            isDirectoryStub.withArgs(path).resolves(true);
            mkdirStub
                .withArgs(path, {
                    recursive: true
                })
                .resolves();

            //-- When
            await fsHelper.createDirectory(path);

            //-- Then
            expect(isDirectoryStub).to.have.been.calledOnceWith(path);
        });
        it('should call `mkdir` with the path provided and the `recursive` flag set to `true` by default', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            existsStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(path).resolves(false);
            mkdirStub
                .withArgs(path, {
                    recursive: true
                })
                .resolves();

            //-- When
            await fsHelper.createDirectory(path);

            //-- Then
            expect(mkdirStub).to.have.been.calledOnceWith(path, {
                recursive: true
            });
        });
        it('should call `mkdir` with the path provided and the given `recursive` flag', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            existsStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(path).resolves(false);
            mkdirStub
                .withArgs(path, {
                    recursive: false
                })
                .resolves();

            //-- When
            await fsHelper.createDirectory(path, false);

            //-- Then
            expect(mkdirStub).to.have.been.calledOnceWith(path, {
                recursive: false
            });
        });
        it('should throw an `Error` if the path exists and is not a directory', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            existsStub.withArgs(path).resolves(true);
            isDirectoryStub.withArgs(path).resolves(false);
            mkdirStub
                .withArgs(path, {
                    recursive: true
                })
                .resolves();

            //-- When
            try {
                await fsHelper.createDirectory(path);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(
                        `"${path}" already exists and is not a directory`
                    );
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
    });
    describe('createFile', () => {
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let isFileStub: SinonStub<
            Parameters<typeof fsHelper.isFile>,
            ReturnType<typeof fsHelper.isFile>
        >;
        let isDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.isDirectory>,
            ReturnType<typeof fsHelper.isDirectory>
        >;
        let createDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.createDirectory>,
            ReturnType<typeof fsHelper.createDirectory>
        >;
        let openStub: SinonStub<
            Parameters<typeof fs.open>,
            ReturnType<typeof fs.open>
        >;
        let closeStub: SinonStub<
            Parameters<fs.FileHandle['close']>,
            ReturnType<fs.FileHandle['close']>
        >;
        let fileHandleStub: SinonStubbedInstance<fs.FileHandle>;
        before(() => {
            existsStub = stub(fsHelper, 'exists');
            isFileStub = stub(fsHelper, 'isFile');
            isDirectoryStub = stub(fsHelper, 'isDirectory');
            createDirectoryStub = stub(fsHelper, 'createDirectory');
            openStub = stub(fs, 'open');
            closeStub = stub();

            fileHandleStub = {
                close: closeStub
            } as SinonStubbedInstance<fs.FileHandle>;
        });
        beforeEach(() => {
            existsStub.reset();
            isFileStub.reset();
            isDirectoryStub.reset();
            createDirectoryStub.reset();
            openStub.reset();
            closeStub.reset();

            existsStub.rejects(new Error('Stubbed function'));
            isFileStub.rejects(new Error('Stubbed function'));
            isDirectoryStub.rejects(new Error('Stubbed function'));
            createDirectoryStub.rejects(new Error('Stubbed function'));
            openStub.rejects(new Error('Stubbed function'));
            closeStub.rejects(new Error('Stubbed method'));
        });
        after(() => {
            existsStub.restore();
            isFileStub.restore();
            isDirectoryStub.restore();
            createDirectoryStub.restore();
            openStub.restore();
        });
        it('should call `exists` with the path provided', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path);

            //-- Then
            expect(existsStub).to.have.been.calledWith(path);
        });
        it('should call `isFile` with the path provided if the path exists', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(true);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(true);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path);

            //-- Then
            expect(isFileStub).to.have.been.calledOnceWith(path);
        });
        it('should call `exists` with the directory name of the provided path', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path);

            //-- Then
            expect(existsStub).to.have.been.calledWith(dirPath);
        });
        it('should call `isDirectory` with the directory name of the provided path if the directory name exists', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path);

            //-- Then
            expect(isDirectoryStub).to.have.been.calledOnceWith(dirPath);
        });
        it('should call `createDirectory` with the directory name of the provided path if the directory name does not exist and the `ensureDirectory` flag is `true`', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(false);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            createDirectoryStub.resolves();
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path, true);

            //-- Then
            expect(createDirectoryStub).to.have.been.calledOnceWith(dirPath);
        });
        it('should call `open` with the provided path and the `a` flag', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path);

            //-- Then
            expect(openStub).to.have.been.calledOnceWith(path, 'a');
        });
        it('should call `open` with the provided path and then immediately close the returned file descriptor', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            await fsHelper.createFile(path);

            //-- Then
            expect(
                closeStub
            ).to.have.been.calledOnce.and.to.have.been.calledImmediatelyAfter(
                openStub
            );
        });
        it('should throw an `Error` if the provided path exists and is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(true);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(true);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            try {
                await fsHelper.createFile(path);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${path}" already exists but is not a file`);
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the directory name of the path exists and is not a directory', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(true);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(false);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            try {
                await fsHelper.createFile(path);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(
                        `Cannot create file "${path}", parent path exists but is not a directory`
                    );
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the directory name of the path does not exists and the `ensureDirectory` flag is `false`', async () => {
            //-- Given
            const path = fake.system.filePath();
            const dirPath = nodePath.dirname(path);
            existsStub.withArgs(path).resolves(false);
            existsStub.withArgs(dirPath).resolves(false);
            isFileStub.withArgs(path).resolves(false);
            isDirectoryStub.withArgs(dirPath).resolves(false);
            openStub.withArgs(path, 'a').resolves(fileHandleStub);
            closeStub.resolves();

            //-- When
            try {
                await fsHelper.createFile(path);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(
                        `Cannot create file "${path}", parent path does not exist`
                    );
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.createReadableStream', () => {
        let isReadableStub: SinonStub<
            Parameters<typeof fsHelper.isReadable>,
            ReturnType<typeof fsHelper.isReadable>
        >;
        let openStub: SinonStub<
            Parameters<typeof fs.open>,
            ReturnType<typeof fs.open>
        >;
        let createReadStreamStub: SinonStub<
            Parameters<FileHandle['createReadStream']>,
            ReturnType<FileHandle['createReadStream']>
        >;
        let fdStub: SinonStubbedInstance<FileHandle>;
        const readStreamStub = createStubInstance(ReadStream);
        before(() => {
            isReadableStub = stub(fsHelper, 'isReadable');
            openStub = stub(fs, 'open');
            createReadStreamStub = stub();
            fdStub = {
                createReadStream: createReadStreamStub
            } as SinonStubbedInstance<FileHandle>;
        });
        beforeEach(() => {
            isReadableStub.reset();
            openStub.reset();
            createReadStreamStub.reset();

            isReadableStub.callThrough();
            openStub.callThrough();
            createReadStreamStub.resolves(readStreamStub);
        });
        after(() => {
            isReadableStub.restore();
            openStub.restore();
        });
        it('should call `fs.open` with the given path and the `r` option', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            await fsHelper.createReadableStream(path);

            expect(openStub).to.have.been.calledOnceWith(path, 'r');
        });
        it('should call `createReadStream` on the resulting file descriptor', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            await fsHelper.createReadableStream(path);

            expect(createReadStreamStub).to.have.been.calledOnce;
        });
        it('should pass any options provided to `createReadStream`', async () => {
            //-- Given
            const path = fake.system.filePath();
            const opts: CreateReadStreamOptions = {};
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            await fsHelper.createReadableStream(path, opts);

            expect(createReadStreamStub).to.have.been.calledOnceWith(opts);
        });
        it('should return a `ReadStream` on success', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);
            createReadStreamStub.resolves(readStreamStub);

            //-- When
            const r = await fsHelper.createReadableStream(path);

            //-- Then
            expect(r).to.equal(readStreamStub);
        });
        it('should throw an `Error` if the path is not readable', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(false);
            openStub.withArgs(path, 'r').resolves(fdStub);

            //-- When
            try {
                await fsHelper.createReadableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${path}" is not readable`);
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the path cannot be opened', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub
                .withArgs(path, 'r')
                .rejects(
                    new Error(`Failed to open "${path}", permission denied`)
                );

            //-- When
            try {
                await fsHelper.createReadableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`Failed to open "${path}", permission denied`);
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the creation of the `ReadStream` fails', async () => {
            //-- Given
            const path = fake.system.filePath();
            isReadableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'r').resolves(fdStub);
            createReadStreamStub.rejects(
                new Error('Failed to create ReadStream, malloc failed')
            );

            //-- When
            try {
                await fsHelper.createReadableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals('Failed to create ReadStream, malloc failed');
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.createWriteableStream', () => {
        let isWritableStub: SinonStub<
            Parameters<typeof fsHelper.isWritable>,
            ReturnType<typeof fsHelper.isWritable>
        >;
        let openStub: SinonStub<
            Parameters<typeof fs.open>,
            ReturnType<typeof fs.open>
        >;
        let createWriteStreamStub: SinonStub<
            Parameters<FileHandle['createWriteStream']>,
            ReturnType<FileHandle['createWriteStream']>
        >;
        let fdStub: SinonStubbedInstance<FileHandle>;
        const writeStreamStub = createStubInstance(WriteStream);
        before(() => {
            isWritableStub = stub(fsHelper, 'isWritable');
            openStub = stub(fs, 'open');
            createWriteStreamStub = stub();
            fdStub = {
                createWriteStream: createWriteStreamStub
            } as SinonStubbedInstance<FileHandle>;
        });
        beforeEach(() => {
            isWritableStub.reset();
            openStub.reset();
            createWriteStreamStub.reset();

            isWritableStub.callThrough();
            openStub.callThrough();
            createWriteStreamStub.resolves(writeStreamStub);
        });
        after(() => {
            isWritableStub.restore();
            openStub.restore();
        });
        it('should call `fs.open` with the given path and the `w` option', async () => {
            //-- Given
            const path = fake.system.filePath();
            isWritableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'w').resolves(fdStub);

            //-- When
            await fsHelper.createWritableStream(path);

            expect(openStub).to.have.been.calledOnceWith(path, 'w');
        });
        it('should call `createWriteStream` on the resulting file descriptor', async () => {
            //-- Given
            const path = fake.system.filePath();
            isWritableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'w').resolves(fdStub);

            //-- When
            await fsHelper.createWritableStream(path);

            expect(createWriteStreamStub).to.have.been.calledOnce;
        });
        it('should pass any options provided to `createWriteStream`', async () => {
            //-- Given
            const path = fake.system.filePath();
            const opts: CreateReadStreamOptions = {};
            isWritableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'w').resolves(fdStub);

            //-- When
            await fsHelper.createWritableStream(path, opts);

            expect(createWriteStreamStub).to.have.been.calledOnceWith(opts);
        });
        it('should return a `WriteStream` on success', async () => {
            //-- Given
            const path = fake.system.filePath();
            isWritableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'w').resolves(fdStub);
            createWriteStreamStub.resolves(writeStreamStub);

            //-- When
            const r = await fsHelper.createWritableStream(path);

            //-- Then
            expect(r).to.equal(writeStreamStub);
        });
        it('should throw an `Error` if the path is not writable', async () => {
            //-- Given
            const path = fake.system.filePath();
            isWritableStub.withArgs(path).resolves(false);
            openStub.withArgs(path, 'w').resolves(fdStub);

            //-- When
            try {
                await fsHelper.createWritableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${path}" is not writable`);
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the path cannot be opened', async () => {
            //-- Given
            const path = fake.system.filePath();
            isWritableStub.withArgs(path).resolves(true);
            openStub
                .withArgs(path, 'w')
                .rejects(
                    new Error(`Failed to open "${path}", permission denied`)
                );

            //-- When
            try {
                await fsHelper.createWritableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`Failed to open "${path}", permission denied`);
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the creation of the `WriteStream` fails', async () => {
            //-- Given
            const path = fake.system.filePath();
            isWritableStub.withArgs(path).resolves(true);
            openStub.withArgs(path, 'w').resolves(fdStub);
            createWriteStreamStub.rejects(
                new Error('Failed to create WriteStream, malloc failed')
            );

            //-- When
            try {
                await fsHelper.createWritableStream(path);
            } catch (ex) {
                //-- Then
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals('Failed to create WriteStream, malloc failed');
                return;
            }
            //-- Then
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.checkFileIntegrity', () => {
        let isFileStub: SinonStub<
            Parameters<typeof fsHelper.isFile>,
            ReturnType<typeof fsHelper.isFile>
        >;
        let createReadableStreamStub: SinonStub<
            Parameters<typeof fsHelper.createReadableStream>,
            ReturnType<typeof fsHelper.createReadableStream>
        >;
        let createHashStub: SinonStub<
            Parameters<typeof crypto.createHash>,
            ReturnType<typeof crypto.createHash>
        >;
        let digestStub: SinonStub<
            Parameters<Hash['digest']>,
            ReturnType<Hash['digest']>
        >;
        let pipeStub: SinonStub<
            Parameters<ReadStream['pipe']>,
            ReturnType<ReadStream['pipe']>
        >;
        let closeStub: SinonStub<
            Parameters<ReadStream['close']>,
            ReturnType<ReadStream['close']>
        >;
        let readStreamStub: SinonStubbedInstance<ReadStream>;
        let hashStub: SinonStubbedInstance<Hash>;
        before(() => {
            isFileStub = stub(fsHelper, 'isFile');
            createReadableStreamStub = stub(fsHelper, 'createReadableStream');
            createHashStub = stub(crypto, 'createHash');
            digestStub = stub();
            pipeStub = stub();
            closeStub = stub();
            readStreamStub = {
                pipe: pipeStub,
                close: closeStub
            } as SinonStubbedInstance<ReadStream>;
            hashStub = {
                digest: digestStub
            } as SinonStubbedInstance<Hash>;
        });
        beforeEach(() => {
            isFileStub.reset();
            createReadableStreamStub.reset();
            createHashStub.reset();
            digestStub.reset();
            pipeStub.reset();
            closeStub.reset();

            isFileStub.resolves(false);
            createReadableStreamStub.resolves(readStreamStub);
            createHashStub.returns(hashStub);
            digestStub.returns(
                fake.string.hexadecimal({
                    length: 32
                })
            );
        });
        after(() => {
            isFileStub.restore();
            createReadableStreamStub.restore();
            createHashStub.restore();
        });
        it('should pipe the `ReadStream` to the `Hash`', async () => {
            //-- Given
            const path = fake.system.filePath();
            const hash = fake.string.hexadecimal({
                length: 32
            });
            isFileStub.withArgs(path).resolves(true);
            createReadableStreamStub.withArgs(path).resolves(readStreamStub);
            digestStub.returns(hash);

            //-- When
            await fsHelper.checkFileIntegrity(path, hash);

            //-- Then
            expect(pipeStub).to.have.been.calledOnceWithExactly(hashStub);
        });
        it('should close the `ReadStream` after getting the hash', async () => {
            //-- Given
            const path = fake.system.filePath();
            const hash = fake.string.hexadecimal({
                length: 32
            });
            isFileStub.withArgs(path).resolves(true);
            createReadableStreamStub.withArgs(path).resolves(readStreamStub);
            digestStub.returns(hash);

            //-- When
            await fsHelper.checkFileIntegrity(path, hash);

            //-- Then
            expect(closeStub).to.have.been.calledOnceWithExactly();
            expect(closeStub).to.have.been.calledImmediatelyAfter(digestStub);
        });
        it('should return `true` if the path exists and has contents matching the integrity hash', async () => {
            //-- Given
            const path = fake.system.filePath();
            const hash = fake.string.hexadecimal({
                length: 32
            });
            isFileStub.withArgs(path).resolves(true);
            createReadableStreamStub.withArgs(path).resolves(readStreamStub);
            digestStub.returns(hash);

            //-- When
            const r = await fsHelper.checkFileIntegrity(path, hash);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the path exists and has contents not matching the integrity hash', async () => {
            //-- Given
            const path = fake.system.filePath();
            const hash = fake.string.hexadecimal({
                length: 32
            });
            const actualHash = fake.string.hexadecimal({
                length: 32
            });
            isFileStub.withArgs(path).resolves(true);
            createReadableStreamStub.withArgs(path).resolves(readStreamStub);
            digestStub.returns(actualHash);

            //-- When
            const r = await fsHelper.checkFileIntegrity(path, hash);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the path is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            const hash = fake.string.hexadecimal({
                length: 32
            });
            isFileStub.withArgs(path).resolves(false);

            //-- When
            const r = await fsHelper.checkFileIntegrity(path, hash);

            //-- Then
            expect(r).to.be.false;
        });
        it('should throw an `Error` if a `ReadStream` cannot be created', async () => {
            //-- Given
            const path = fake.system.filePath();
            const hash = fake.string.hexadecimal({
                length: 32
            });
            isFileStub.withArgs(path).resolves(true);
            createReadableStreamStub
                .withArgs(path)
                .rejects(
                    new Error(`Failed to open "${path}", permission denied`)
                );
            digestStub.returns(hash);

            //-- When
            try {
                await fsHelper.checkFileIntegrity(path, hash);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`Failed to open "${path}", permission denied`);
                return;
            }

            //-- Then
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.createTempDirectory', () => {
        let mkdtempStub: SinonStub<
            Parameters<typeof fs.mkdtemp>,
            ReturnType<typeof fs.mkdtemp>
        >;
        let isDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.isDirectory>,
            ReturnType<typeof fsHelper.isDirectory>
        >;
        before(() => {
            mkdtempStub = stub(fs, 'mkdtemp');
            isDirectoryStub = stub(fsHelper, 'isDirectory');
        });
        beforeEach(() => {
            mkdtempStub.reset();
            isDirectoryStub.reset();

            mkdtempStub.rejects(new Error('Stubbed function'));
            isDirectoryStub.resolves(false);
        });
        after(() => {
            mkdtempStub.restore();
            isDirectoryStub.restore();
        });
        it('should call `mkdtemp` with the full prefix and `utf-8` as the encoding', async () => {
            //-- Given
            const root = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            mkdtempStub
                .withArgs(nodePath.join(root, prefix), 'utf-8')
                .resolves(nodePath.join(root, `${prefix}${suffix}`));
            isDirectoryStub.withArgs(root).resolves(true);

            //-- When
            await fsHelper.createTempDirectory(root, prefix);

            //-- Then
            expect(mkdtempStub).to.have.been.calledOnceWith(
                nodePath.join(root, prefix),
                'utf-8'
            );
        });
        it('return the path to the new temporary directory', async () => {
            //-- Given
            const root = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            mkdtempStub
                .withArgs(nodePath.join(root, prefix), 'utf-8')
                .resolves(nodePath.join(root, `${prefix}${suffix}`));
            isDirectoryStub.withArgs(root).resolves(true);

            //-- When
            const r = await fsHelper.createTempDirectory(root, prefix);

            //-- Then
            expect(r).to.equal(nodePath.join(root, `${prefix}${suffix}`));
        });
        it('should throw an `Error` if the root is not a directory', async () => {
            //-- Given
            const root = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            mkdtempStub
                .withArgs(nodePath.join(root, prefix), 'utf-8')
                .resolves(nodePath.join(root, `${prefix}${suffix}`));
            isDirectoryStub.withArgs(root).resolves(false);

            //-- When
            try {
                await fsHelper.createTempDirectory(root, prefix);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(
                        `Cannot create a temporary directory in "${root}", not a directory`
                    );
                return;
            }
            expect.fail('Function did not throw when it should have');
        });
        it('should throw an `Error` if the temporary directory cannot be created', async () => {
            //-- Given
            const root = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            mkdtempStub
                .withArgs(nodePath.join(root, prefix), 'utf-8')
                .rejects(
                    new Error(
                        `Cannot create directory "${nodePath.join(
                            root,
                            `${prefix}${suffix}`
                        )}", permission denied`
                    )
                );
            isDirectoryStub.withArgs(root).resolves(true);

            //-- When
            try {
                await fsHelper.createTempDirectory(root, prefix);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(
                        `Cannot create directory "${nodePath.join(
                            root,
                            `${prefix}${suffix}`
                        )}", permission denied`
                    );
                return;
            }
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.createOSTempDirectory', () => {
        let tmpdirStub: SinonStub<
            Parameters<typeof os.tmpdir>,
            ReturnType<typeof os.tmpdir>
        >;
        let createTempDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.createTempDirectory>,
            ReturnType<typeof fsHelper.createTempDirectory>
        >;
        before(() => {
            tmpdirStub = stub(os, 'tmpdir');
            createTempDirectoryStub = stub(fsHelper, 'createTempDirectory');
        });
        beforeEach(() => {
            tmpdirStub.reset();
            createTempDirectoryStub.reset();

            tmpdirStub.throws(new Error('Stubbed function'));
            createTempDirectoryStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            tmpdirStub.restore();
            createTempDirectoryStub.restore();
        });
        it('should call `tmpdir`', async () => {
            //-- Given
            const osTmpDir = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            tmpdirStub.returns(osTmpDir);
            createTempDirectoryStub
                .withArgs(osTmpDir, prefix)
                .resolves(nodePath.join(osTmpDir, `${prefix}${suffix}`));

            //-- When
            await fsHelper.createOSTempDirectory(prefix);

            //-- Then
            expect(tmpdirStub).to.have.been.calledOnce;
        });
        it('should call `createTempDirectory` with the OS temporary directory and the given prefix', async () => {
            //-- Given
            const osTmpDir = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            tmpdirStub.returns(osTmpDir);
            createTempDirectoryStub
                .withArgs(osTmpDir, prefix)
                .resolves(nodePath.join(osTmpDir, `${prefix}${suffix}`));

            //-- When
            await fsHelper.createOSTempDirectory(prefix);

            //-- Then
            expect(createTempDirectoryStub).to.have.been.calledOnceWith(
                osTmpDir,
                prefix
            );
        });
        it('should return the path to the new temporary directory', async () => {
            //-- Given
            const osTmpDir = fake.system.directoryPath();
            const prefix = fake.system.fileName({
                extensionCount: 0
            });
            const suffix = fake.string.alphanumeric({
                length: 6
            });
            tmpdirStub.returns(osTmpDir);
            createTempDirectoryStub
                .withArgs(osTmpDir, prefix)
                .resolves(nodePath.join(osTmpDir, `${prefix}${suffix}`));

            //-- When
            const r = await fsHelper.createOSTempDirectory(prefix);

            //-- Then
            expect(r).to.equal(nodePath.join(osTmpDir, `${prefix}${suffix}`));
        });
    });
    describe('.removeFile', () => {
        let isFileStub: SinonStub<
            Parameters<typeof fsHelper.isFile>,
            ReturnType<typeof fsHelper.isFile>
        >;
        let rmStub: SinonStub<
            Parameters<typeof fs.rm>,
            ReturnType<typeof fs.rm>
        >;
        before(() => {
            isFileStub = stub(fsHelper, 'isFile');
            rmStub = stub(fs, 'rm');
        });
        beforeEach(() => {
            isFileStub.reset();
            rmStub.reset();

            isFileStub.rejects(new Error('Stubbed function'));
            rmStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            isFileStub.restore();
            rmStub.restore();
        });
        it('should call `isFile` with the provided path', async () => {
            //-- Given
            const path = fake.system.filePath();
            isFileStub.withArgs(path).resolves(true);
            rmStub
                .withArgs(path, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.removeFile(path);

            //-- Then
            expect(isFileStub).to.have.been.calledOnceWith(path);
        });
        it('should call `rm` with the provided path and the `recursive` option set to `false`', async () => {
            //-- Given
            const path = fake.system.filePath();
            isFileStub.withArgs(path).resolves(true);
            rmStub
                .withArgs(path, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.removeFile(path);

            //-- Then
            expect(rmStub).to.have.been.calledOnceWith(path, {
                recursive: false,
                force: false
            });
        });
        it('should call `rm` with the provided path and `force` option', async () => {
            //-- Given
            const path = fake.system.filePath();
            isFileStub.withArgs(path).resolves(true);
            rmStub
                .withArgs(path, {
                    recursive: false,
                    force: true
                })
                .resolves();

            //-- When
            await fsHelper.removeFile(path, true);

            //-- Then
            expect(rmStub).to.have.been.calledOnceWith(path, {
                recursive: false,
                force: true
            });
        });
        it('throw an `Error` if the path is not a file', async () => {
            //-- Given
            const path = fake.system.filePath();
            isFileStub.withArgs(path).resolves(false);
            rmStub
                .withArgs(path, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.removeFile(path);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${path}" is not a file`);
                return;
            }

            //-- Then
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.removeDirectory', () => {
        let isDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.isDirectory>,
            ReturnType<typeof fsHelper.isDirectory>
        >;
        let rmStub: SinonStub<
            Parameters<typeof fs.rm>,
            ReturnType<typeof fs.rm>
        >;
        before(() => {
            isDirectoryStub = stub(fsHelper, 'isDirectory');
            rmStub = stub(fs, 'rm');
        });
        beforeEach(() => {
            isDirectoryStub.reset();
            rmStub.reset();

            isDirectoryStub.rejects(new Error('Stubbed function'));
            rmStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            isDirectoryStub.restore();
            rmStub.restore();
        });
        it('should call `isDirectory` with the provided path', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            isDirectoryStub.withArgs(path).resolves(true);
            rmStub
                .withArgs(path, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.removeDirectory(path);

            //-- Then
            expect(isDirectoryStub).to.have.been.calledOnceWith(path);
        });
        it('should call `rm` with the provided path and the `recursive` option set to `true`', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            isDirectoryStub.withArgs(path).resolves(true);
            rmStub
                .withArgs(path, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.removeDirectory(path);

            //-- Then
            expect(rmStub).to.have.been.calledOnceWith(path, {
                recursive: true,
                force: false
            });
        });
        it('should call `rm` with the provided path and `force` option', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            isDirectoryStub.withArgs(path).resolves(true);
            rmStub
                .withArgs(path, {
                    recursive: true,
                    force: true
                })
                .resolves();

            //-- When
            await fsHelper.removeDirectory(path, true);

            //-- Then
            expect(rmStub).to.have.been.calledOnceWith(path, {
                recursive: true,
                force: true
            });
        });
        it('throw an `Error` if the path is not a directory', async () => {
            //-- Given
            const path = fake.system.directoryPath();
            isDirectoryStub.withArgs(path).resolves(false);
            rmStub
                .withArgs(path, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.removeDirectory(path);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${path}" is not a directory`);
                return;
            }

            //-- Then
            expect.fail('Function did not throw when it should have');
        });
    });
    describe('.copyFile', () => {
        let isFileStub: SinonStub<
            Parameters<typeof fsHelper.isFile>,
            ReturnType<typeof fsHelper.isFile>
        >;
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let isDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.isDirectory>,
            ReturnType<typeof fsHelper.isDirectory>
        >;
        let cpStub: SinonStub<
            Parameters<typeof fs.cp>,
            ReturnType<typeof fs.cp>
        >;
        before(() => {
            isFileStub = stub(fsHelper, 'isFile');
            existsStub = stub(fsHelper, 'exists');
            isDirectoryStub = stub(fsHelper, 'isDirectory');
            cpStub = stub(fs, 'cp');
        });
        beforeEach(() => {
            isFileStub.reset();
            existsStub.reset();
            isDirectoryStub.reset();
            cpStub.reset();

            isFileStub.rejects(new Error('Stubbed function'));
            existsStub.rejects(new Error('Stubbed function'));
            isDirectoryStub.rejects(new Error('Stubbed function'));
            cpStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            isFileStub.restore();
            existsStub.restore();
            isDirectoryStub.restore();
            cpStub.restore();
        });
        it('should call `isFile` with the provided source path', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyFile(source, destination);

            //-- Then
            expect(isFileStub).to.have.been.calledOnceWith(source);
        });
        it('should call `exists` with the provided destination path', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyFile(source, destination);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(destination);
        });
        it('should call `isDirectory` with the provided destination path if the destination path exists', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyFile(source, destination);

            //-- Then
            expect(isDirectoryStub).to.have.been.calledOnceWith(destination);
        });
        it('should call `cp` with the provided source path, destination path, and the `recursive` option set to `false`', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyFile(source, destination);

            //-- Then
            expect(cpStub).to.have.been.calledOnceWith(source, destination, {
                recursive: false,
                force: false
            });
        });
        it('should call `cp` with the provided source path, destination path, and `force` option', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: true
                })
                .resolves();

            //-- When
            await fsHelper.copyFile(source, destination, true);

            //-- Then
            expect(cpStub).to.have.been.calledOnceWith(source, destination, {
                recursive: false,
                force: true
            });
        });
        it('should throw an `Error` if the source path is not a file', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(false);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyFile(source, destination);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${source}" is not a file`);
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('throw an `Error` if the destination path exists, is a file, and the `force` flag is `false`', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyFile(source, destination);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${destination}" already exists`);
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('should not throw an `Error` if the destination path exists, is a file, and the `force` flag is `true`', async () => {
            //-- Given
            const source = fake.system.filePath();
            const destination = fake.system.directoryPath();
            isFileStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: false,
                    force: true
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyFile(source, destination, true);
            } catch {
                expect.fail('Function threw when it should not have');
            }
        });
    });
    describe('.copyDirectory', () => {
        let isFileStub: SinonStub<
            Parameters<typeof fsHelper.isFile>,
            ReturnType<typeof fsHelper.isFile>
        >;
        let existsStub: SinonStub<
            Parameters<typeof fsHelper.exists>,
            ReturnType<typeof fsHelper.exists>
        >;
        let isDirectoryStub: SinonStub<
            Parameters<typeof fsHelper.isDirectory>,
            ReturnType<typeof fsHelper.isDirectory>
        >;
        let cpStub: SinonStub<
            Parameters<typeof fs.cp>,
            ReturnType<typeof fs.cp>
        >;
        before(() => {
            isFileStub = stub(fsHelper, 'isFile');
            existsStub = stub(fsHelper, 'exists');
            isDirectoryStub = stub(fsHelper, 'isDirectory');
            cpStub = stub(fs, 'cp');
        });
        beforeEach(() => {
            isFileStub.reset();
            existsStub.reset();
            isDirectoryStub.reset();
            cpStub.reset();

            isFileStub.rejects(new Error('Stubbed function'));
            existsStub.rejects(new Error('Stubbed function'));
            isDirectoryStub.rejects(new Error('Stubbed function'));
            cpStub.rejects(new Error('Stubbed function'));
        });
        after(() => {
            isFileStub.restore();
            existsStub.restore();
            isDirectoryStub.restore();
            cpStub.restore();
        });
        it('should call `isDirectory` with the provided source path', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(false);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyDirectory(source, destination);

            //-- Then
            expect(isDirectoryStub).to.have.been.calledOnceWith(source);
        });
        it('should call `exists` with the provided destination path', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(false);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyDirectory(source, destination);

            //-- Then
            expect(existsStub).to.have.been.calledOnceWith(destination);
        });
        it('should call `isFile` with the provided destination path if the destination path exists', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (source === destination) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyDirectory(source, destination);
            } catch {
                //-- Silence error
            }

            //-- Then
            expect(isFileStub).to.have.been.calledOnceWith(destination);
        });
        it('should call `cp` with the provided source path, destination path, and the `recursive` option set to `true`', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(false);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            await fsHelper.copyDirectory(source, destination);

            //-- Then
            expect(cpStub).to.have.been.calledOnceWith(source, destination, {
                recursive: true,
                force: false
            });
        });
        it('should call `cp` with the provided source path, destination path, and `force` option', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(false);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: true
                })
                .resolves();

            //-- When
            await fsHelper.copyDirectory(source, destination, true);

            //-- Then
            expect(cpStub).to.have.been.calledOnceWith(source, destination, {
                recursive: true,
                force: true
            });
        });
        it('should throw an `Error` if the source path is not a directory', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(false);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyDirectory(source, destination);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${source}" is not a directory`);
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('throw an `Error` if the destination path exists and is a file', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(false);
            isFileStub.withArgs(destination).resolves(true);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyDirectory(source, destination);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(
                        `"${destination}" already exists and is a file`
                    );
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('throw an `Error` if the destination path exists, is a directory, and the `force` flag is `false`', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: false
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyDirectory(source, destination);
            } catch (ex) {
                expect(ex)
                    .to.be.an.instanceOf(Error)
                    .with.property('message')
                    .that.equals(`"${destination}" already exists`);
                return;
            }

            expect.fail('Function did not throw when it should have');
        });
        it('should not throw an `Error` if the destination path exists, is a directory, and the `force` flag is `true`', async () => {
            //-- Given
            const source = fake.system.directoryPath();
            let destination = fake.system.directoryPath();
            // HACK: On the off chance the call returns the same value twice
            while (destination === source) {
                destination = fake.system.directoryPath();
            }
            isDirectoryStub.withArgs(source).resolves(true);
            existsStub.withArgs(destination).resolves(true);
            isDirectoryStub.withArgs(destination).resolves(true);
            isFileStub.withArgs(destination).resolves(false);
            cpStub
                .withArgs(source, destination, {
                    recursive: true,
                    force: true
                })
                .resolves();

            //-- When
            try {
                await fsHelper.copyDirectory(source, destination, true);
            } catch {
                expect.fail('Function threw when it should not have');
            }
        });
    });
    describe('.archiveDirectory', () => {
        it('should call `exists` with the output path');
        it('should call `exists` with the source path');
        it('should call `isDirectory` with the source path');
        it('should call `createFile` with the output path');
        it('should call `createWritableStream` with the output path');
        it(
            'should call `createArchiver` with the archive format `zip` if a zip archive is requested'
        );
        it(
            'should call `createArchiver` with the archive format `zip` if a zip archive is not explicitly requested but the output path ends in `.zip`'
        );
        it(
            'should call `createArchiver` with the archive format `tar` if a tar archive is requested'
        );
        it(
            'should call `createArchiver` with the archive format `tar` if a tar archive is not explicitly requested but the output path ends in `.tar`'
        );
        it(
            'should call `createArchiver` with the archive format `tar` if a tgz archive is requested'
        );
        it(
            'should call `createArchiver` with the archive format `tar` if a tar archive is not explicitly requested but the output path ends in `.tgz` or `.tar.gz`'
        );
        it(
            'should call `createArchiver` with `zlib` defined and the `level` property set to the requested compression level if the requested archive format is `zip`'
        );
        it(
            'should call `createArchiver` with neither `zlib` or `gzipOptions` defined and the `level` property set to the requested compression level if the requested archive format is `tar`'
        );
        it(
            'should call `createArchiver` with `gzipOptions` defined and the `level` property set to the requested compression level if the requested archive format is `tgz`'
        );
        it(
            'should call `createArchiver` with `store` set to `true` if the `level` property set to the requested compression level is set to `0` and the requested archive format is `zip`'
        );
        it(
            'should call `createArchiver` with `store` set to `true` if the `level` property set to the requested compression level is set to `0` and the requested archive format is `tgz`'
        );
        it(
            'should call `archiver.pipe` with the writable stream of the output file'
        );
        it(
            'should call `archiver.directory` with the source path and the `destpath` parameter set to `false`'
        );
        it('should call `archiver.finalize` once the directory is provided');
        it('should call `os.close` once the archive is finalized');
        it('should call `os.close` if the archive fails to be finalized');
        it('should call `os.close` if the write stream fails to be created');
        it('should call `removeFile` if the archive fails to be finalized');
        it('should call `removeFile` if the write stream fails to be created');
        it('should throw an `Error` if the output path already exists');
        it('should throw an `Error` if the source path does not exist');
        it(
            'should throw an `Error` if the source path exists but is not a directory'
        );
        it(
            'should throw an `Error` if no archive type is provided and it cannot be deduced from the output path'
        );
    });
});
